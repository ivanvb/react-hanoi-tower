export function getPixelValue(element, attribute) {
    return Number.parseInt(window.getComputedStyle(element)[attribute].replace('px', ''));
}
