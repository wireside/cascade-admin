import { h } from "vue";

const files = import.meta.glob("../assets/icons/*.svg", { eager: true, query: "?url", import: "default" });

export const iconAssets = Object.fromEntries(
	Object.entries(files).map(([path, url]) => [path.split("/").pop().replace(".svg", ""), url])
);

export const cascadeIcons = {
	component: (props) =>
		h(props.tag || "i", {
			class: [
				"cascade-icon",
				{ "cascade-icon--up": props.icon === "chevron-up", "cascade-icon--left": props.icon === "chevron-left" },
			],
			"aria-hidden": "true",
			style: {
				"--cascade-icon": `url("${iconAssets[props.icon] || iconAssets[{ "chevron-up": "down", "chevron-left": "right" }[props.icon]]}")`,
			},
		}),
};

export const iconAliases = {
	collapse: "down",
	complete: "check",
	cancel: "close",
	close: "close",
	delete: "close",
	clear: "close",
	success: "check",
	info: "identification-card",
	warning: "bell",
	error: "close",
	prev: "chevron-left",
	next: "right",
	checkboxOn: "check",
	checkboxOff: "stop",
	checkboxIndeterminate: "minus",
	delimiter: "minus",
	sortAsc: "arrow-up",
	sortDesc: "arrow-down",
	expand: "down",
	menu: "sidebar",
	subgroup: "down",
	dropdown: "down",
	tableGroupCollapse: "down",
	tableGroupExpand: "right",
	radioOn: "check",
	radioOff: "stop",
	edit: "pencil",
	ratingEmpty: "star",
	ratingFull: "star",
	ratingHalf: "star",
	loading: "arrow-clockwise",
	first: "arrow-left",
	last: "arrow-right",
	unfold: "arrows-down-up",
	file: "folder",
	plus: "plus",
	minus: "minus",
	calendar: "calendar",
	treeviewCollapse: "down",
	treeviewExpand: "right",
	eyeDropper: "pencil",
	upload: "arrow-line-right",
	color: "sun",
	command: "sidebar",
	ctrl: "sidebar",
	space: "minus",
	shift: "down",
	alt: "sidebar",
	enter: "arrow-line-right",
	arrowup: "down",
	arrowdown: "down",
	arrowleft: "arrow-left",
	arrowright: "arrow-right",
	backspace: "close",
	play: "play",
	pause: "stop",
	fullscreen: "sidebar",
	fullscreenExit: "sidebar",
	volumeHigh: "bell",
	volumeMedium: "bell",
	volumeLow: "bell",
	volumeOff: "bell",
	search: "magnifying-glass",
};
