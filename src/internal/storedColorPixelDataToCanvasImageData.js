/**
 * This module contains a function to convert stored pixel values to display pixel values using a LUT
 */
export function storedColorPixelDataToCanvasImageData (image, lut, canvasImageDataData) {

  let start = (window.performance ? performance.now() : Date.now());
  const pixelData = image.getPixelData();

  image.stats.lastGetPixelDataTime = (window.performance ? performance.now() : Date.now()) - start;


  start = (window.performance ? performance.now() : Date.now());
  const minPixelValue = image.minPixelValue;
  let canvasImageDataIndex = 0;
  let storedPixelDataIndex = 0;
  const numPixels = pixelData.length;

    // NOTE: As of Nov 2014, most javascript engines have lower performance when indexing negative indexes.
    // We have a special code path for this case that improves performance.  Thanks to @jpambrun for this enhancement
  if (minPixelValue < 0) {
    while (storedPixelDataIndex < numPixels) {
      canvasImageDataData[canvasImageDataIndex++] = lut[pixelData[storedPixelDataIndex++] + (-minPixelValue)]; // Red
      canvasImageDataData[canvasImageDataIndex++] = lut[pixelData[storedPixelDataIndex++] + (-minPixelValue)]; // Green
      canvasImageDataData[canvasImageDataIndex] = lut[pixelData[storedPixelDataIndex] + (-minPixelValue)]; // Blue
      storedPixelDataIndex += 2;
      canvasImageDataIndex += 2;
    }
  } else {
    while (storedPixelDataIndex < numPixels) {
      canvasImageDataData[canvasImageDataIndex++] = lut[pixelData[storedPixelDataIndex++]]; // Red
      canvasImageDataData[canvasImageDataIndex++] = lut[pixelData[storedPixelDataIndex++]]; // Green
      canvasImageDataData[canvasImageDataIndex] = lut[pixelData[storedPixelDataIndex]]; // Blue
      storedPixelDataIndex += 2;
      canvasImageDataIndex += 2;
    }
  }
  image.stats.laststoredPixelDataToCanvasImageDataTime = (window.performance ? performance.now() : Date.now()) - start;
}
