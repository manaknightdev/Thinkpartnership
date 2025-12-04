import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

mixpanel.init(MIXPANEL_TOKEN, {
  debug: true,   // enable in dev to see logs
  track_pageview: true, // tracks page views automatically
});

export default mixpanel;
