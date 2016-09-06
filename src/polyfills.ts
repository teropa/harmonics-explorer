import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

// Include Web Audio API Shim so that the app works on Safari's
// antiquated Web Audio implementation.
require("@mohayonao/web-audio-api-shim");

if (process.env.ENV === 'production') {
  // Production
} else {
  // Development
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}