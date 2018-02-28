module.exports = {
  // Required settings
  OS_BASE_URL: {required: true},

  // Optional settings
  OS_VIEWER_BASE_PATH: {
    default: 'viewer/'
  },
  OS_SNIPPETS_GA: {required: false},
  OS_SNIPPETS_RAVEN: {required: false},
  SENTRY_DSN: {required: false},

  // Each service will use OS_BASE_URL unless overridden by these:
  OS_VIEWER_API_COSMO_HOST: {
    default: '//cosmopolitan.openspending.org/v1/'
  },
  OS_API_URL: {required: false},
  OS_EXPLORER_URL: {required: false},
  OS_CONDUCTOR_URL: {required: false},
  OS_VIEWER_DATAMINE_HOST: {required: false}
};
