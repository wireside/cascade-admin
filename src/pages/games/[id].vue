<template>
	<main class="game-editor-page text-white w-100">
		<section class="game-editor overflow-hidden rounded-lg bg-white bg-opacity-2">
			<header class="game-editor__hero d-flex align-end px-7">
				<div>
					<h1 class="game-editor__title text-white font-weight-bold">{{ game.name }}</h1>
					<div class="text-white opacity-40 mt-1">редактирование</div>
				</div>
			</header>

			<div class="game-editor__body d-flex flex-wrap align-start ga-3 pa-7">
				<game-edit-form
					v-model:name="game.name"
					v-model:description="game.description"
					v-model:group="game.group"
					v-model:cover="game.cover"
					v-model:icon="game.icon"
					v-model:paths="game.paths"
					v-model:arguments="game.arguments"
					v-model:run-as-administrator="game.runAsAdministrator"
					class="game-editor__form"
				/>

				<game-preview
					:game-name="game.name"
					:image="previewImage"
				/>
			</div>
		</section>
	</main>
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
		paths: ["D:/Steam/steam.exe", "", ""],
		arguments: "-applaunch 730 -noverifyfiles +fps_max 0 +cl_forcepreload 0 -fullscreen",
		runAsAdministrator: true,
	});

	const previewImage = computed(() => game.icon || game.cover || dotaImage);
</script>

<style scoped lang="scss">
	.game-editor {
		width: 100%;
		min-width: 0;

		&__hero {
			height: 278px;
			background:
				radial-gradient(90% 180% at 63% -45%, rgba(174, 0, 20, 0.82) 0%, rgba(105, 0, 12, 0.76) 49%, transparent 74%),
				linear-gradient(180deg, rgba(69, 0, 7, 0.82) 0%, rgba(69, 0, 7, 0.72) 54%, #0e0e0e 100%);
		}

		&__title {
			font-size: 20px;
			line-height: 1.2;
		}

		&__body {
			min-width: 0;
			margin-top: -2px;
		}

		&__form {
			flex: 1 1 615px;
			min-width: 615px;
			max-width: 650px;
		}

		@media (max-width: 1199px) {
			&__body {
				flex-direction: column;
			}

			&__form {
				width: 100%;
				max-width: 650px;
				flex: 0 0 auto;
			}
		}
	}
</style>

<route lang="yaml">
meta:
  layout: default
  title: Игры
  icon: mdi-controller
  parentTitle: Приложения
</route>
