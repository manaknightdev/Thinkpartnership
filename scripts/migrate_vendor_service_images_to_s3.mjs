#!/usr/bin/env node
// Migration: Re-upload vendor service images stored as /uploads/... to S3 and update DB
// Usage:
//   VENDOR_TOKEN=... BASE_URL=https://baas.mytechpassport.com node scripts/migrate_vendor_service_images_to_s3.mjs
// Optional:
//   PROJECT_ID=thinkpartnership PAGE_SIZE=50 START_PAGE=1 DRY_RUN=true

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import os from 'os';

const BASE_URL = process.env.BASE_URL || 'https://baas.mytechpassport.com';
const PROJECT_ID = process.env.PROJECT_ID || 'thinkpartnership';
const VENDOR_TOKEN = process.env.VENDOR_TOKEN;
const PAGE_SIZE = Number(process.env.PAGE_SIZE || 50);
const START_PAGE = Number(process.env.START_PAGE || 1);
const DRY_RUN = String(process.env.DRY_RUN || 'false').toLowerCase() === 'true';

if (!VENDOR_TOKEN) {
  console.error('Missing VENDOR_TOKEN env. Aborting.');
  process.exit(1);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${VENDOR_TOKEN}`,
  },
  timeout: 60000,
});

function isRelativeUpload(imagePath) {
  if (!imagePath) return false;
  if (typeof imagePath !== 'string') return false;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return false;
  return imagePath.startsWith('/uploads/');
}

async function fetchAllServices() {
  const services = [];
  let page = START_PAGE;
  while (true) {
    const url = `/api/marketplace/vendor/services?page=${page}&limit=${PAGE_SIZE}`;
    const { data } = await api.get(url);
    if (data?.error) throw new Error(data.message || 'Failed to fetch services');
    const batch = data?.services || [];
    services.push(...batch);
    const totalPages = data?.pagination?.pages || 1;
    if (page >= totalPages) break;
    page += 1;
  }
  return services;
}

async function downloadToTmp(fullUrl) {
  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'reupload-'));
  const outPath = path.join(tmpDir, path.basename(fullUrl.split('?')[0]));
  const response = await axios.get(fullUrl, { responseType: 'arraybuffer' });
  await fs.promises.writeFile(outPath, response.data);
  return outPath;
}

async function uploadToS3(filePath) {
  const uploadEndpoint = `/v1/api/${PROJECT_ID}/vendor/lambda/s3/upload`;
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  const { data } = await api.post(uploadEndpoint, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
  if (data?.error) throw new Error(data.message || 'Upload failed');
  if (!data?.url) throw new Error('Upload response missing url');
  return data.url;
}

async function updateServiceImages(serviceId, images) {
  const endpoint = `/api/marketplace/vendor/services/${serviceId}`;
  const payload = { images };
  const { data } = await api.put(endpoint, payload);
  if (data?.error) throw new Error(data.message || 'Failed to update service');
  return data;
}

async function migrate() {
  console.log('Starting migration: vendor service images -> S3');
  console.log({ BASE_URL, PROJECT_ID, PAGE_SIZE, START_PAGE, DRY_RUN });

  const services = await fetchAllServices();
  console.log(`Fetched ${services.length} services.`);

  let processed = 0;
  for (const svc of services) {
    const imageList = Array.isArray(svc.images) ? svc.images : [];
    const needs = imageList.filter(isRelativeUpload);
    if (needs.length === 0) {
      continue;
    }

    console.log(`Service ${svc.id} has ${needs.length} image(s) to migrate.`);
    const newImages = [...imageList];

    for (let i = 0; i < imageList.length; i += 1) {
      const img = imageList[i];
      if (!isRelativeUpload(img)) continue;
      const fullUrl = `${BASE_URL}${img}`;
      try {
        if (DRY_RUN) {
          console.log(`DRY_RUN: would migrate ${fullUrl}`);
          continue;
        }
        const tmpPath = await downloadToTmp(fullUrl);
        const s3Url = await uploadToS3(tmpPath);
        newImages[i] = s3Url;
        console.log(`Migrated ${img} -> ${s3Url}`);
      } catch (err) {
        console.error(`Failed to migrate ${fullUrl}:`, err?.message || err);
      }
    }

    if (!DRY_RUN) {
      try {
        await updateServiceImages(svc.id, newImages);
        processed += 1;
        console.log(`Updated service ${svc.id}`);
      } catch (err) {
        console.error(`Failed to update service ${svc.id}:`, err?.message || err);
      }
    }
  }

  console.log(`Done. Services updated: ${processed}`);
}

migrate().catch((e) => {
  console.error('Migration failed:', e?.message || e);
  process.exit(1);
});