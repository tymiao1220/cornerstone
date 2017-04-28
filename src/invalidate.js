/**
 * This module contains a function to make an image is invalid
 */

import { getEnabledElement } from './enabledElements.js';

/**
 * Sets the invalid flag on the enabled element and fire an event
 * @param element
 */
export function invalidate (element) {
  const enabledElement = getEnabledElement(element);

  enabledElement.invalid = true;
  enabledElement.needsRedraw = true;
  const eventData = {
    element
  };
  const event = new CustomEvent('CornerstoneInvalidated', { detail: eventData });

  enabledElement.element.dispatchEvent(event);
}
