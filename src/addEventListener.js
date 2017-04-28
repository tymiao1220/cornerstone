/**
 * This module deals with ImageLoaders, loading images and caching images
 */

const eventTypes = {};

// Registers an event listener
export function addEventListener (type, callback) {
  const eventListeners = eventTypes[type] || [];

  eventListeners.push(callback);
  eventTypes[type] = eventListeners;
}

// Removes an event listener
export function removeEventListener (type, callback) {
  const eventListeners = eventTypes[type] || [];
  const index = eventListeners.indexOf(callback);

  eventListeners.splice(index, 1);
}

// Dispatches an event
export function dispatchEvent (type, data) {
  const eventListeners = eventTypes[type];

  if (!eventListeners || eventListeners.length < 1) {
    return;
  }

  for (let i = 0; i < eventListeners.length; i++) {
    eventListeners[i](data);
  }
}
