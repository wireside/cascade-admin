<template>
	<button
		:class="[
			'game-media-uploader position-relative d-flex flex-column align-center justify-center rounded-md bg-white bg-opacity-2 text-white',
			portrait && 'game-media-uploader--portrait',
		]"
		type="button"
		@click="fileInput?.click()"
	>
		<img
			v-if="model"
			:src="model"
			alt=""
			class="game-media-uploader__image position-absolute w-100 h-100"
		/>
		<div
			v-else
			class="position-relative d-flex flex-column align-center"
		>
			<v-icon
				:icon="portrait ? 'mdi-image-outline' : 'mdi-image-plus-outline'"
				size="20"
				class="opacity-50 mb-2"
			/>
			<span class="opacity-50">{{ title }}</span>
			<span class="opacity-40 mt-1">{{ requirements }}</span>
		</div>

		<input
			ref="fileInput"
			type="file"
			accept="image/png,image/jpeg,image/webp"
			hidden
			@change="selectFile"
		/>
	</button>
</template>

<script setup>
	const model = defineModel({ type: String, default: "" });

	defineProps({
		title: {
			type: String,
			required: true,
		},
		requirements: {
			type: String,
			required: true,
		},
		portrait: {
			type: Boolean,
			default: false,
		},
	});

	let fileInput = $ref(null);
	let objectUrl = "";

	const selectFile = (event) => {
		const [file] = event.target.files || [];
		if (!file) return;

		if (objectUrl) URL.revokeObjectURL(objectUrl);
		objectUrl = URL.createObjectURL(file);
		model.value = objectUrl;
	};

	onBeforeUnmount(() => {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
	});
</script>

<style scoped lang="scss">
	.game-media-uploader {
		width: 351px;
		height: 200px;
		aspect-ratio: 16 / 9;
		border: 1px dashed rgba(255, 255, 255, 0.1);
		font: inherit;
		font-size: 12px;
		line-height: 1.2;
		cursor: pointer;

		&--portrait {
			width: 181px;
			height: 270px;
			aspect-ratio: 2 / 3;
		}

		&__image {
			inset: 0;
			object-fit: cover;
			border-radius: inherit;
		}
	}
</style>
