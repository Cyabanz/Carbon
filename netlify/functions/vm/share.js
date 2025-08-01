// Netlify function wrapper for session sharing
// This routes share requests to the main VM function with proper path handling

const mainHandler = require('./index.js').handler;

exports.handler = async function(event, context) {
  // Modify the event path to include /share so the main handler can route it properly
  const modifiedEvent = {
    ...event,
    path: '/vm/share',
    rawPath: event.path
  };
  
  return await mainHandler(modifiedEvent, context);
};