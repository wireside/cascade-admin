<template>
	<div class="d-flex flex-column ga-4">
		<apps-toolbar
			v-model:expanded="groupsExpanded"
			:groups="groups"
			:selected-app="selectedApp"
		/>

		<apps-group
			v-for="group in groups"
			:key="group.name"
			:group="group"
			:expanded="groupsExpanded"
			:selected-app="selectedApp"
			@select-app="selectApp"
		/>
	</div>
</template>

<script setup>
	import logitechGhubImg from "@/assets/images/apps/logitech-ghub.png";
	import wlMouseHubImg from "@/assets/images/apps/wl-mouse-hub.png";

	const groupsExpanded = ref(true);
	const selectedApp = ref(null);

	const ghub = {
		name: "G HUB",
		img: logitechGhubImg,
	};

	const wlMouse = {
		name: "WL Mouse",
		img: wlMouseHubImg,
	};

	const createApp = (app, id) => ({
		...app,
		id,
	});

	const groups = [
		{
			name: "Девайсы",
			apps: [
				createApp(ghub, "devices-ghub-1"),
				createApp(wlMouse, "devices-wl-mouse-1"),
				...Array.from({ length: 7 }, (_, index) => createApp(ghub, `devices-ghub-repeat-${index + 1}`)),
			],
		},
	];

	const selectApp = (app) => {
		selectedApp.value = app;
	};
</script>

<route lang="yaml">
meta:
  layout: default
  title: Приложения
  icon: mdi-view-grid-outline
</route>
