/**
 * This module is responsible for enabling an element to display images with cornerstone
 */

import { addEnabledElement } from './enabledElements.js';
import { resize } from './resize.js';
import { requestAnimationFrame } from './internal/requestAnimationFrame.js';

export function enable (element, options) {
  if (element === undefined) {
    throw 'enable: parameter element cannot be undefined';
  }

    // If this enabled element has the option set for WebGL, we should
    // Check if this device actually supports it
  if (options && options.renderer && options.renderer.toLowerCase() === 'webgl') {
    if (cornerstone.webGL.renderer.isWebGLAvailable()) {
            // If WebGL is available on the device, initialize the renderer
            // And return the renderCanvas from the WebGL rendering path
      console.log('Using WebGL rendering path');

      cornerstone.webGL.renderer.initRenderer();
      options.renderer = 'webgl';
    } else {
            // If WebGL is not available on this device, we will fall back
            // To using the Canvas renderer
      console.error('WebGL not available, falling back to Canvas renderer');
      delete options.renderer;
    }
  }

  const canvas = document.createElement('canvas');

  element.appendChild(canvas);

  const el = {
    element,
    canvas,
    image: undefined, // Will be set once image is loaded
    invalid: false, // True if image needs to be drawn, false if not
    needsRedraw: true,
    options,
    data: {}
  };

  addEnabledElement(el);

  resize(element, true);

  function draw () {
    if (el.canvas === undefined) {
      return;
    }
    if (el.needsRedraw && el.image !== undefined) {
      const start = new Date();
      let render = el.image.render;

      el.image.stats = {
        lastGetPixelDataTime: -1.0,
        laststoredPixelDataToCanvasImageDataTime: -1.0,
        lastPutImageDataTime: -1.0,
        lastRenderTime: -1.0,
        lastLutGenerateTime: -1.0
      };

      if (!render) {
        render = el.image.color ? cornerstone.renderColorImage : cornerstone.renderGrayscaleImage;
      }

      render(el, el.invalid);

      const context = el.canvas.getContext('2d');

      const end = new Date();
      const diff = end - start;

      const eventData = {
        viewport: el.viewport,
        element: el.element,
        image: el.image,
        enabledElement: el,
        canvasContext: context,
        renderTimeInMs: diff
      };

      el.image.stats.lastRenderTime = diff;

      el.invalid = false;
      el.needsRedraw = false;
      const event = new CustomEvent('CornerstoneImageRendered', { detail: eventData });

      el.element.dispatchEvent(event);
    }

    requestAnimationFrame(draw);
  }

  draw();

  return element;
}
