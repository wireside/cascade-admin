<template>
	<s-editor-section
		title="Медиа файлы"
		class="game-media-settings text-white"
	>
		<div class="rounded-md bg-white bg-opacity-2 pa-4 pt-0 pb-7">
			<div class="game-media-settings__label text-white mb-3">Иконка и обложка</div>
			<div class="d-flex align-start ga-2">
				<div class="d-flex flex-column ga-2">
					<game-media-uploader
						v-model="cover"
						title="Загрузите обложку"
						requirements="16:9 • не более 1 МБ"
					/>

					<div class="game-media-settings__notice d-flex align-center rounded-md bg-white bg-opacity-2 pa-4 text-white">
						<div class="opacity-50 d-flex align-center ga-2">
							<v-icon
								icon="mdi-information-outline"
								size="20"
							/>
							<span>Изображения могут обрезаться и масштабироваться</span>
						</div>
					</div>
				</div>

				<game-media-uploader
					v-model="icon"
					title="Загрузите иконку"
					requirements="2:3 • не более 300 КБ"
					portrait
				/>
			</div>
		</div>
	</s-editor-section>
</template>

<script setup>
	const cover = defineModel("cover", { type: String, default: "" });
	const icon = defineModel("icon", { type: String, default: "" });
</script>

<style scoped lang="scss">
	.game-media-settings {
		&__label {
			font-size: 12px;
			line-height: 125%;
			padding-top: 14px;
		}

		&__notice {
			font-size: 12px;
			line-height: 130%;
			min-height: 60px;
		}
	}
</style>
