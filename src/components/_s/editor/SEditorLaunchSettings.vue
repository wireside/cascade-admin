<template>
	<s-editor-section
		title="Настройки ярлыка"
		class="s-editor-launch-settings text-white"
	>
		<div class="rounded-md bg-white bg-opacity-2 pa-4 pt-3">
			<div class="s-editor-launch-settings__label text-white mb-3">Путь к файлам</div>

			<div class="d-flex flex-column ga-1">
				<div
					v-for="(_, index) in paths"
					:key="index"
					class="d-flex align-center ga-1"
				>
					<v-text-field
						v-model="paths[index]"
						prepend-inner-icon="mdi-folder-outline"
						placeholder="Укажите путь до файла"
						variant="outlined"
						hide-details
						class="s-editor-control rounded-md overflow-hidden bg-white bg-opacity-2 text-white"
					/>

					<v-btn
						:color="index === 0 ? 'primary' : 'red'"
						:disabled="index === 0 && paths.length >= maxPaths"
						:aria-label="index === 0 ? 'Добавить путь' : 'Удалить путь'"
						:class="`bg-opacity-20 text-${index === 0 ? 'primary' : 'red'}`"
						icon
						variant="flat"
						size="40"
						rounded="md"
						@click="index === 0 ? addPath() : removePath(index)"
					>
						<v-icon
							:icon="index === 0 ? 'mdi-plus-circle-outline' : 'mdi-trash-can-outline'"
							size="13"
						/>
					</v-btn>
				</div>
			</div>
		</div>

		<div
			class="s-editor-launch-settings__notice d-flex align-center rounded-md bg-white bg-opacity-2 pa-4 mt-2 text-white"
		>
			<div class="opacity-50 d-flex align-start ga-2">
				<v-icon
					icon="mdi-information-outline"
					size="18"
					class="flex-shrink-0"
				/>
				<p>
					Вы можете добавить до 3 путей и использовать переменные среды окружения Windows.
					<br />
					Путь должен вести к исполняемому файлу в форматах
					<span class="text-primary">.exe .lnk .bat .cmd .url</span>
				</p>
			</div>
		</div>

		<div class="rounded-md bg-white bg-opacity-2 pa-4 pt-3 mt-2">
			<div class="s-editor-launch-settings__label text-white mb-3">Аргумент командной строки</div>
			<v-text-field
				v-model="launchArguments"
				prepend-inner-icon="mdi-console-line"
				placeholder="Введите аргументы"
				variant="outlined"
				hide-details
				class="s-editor-control rounded-md overflow-hidden bg-white bg-opacity-2 text-white"
			/>
		</div>

		<div class="d-flex align-center justify-space-between rounded-md bg-white bg-opacity-2 pa-4 mt-2">
			<div class="d-flex align-center ga-1 text-white">
				<v-icon
					icon="mdi-xml"
					color="primary"
					size="16"
				/>
				<span class="s-editor-launch-settings__administrator">Запускать от имени администратора</span>
			</div>
			<s-switch
				v-model="runAsAdministrator"
				:color="runAsAdministrator ? 'primary' : 'white'"
				:contrast="runAsAdministrator"
			/>
		</div>
	</s-editor-section>
</template>

<script setup>
	const paths = defineModel("paths", { type: Array, required: true });
	const launchArguments = defineModel("arguments", { type: String, default: "" });
	const runAsAdministrator = defineModel("runAsAdministrator", { type: Boolean, default: false });

	const maxPaths = 3;

	if (!paths.value.length) paths.value = [""];

	const addPath = () => {
		if (paths.value.length >= maxPaths) return;
		paths.value = [...paths.value, ""];
	};

	const removePath = (index) => {
		if (index === 0 || paths.value.length === 1) return;
		paths.value = paths.value.filter((_, pathIndex) => pathIndex !== index);
	};
</script>

<style scoped lang="scss">
	.s-editor-launch-settings {
		&__label {
			font-size: 12px;
			line-height: 1.2;
		}

		&__notice {
			font-size: 12px;
			line-height: 130%;

			p {
				margin: 0;
			}
		}

		&__administrator {
			font-size: 13px;
		}

		:deep(.v-field) {
			font-size: 13px;
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
