<template>
	<s-editor-layout
		:title="game.name"
		tone="red"
	>
		<template #form>
			<game-edit-form
				v-model:name="game.name"
				v-model:description="game.description"
				v-model:group="game.group"
				v-model:cover="game.cover"
				v-model:icon="game.icon"
				v-model:paths="game.paths"
				v-model:arguments="game.arguments"
				v-model:run-as-administrator="game.runAsAdministrator"
				class="w-100"
			/>
		</template>

		<template #aside>
			<game-preview
				:game-name="game.name"
				:image="previewImage"
			/>
		</template>
	</s-editor-layout>
</template>

<script setup>
	import dotaImage from "@/assets/images/games/dota.png";

	const game = reactive({
		id: 0,
		name: "Dota 2",
		description: "",
		group: "Без группы",
		cover: "",
		icon: "",
		paths: ["D:/Steam/steam.exe"],
		arguments: "-applaunch 730 -noverifyfiles +fps_max 0 +cl_forcepreload 0 -fullscreen",
		runAsAdministrator: true,
	});

	const previewImage = computed(() => game.icon || game.cover || dotaImage);
</script>

<route lang="yaml">
meta:
  layout: default
  title: Настройка игры
  icon: mdi-controller
  parentTitle: Игры
  parentRoute: /games/
</route>
