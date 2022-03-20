import { getPixelValue } from './DOM';

/**
 * Calculates the top disk position of a column. If it has no disks calculate
 * the bottom-most position, including the padding.
 */
export function getTopDiskCoords(container, currentDisk, topDiskDims) {
    const { width: currentWidth } = currentDisk.getBoundingClientRect();
    if (!topDiskDims) {
        topDiskDims = container.querySelector('.disk')?.getBoundingClientRect();
    }

    if (!topDiskDims) {
        // If the container has no disks, calculate the landing p
        const paddingBottom = getPixelValue(container, 'padding-bottom');
        const { x, y, height, width } = container.getBoundingClientRect();

        const Y_OFFSET = 1;
        const yPos = Math.floor(y + height - paddingBottom - Y_OFFSET);
        const xPos = x + width / 2 - currentWidth / 2;

        return { x: xPos, y: yPos };
    } else {
        const { x: containerX, width: containerWidth } = container.getBoundingClientRect();
        const { y } = topDiskDims;

        return {
            y,
            x: containerX + containerWidth / 2 - currentWidth / 2,
        };
    }
}
