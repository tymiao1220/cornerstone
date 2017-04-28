/**
 * This module is responsible for enabling an element to display images with cornerstone
 */

import { getEnabledElement } from './enabledElements.js';
import { getDefaultViewport } from './internal/getDefaultViewport.js';
import { updateImage } from './updateImage.js';

/**
 * Sets a new image object for a given element
 * @param element
 * @param image
 */
export function displayImage (element, image, viewport) {
  if (element === undefined) {
    throw 'displayImage: parameter element cannot be undefined';
  }
  if (image === undefined) {
    throw 'displayImage: parameter image cannot be undefined';
  }

  const enabledElement = getEnabledElement(element);

  enabledElement.image = image;

  if (enabledElement.viewport === undefined) {
    enabledElement.viewport = getDefaultViewport(enabledElement.canvas, image);
  }

    // Merge viewport
  if (viewport) {
    for (const attrname in viewport) {
      if (viewport[attrname] !== null) {
        enabledElement.viewport[attrname] = viewport[attrname];
      }
    }
  }

  const now = new Date();
  let frameRate;

  if (enabledElement.lastImageTimeStamp !== undefined) {
    const timeSinceLastImage = now.getTime() - enabledElement.lastImageTimeStamp;

    frameRate = (1000 / timeSinceLastImage).toFixed();
  }

  enabledElement.lastImageTimeStamp = now.getTime();

  const newImageEventData = {
    viewport: enabledElement.viewport,
    element: enabledElement.element,
    image: enabledElement.image,
    enabledElement,
    frameRate
  };

  const event = new CustomEvent('CornerstoneNewImage', { detail: newImageEventData });

  enabledElement.element.dispatchEvent(event);

  updateImage(element);
}
