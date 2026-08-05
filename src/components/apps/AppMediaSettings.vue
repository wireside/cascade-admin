<template>
	<s-editor-section
		title="Медиа файлы"
		class="app-media-settings text-white"
	>
		<div class="rounded-md bg-white bg-opacity-2 pa-4 pt-0 pb-4 mb-2">
			<div class="app-media-settings__label text-white mb-3">Иконка приложения</div>

			<div class="d-flex align-start ga-2">
				<v-btn
					:ripple="false"
					variant="flat"
					width="266"
					height="200"
					rounded="md"
					class="app-media-settings__upload border border-opacity-10 bg-white bg-opacity-2 text-white text-none font-weight-regular pa-0"
					@click="fileInput?.click()"
				>
					<span class="d-flex flex-column align-center">
						<v-icon
							icon="mdi-image-outline"
							size="20"
							class="opacity-50 mb-2"
						/>
						<span class="opacity-50">Загрузите обложку</span>
						<span class="opacity-40 mt-1">16:9 • не более 1 МБ</span>
					</span>
				</v-btn>

				<div class="app-media-settings__preview position-relative rounded-md overflow-hidden">
					<v-img
						:src="appPreviewImage"
						alt=""
						cover
						eager
						class="position-absolute w-100 h-100"
					/>

					<article
						class="app-media-settings__preview-card position-absolute d-flex flex-column align-center rounded-md bg-white bg-opacity-2 overflow-hidden"
					>
						<v-img
							:src="previewImage"
							:alt="appName"
							width="77"
							height="77"
							contain
							eager
							class="app-media-settings__preview-icon flex-grow-0"
						/>
						<div
							class="app-media-settings__preview-title position-absolute text-white text-center font-weight-bold text-uppercase"
						>
							{{ appName || "Новое приложение" }}
						</div>
					</article>
				</div>
			</div>

			<input
				ref="fileInput"
				type="file"
				accept="image/png,image/jpeg,image/webp"
				hidden
				@change="selectFile"
			/>
		</div>

		<div class="rounded-md bg-white bg-opacity-2 pa-4 pt-0 pb-5">
			<div class="app-media-settings__label text-white mb-3">Или укажите путь к файлу иконки</div>

			<v-text-field
				v-model="iconPath"
				prepend-inner-icon="mdi-folder-outline"
				placeholder="Укажите путь до файла"
				variant="outlined"
				hide-details
				class="s-editor-control rounded-md overflow-hidden bg-white bg-opacity-2 text-white"
			/>
		</div>
	</s-editor-section>
</template>

<script setup>
	import appPreviewImage from "@/assets/images/apps/app-preview.png";

	const icon = defineModel("icon", { type: String, default: "" });
	const iconPath = defineModel("iconPath", { type: String, default: "" });

	const props = defineProps({
		appName: {
			type: String,
			default: "",
		},
		fallbackImage: {
			type: String,
			required: true,
		},
	});

	let fileInput = $ref(null);
	let objectUrl = "";

	const previewImage = $computed(() => icon.value || props.fallbackImage);

	const selectFile = (event) => {
		const [file] = event.target.files || [];
		if (!file) return;

		if (objectUrl) URL.revokeObjectURL(objectUrl);
		objectUrl = URL.createObjectURL(file);
		icon.value = objectUrl;
	};

	onBeforeUnmount(() => {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
	});
</script>

<style scoped lang="scss">
	.app-media-settings {
		&__label {
			padding-top: 14px;
			font-size: 12px;
			line-height: 125%;
		}

		&__upload {
			border-style: dashed !important;
			font-size: 12px;
			line-height: 1.2;
		}

		&__preview {
			width: 266px;
			height: 200px;
		}

		&__preview-card {
			top: 50%;
			left: 50%;
			width: 135px;
			height: 136.74px;
			transform: translate(-50%, -50%);
		}

		&__preview-icon {
			margin-top: 15px;
		}

		&__preview-title {
			right: 22px;
			bottom: 25px;
			left: 22px;
			font-size: 12px;
			line-height: 120%;
		}

		:deep(.v-field__input) {
			min-height: 40px;
			padding-top: 8px;
			padding-bottom: 8px;
		}

		:deep(.s-editor-control .v-field) {
			background: transparent !important;
			border: 0.5px solid rgba(255, 255, 255, 0.1);
			border-radius: 8px;
		}

		:deep(.s-editor-control .v-field__overlay),
		:deep(.s-editor-control .v-field__outline) {
			display: none;
		}

		:deep(.v-field__prepend-inner > .v-icon) {
			opacity: 0.4;
		}
	}
</style>
