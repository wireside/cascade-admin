<template>
	<s-editor-section
		title="Основные данные"
		class="app-basic-data text-white"
	>
		<div class="app-basic-data__block rounded-md bg-white bg-opacity-2 pa-4 pt-3">
			<div class="app-basic-data__label text-white mb-3">Название приложения</div>
			<v-text-field
				v-model="name"
				maxlength="50"
				prepend-inner-icon="mdi-magnify"
				placeholder="Название приложения"
				variant="outlined"
				hide-details
				class="app-basic-data__name app-editor-control rounded-md overflow-hidden bg-white bg-opacity-2 text-white"
			>
				<template #append-inner>
					<span class="app-basic-data__counter text-white opacity-40">{{ name.length }}/50 Aa</span>
				</template>
			</v-text-field>
		</div>

		<div class="app-basic-data__block rounded-md bg-white bg-opacity-2 pa-4 pt-3 mt-2">
			<div class="app-basic-data__label text-white mb-3">Описание приложения</div>
			<div class="app-basic-data__description-wrap position-relative rounded-md bg-white bg-opacity-2">
				<v-textarea
					v-model="description"
					maxlength="1000"
					placeholder="Введите описание"
					no-resize
					hide-details
					class="app-basic-data__description text-white"
				/>
				<span class="app-basic-data__description-counter position-absolute text-white opacity-40">
					{{ description.length }}/1000 Aa
				</span>
			</div>
		</div>

		<div class="app-basic-data__block rounded-md bg-white bg-opacity-2 pa-4 pt-3 mt-2">
			<div class="app-basic-data__label text-white mb-3">Группа приложений</div>
			<s-editor-group-select v-model="group" />
		</div>

		<div class="app-basic-data__error d-flex align-center ga-2 rounded-md bg-red bg-opacity-20 pa-4 mt-2 text-red">
			<v-icon
				icon="mdi-alert-rhombus-outline"
				size="18"
			/>
			<span>Вы не создали ни одной группы. Создайте группы, чтобы распределять приложения.</span>
		</div>
	</s-editor-section>
</template>

<script setup>
	const name = defineModel("name", { type: String, default: "" });
	const description = defineModel("description", { type: String, default: "" });
	const group = defineModel("group", { type: String, default: "Без группы" });
</script>

<style scoped lang="scss">
	.app-basic-data {
		&__label {
			font-size: 12px;
			line-height: 1.2;
		}

		&__counter {
			font-size: 11px;
			white-space: nowrap;
		}

		&__error {
			font-size: 12px;
			line-height: 130%;
		}

		&__description-wrap {
			height: 194px;
			border: 0.5px solid rgba(255, 255, 255, 0.1);
		}

		&__description-counter {
			right: 12px;
			bottom: 10px;
			font-size: 11px;
			line-height: 1;
			white-space: nowrap;
			pointer-events: none;
		}

		:deep(.v-field) {
			font-size: 13px;
		}

		:deep(.v-field__input) {
			min-height: 44px;
			padding-top: 8px;
			padding-bottom: 8px;
		}

		:deep(.app-editor-control .v-field) {
			background: transparent !important;
			border: 0.5px solid rgba(255, 255, 255, 0.1);
			border-radius: 8px;
		}

		:deep(.app-editor-control .v-field__overlay),
		:deep(.app-editor-control .v-field__outline) {
			display: none;
		}

		:deep(.app-basic-data__description),
		:deep(.app-basic-data__description .v-input__control),
		:deep(.app-basic-data__description .v-field) {
			height: 100%;
		}

		:deep(.app-basic-data__description .v-field) {
			background: transparent !important;
			border-radius: inherit;
		}

		:deep(.app-basic-data__description .v-field__overlay),
		:deep(.app-basic-data__description .v-field__outline) {
			display: none;
		}

		:deep(.app-basic-data__description .v-field__input) {
			height: 100%;
			min-height: 0;
			padding: 12px 12px 32px;
			align-items: flex-start;
			color: rgb(var(--v-theme-white));
		}

		:deep(.app-basic-data__description textarea::placeholder) {
			color: rgba(255, 255, 255, 0.4);
			opacity: 1;
		}

		:deep(.v-field__prepend-inner > .v-icon),
		:deep(.v-field__append-inner > .v-icon) {
			opacity: 0.4;
		}
	}
</style>
