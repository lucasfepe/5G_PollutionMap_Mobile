const OPACITY = 0.4;

const RGB_VALUES = {
    WHITE: { r: 255, g: 255, b: 255 },
    LIGHT_BLUE: { r: 133, g: 190, b: 237 },
    YELLOW: { r: 255, g: 239, b: 160 },
    ORANGE: { r: 254, g: 204, b: 92 },
    RED: { r: 240, g: 59, b: 32 }
} as const;

const HEATMAP_GRADIENT_WITH_OPACITY = [
    { stop: 0, color: `rgba(${RGB_VALUES.WHITE.r},${RGB_VALUES.WHITE.g},${RGB_VALUES.WHITE.b},0)` },
    { stop: 0.25, color: `rgba(${RGB_VALUES.LIGHT_BLUE.r},${RGB_VALUES.LIGHT_BLUE.g},${RGB_VALUES.LIGHT_BLUE.b},${OPACITY})` },
    { stop: 0.5, color: `rgba(${RGB_VALUES.YELLOW.r},${RGB_VALUES.YELLOW.g},${RGB_VALUES.YELLOW.b},${OPACITY})` },
    { stop: 0.75, color: `rgba(${RGB_VALUES.ORANGE.r},${RGB_VALUES.ORANGE.g},${RGB_VALUES.ORANGE.b},${OPACITY})` },
    { stop: 1, color: `rgba(${RGB_VALUES.RED.r},${RGB_VALUES.RED.g},${RGB_VALUES.RED.b},${OPACITY})` }
];

const HEATMAP_GRADIENT_COLORS_ONLY = [
    { stop: 0, color: `rgb(${RGB_VALUES.WHITE.r},${RGB_VALUES.WHITE.g},${RGB_VALUES.WHITE.b})` },
    { stop: 0.25, color: `rgb(${RGB_VALUES.LIGHT_BLUE.r},${RGB_VALUES.LIGHT_BLUE.g},${RGB_VALUES.LIGHT_BLUE.b})` },
    { stop: 0.5, color: `rgb(${RGB_VALUES.YELLOW.r},${RGB_VALUES.YELLOW.g},${RGB_VALUES.YELLOW.b})` },
    { stop: 0.75, color: `rgb(${RGB_VALUES.ORANGE.r},${RGB_VALUES.ORANGE.g},${RGB_VALUES.ORANGE.b})` },
    { stop: 1, color: `rgb(${RGB_VALUES.RED.r},${RGB_VALUES.RED.g},${RGB_VALUES.RED.b})` }
];

export const HEATMAP_COLORS = {
    OPACITY,
    RGB_VALUES,
    HEATMAP_GRADIENT_WITH_OPACITY,
    HEATMAP_GRADIENT_COLORS_ONLY
};
