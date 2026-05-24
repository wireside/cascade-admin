import { useTheme } from "vuetify";
import baseColors from "vuetify/lib/util/colors";

let theme = null;

export function nameToHex(color) {
	theme ??= useTheme();
	const colors = theme.current.value.colors;

	return (
		colors[color] ||
		(baseColors[color] && baseColors[color].base) ||
		(baseColors.shades[color] && baseColors.shades[color]) ||
		color
	);
}

export function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: {
				r: 0,
				g: 0,
				b: 0,
			};
}

export function hexToRgbaCss(hex, alpha) {
	const rgb = hexToRgb(hex);

	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
