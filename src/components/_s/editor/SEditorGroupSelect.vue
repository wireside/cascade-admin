<template>
	<v-select
		v-model="model"
		:items="items"
		:menu-props="menuProps"
		variant="outlined"
		density="compact"
		height="40"
		hide-details
		menu-icon="mdi-chevron-down"
		no-data-text="Группы пока не созданы"
		class="s-editor-group-select rounded-md overflow-hidden bg-white bg-opacity-2 text-white"
	>
		<template #selection>
			<span class="text-white opacity-40 text-truncate">{{ model }}</span>
		</template>
	</v-select>
</template>

<script setup>
	const model = defineModel({ type: String, default: "Без группы" });

	defineProps({
		items: {
			type: Array,
			default: () => [],
		},
	});

	const menuProps = {
		contentClass: "bg-surface rounded-md border border-opacity-10",
	};
</script>

<style scoped lang="scss">
	.s-editor-group-select {
		:deep(.v-field) {
			height: 40px;
			font-size: 13px;
			background: transparent !important;
			border: 0.5px solid rgba(255, 255, 255, 0.1);
			border-radius: 8px;
		}

		:deep(.v-field__input) {
			min-height: 40px;
			padding-top: 0;
			padding-bottom: 0;
		}

		:deep(.v-select__selection) {
			margin: 0;
		}

		:deep(.v-field__append-inner) {
			align-items: center;
			padding-top: 0;
			color: rgb(var(--v-theme-white));
			opacity: 0.4;
		}

		:deep(.v-field__overlay),
		:deep(.v-field__outline) {
			display: none;
		}
	}
</style>
