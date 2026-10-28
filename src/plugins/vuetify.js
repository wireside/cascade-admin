import "vuetify/styles";
import "../assets/styles/index.scss";
import { en, ru } from "vuetify/locale";
import { cascadeIcons, iconAliases } from "./icons";
import { mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import * as labs from "vuetify/labs/components";

import { createVuetify } from "vuetify";

export default createVuetify({
	components: {
		...labs,
	},
	defaults: {
		VBtn: {
			variant: "flat",
			color: "button",
			height: 44,
			rounded: "md",
		},
		VCheckbox: {
			color: "primary",
			density: "compact",
			hideDetails: true,
			falseIcon: "stop",
			trueIcon: "check",
		},
		VTextField: {
			variant: "outlined",
			density: "comfortable",
			hideDetails: "auto",
			bgColor: "rgba(9, 9, 9, 0.5)",
			baseColor: "rgba(255, 255, 255, 0.08)",
		},
		VMaskInput: {
			variant: "outlined",
			density: "comfortable",
			hideDetails: "auto",
			bgColor: "rgba(9, 9, 9, 0.5)",
			baseColor: "rgba(255, 255, 255, 0.08)",
		},
		VDateInput: {
			variant: "outlined",
			density: "comfortable",
			hideDetails: "auto",
			bgColor: "rgba(9, 9, 9, 0.5)",
			baseColor: "rgba(255, 255, 255, 0.08)",
		},
	},
	theme: {
		defaultTheme: "themeDark",
		themes: {
			themeDark: {
				dark: true,
				colors: {
					white: "#FFFFFF",
					background: "#090909",
					surface: "#111111",
					sidebar: "#0E0E0E",
					button: "#151515",
					panel: "#191919",
					row: "#141414",
					"row-hover": "#1E1E1E",
					"filter-label": "#868686",
					menu: "#212121",
					filter: "#1B1B1B",
					muted: "#686868",
					"on-primary": "#141414",
					"on-button": "#FFFFFF",
					success: "#34D399",
					warning: "#DFBE00",
					info: "#7FB0FF",
					primary: "rgb(171, 244, 62)",
					secondary: "#8A8A8A",
					error: "#F87171",
					red: "#F87171",
					purple: "#B640B9",
					"deep-purple": "#8D5CFC",
					blue: "#3B82F6",
					orange: "#F37D1D",
					green: "#34D399",
					wall: "#4F4F4F",
					control: "rgb(9, 9, 9)",
					"content-primary": "#F6F6F6",
					"content-secondary": "#B3B3B3",
				},
				variables: {
					"border-color": "#FFFFFF",
					"border-opacity": "0.08",
					"theme-gradient-direction": "90deg",
					"theme-primary-gradient": "#4E8AEE",
					"hover-opacity": 0.08,
				},
			},
		},
	},
	display: {
		mobileBreakpoint: "md",
		thresholds: {
			xs: 0,
			sm: 576,
			md: 1020,
			lg: 1490,
			xl: 1920,
			xxl: 2456,
		},
	},
	locale: {
		locale: "ru",
		fallback: "en",
		messages: { ru, en },
	},
	icons: {
		defaultSet: "cascade",
		aliases: iconAliases,
		sets: {
			cascade: cascadeIcons,
			mdi,
		},
	},
});
