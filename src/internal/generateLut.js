/**
 * This module generates a lut for an image
 */

import { getModalityLUT } from './modalityLUT.js';
import { getVOILUT } from './voiLUT.js';

export function generateLutNew (image, windowWidth, windowCenter, invert, modalityLUT, voiLUT) {
  if (image.cachedLut === undefined) {
    image.cachedLut = {};
    image.cachedLut.lutArray = new Uint8ClampedArray(image.maxPixelValue - Math.min(image.minPixelValue, 0) + 1);
  }
  const lut = image.cachedLut.lutArray;
  const maxPixelValue = image.maxPixelValue;
  const minPixelValue = image.minPixelValue;

  const mlutfn = getModalityLUT(image.slope, image.intercept, modalityLUT);
  const vlutfn = getVOILUT(windowWidth, windowCenter, voiLUT);

  let offset = 0;

  if (minPixelValue < 0) {
    offset = minPixelValue;
  }
  let storedValue;

  for (storedValue = image.minPixelValue; storedValue <= maxPixelValue; storedValue++) {
    if (invert) {
      lut[storedValue + (-offset)] = 255 - vlutfn(mlutfn(storedValue));
    } else {
      lut[storedValue + (-offset)] = vlutfn(mlutfn(storedValue));
    }
  }

  return lut;
}

/**
 * Creates a LUT used while rendering to convert stored pixel values to
 * display pixels
 *
 * @param image
 * @returns {Array}
 */
export function generateLut (image, windowWidth, windowCenter, invert, modalityLUT, voiLUT) {
  if (modalityLUT || voiLUT) {
    return generateLutNew(image, windowWidth, windowCenter, invert, modalityLUT, voiLUT);
  }

  if (image.cachedLut === undefined) {
    image.cachedLut = {};
    image.cachedLut.lutArray = new Uint8ClampedArray(image.maxPixelValue - Math.min(image.minPixelValue, 0) + 1);
  }
  const lut = image.cachedLut.lutArray;

  const maxPixelValue = image.maxPixelValue;
  const minPixelValue = image.minPixelValue;
  const slope = image.slope;
  const intercept = image.intercept;
  const localWindowWidth = windowWidth;
  const localWindowCenter = windowCenter;
  let modalityLutValue;
  let voiLutValue;
  let storedValue;

  // NOTE: As of Nov 2014, most javascript engines have lower performance when indexing negative indexes.
  // We improve performance by offsetting the pixel values for signed data to avoid negative indexes
  // When generating the lut and then undo it in storedPixelDataToCanvasImagedata.  Thanks to @jpambrun
  // For this contribution!

  let offset = 0;

  if (minPixelValue < 0) {
    offset = minPixelValue;
  }

  if (invert === true) {
    for (storedValue = image.minPixelValue; storedValue <= maxPixelValue; storedValue++) {
      modalityLutValue = storedValue * slope + intercept;
      voiLutValue = (((modalityLutValue - (localWindowCenter)) / (localWindowWidth) + 0.5) * 255.0);
      lut[storedValue + (-offset)] = voiLutValue;
    }
  } else {
    for (storedValue = image.minPixelValue; storedValue <= maxPixelValue; storedValue++) {
      modalityLutValue = storedValue * slope + intercept;
      voiLutValue = (((modalityLutValue - (localWindowCenter)) / (localWindowWidth) + 0.5) * 255.0);
      lut[storedValue + (-offset)] = voiLutValue;
    }
  }

  return lut;
}
