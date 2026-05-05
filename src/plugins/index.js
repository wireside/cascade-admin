/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "./pinia";
import router from "@/router";
import { createRulesPlugin } from "vuetify/labs/rules";

export function registerPlugins(app) {
	app
		.use(vuetify)
		.use(createRulesPlugin({
			aliases: {
				phone: err => {
					return v => (/^\d{10}$/.test(v)) || err || "Введите правильный номер телефона";
				},
			},
		}, vuetify.locale))
		.use(router)
		.use(pinia);
}
