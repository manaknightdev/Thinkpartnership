import { datadogRum } from '@datadog/browser-rum';

// Initialize RUM
datadogRum.init({
  applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID,
  clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN,
  site: 'datadoghq.com', // or datadoghq.eu if EU
  service: 'rainmakeros-frontend',
  env: 'production',
  version: '1.0.0',
  sampleRate: 100, // % of sessions to capture
  trackInteractions: true, // captures clicks, page views, etc.
});

// Start collecting RUM events
datadogRum.startSessionReplayRecording();
