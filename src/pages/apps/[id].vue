<template>
	<s-editor-layout
		:title="app.name"
		tone="orange"
	>
		<template #form>
			<app-edit-form
				v-model:name="app.name"
				v-model:description="app.description"
				v-model:group="app.group"
				v-model:icon="app.icon"
				v-model:icon-path="app.iconPath"
				v-model:paths="app.paths"
				v-model:arguments="app.arguments"
				v-model:run-as-administrator="app.runAsAdministrator"
				:fallback-image="wlMouseHubImage"
				class="w-100"
			/>
		</template>
	</s-editor-layout>
</template>

<script setup>
	import wlMouseHubImage from "@/assets/images/apps/wl-mouse-hub.png";

	const app = reactive({
		id: 0,
		name: "WL Mouse Hub",
		description: "",
		group: "Без группы",
		icon: "",
		iconPath: "D:/Logitech/logitech.ico",
		paths: ["C:/Program Files/WLMouse/WLMouse.exe"],
		arguments: "",
		runAsAdministrator: true,
	});
</script>

<route lang="yaml">
meta:
  layout: default
  title: Настройка программы
  icon: mdi-view-grid-outline
  parentTitle: Программы
  parentRoute: /apps/
</route>
