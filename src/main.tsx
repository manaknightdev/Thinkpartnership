import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { initGA } from './analytics.ts'
import './posthog.js'
import * as Sentry from "@sentry/react"
import "./mixpanel"; 
import "./amplitude"; // initializes Amplitude
import './datadog';

initGA();
Sentry.init({
    dsn: "https://8a24d178a0edc92bb80822f623970d7e@o4510477647609856.ingest.us.sentry.io/4510477650034689",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true
  });


createRoot(document.getElementById("root")!).render(<App />);
