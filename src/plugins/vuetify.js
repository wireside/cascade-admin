import "vuetify/styles";
import "../assets/styles/index.scss";
import { en, ru } from "vuetify/locale";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as labs from "vuetify/labs/components";
import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";

export default createVuetify({
	components: {
		...labs,
	},
	defaults: {
		VBtn: {
			variant: "flat",
			color: "white",
		},
		VCheckbox: {
			color: "primary",
			density: "compact",
			hideDetails: true,
			falseIcon: "mdi-checkbox-blank-outline",
			trueIcon: "mdi-check",
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
					surface: "rgba(17, 17, 17, 0.6)",
					primary: "rgb(171, 244, 62)",
					secondary: "#999999",
					error: "#DE3D3D",
					control: "rgb(9, 9, 9)",
				},
				variables: {
					"border-color": "#FFFFFF",
					"border-opacity": "0.08",
					"theme-gradient-direction": "90deg",
					"theme-primary-gradient": "#4E8AEE",
				},
			},
		},
	},
	locale: {
		locale: "ru",
		fallback: "en",
		messages: { ru, en },
	},
	icons: {
		defaultSet: "mdi",
		aliases,
		sets: {
			mdi,
		},
	},
});
