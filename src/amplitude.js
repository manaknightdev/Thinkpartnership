import * as amplitude from "@amplitude/analytics-browser";

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

amplitude.init(AMPLITUDE_API_KEY, {
  defaultTracking: {
    pageViews: true, // automatically track page views
  },
});

export default amplitude;
