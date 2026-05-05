import { computed, isRef } from "vue";
import { nameToHex } from "../utils/color";

/**
 * Return hex value of color
 *
 * @param color string
 * @returns {ComputedRef<string>}
 */
export function useColor(color) {
	return computed(() => nameToHex(isRef(color) ? color.value : color));
}
