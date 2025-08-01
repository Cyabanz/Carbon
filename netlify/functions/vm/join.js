// Netlify function wrapper for session joining
// This routes join requests to the main VM function with proper path handling

const mainHandler = require('./index.js').handler;

exports.handler = async function(event, context) {
  // Modify the event path to include /join so the main handler can route it properly
  const modifiedEvent = {
    ...event,
    path: '/vm/join',
    rawPath: event.path
  };
  
  return await mainHandler(modifiedEvent, context);
};