<template>
	<div class="club-layout-toolbar d-flex align-center ga-1 pa-1 rounded-lg bg-surface border overflow-x-auto">
		<v-btn
			icon
			:variant="isModeActive('select') ? 'flat' : 'text'"
			:color="isModeActive('select') ? 'blue' : 'white'"
			size="38"
			title="Выбор элемента"
			@click="selectMode('select')"
		>
			<v-icon
				icon="mdi-cursor-default-outline"
				size="19"
			/>
		</v-btn>

		<v-btn
			icon
			:variant="isModeActive('move') ? 'flat' : 'text'"
			:color="isModeActive('move') ? 'blue' : 'white'"
			size="38"
			title="Перемещение элемента"
			@click="selectMode('move')"
		>
			<v-icon
				icon="mdi-cursor-move"
				size="19"
			/>
		</v-btn>

		<v-divider
			vertical
			class="mx-1 opacity-20"
		/>

		<v-menu
			v-model="wallMenuOpen"
			:close-on-content-click="false"
			location="bottom"
			offset="8"
		>
			<template #activator="{ props: activatorProps }">
				<v-btn
					v-bind="activatorProps"
					icon
					:variant="isElementTypeActive(GRID_ELEMENT_TYPE.WALL) ? 'flat' : 'text'"
					:color="isElementTypeActive(GRID_ELEMENT_TYPE.WALL) ? 'blue' : 'white'"
					size="38"
					title="Добавить стену"
				>
					<v-icon
						icon="mdi-wall"
						size="19"
					/>
				</v-btn>
			</template>

			<v-sheet
				width="350"
				rounded="lg"
				class="pa-4 bg-surface border text-white"
			>
				<div class="font-weight-medium mb-1">Выберите форму стены</div>
				<div class="text-caption opacity-50 mb-3">Повороты без визуальных отличий скрыты</div>

				<div class="d-flex flex-column ga-3">
					<div
						v-for="group in wallVariantGroups"
						:key="group.kind"
					>
						<div class="text-caption opacity-60 mb-1">{{ group.label }}</div>
						<div class="d-flex ga-1">
							<v-btn
								v-for="variant in group.variants"
								:key="`${variant.kind}-${variant.rotation}`"
								:color="isWallVariantActive(variant) ? 'blue' : 'white'"
								:variant="isWallVariantActive(variant) ? 'flat' : 'outlined'"
								width="48"
								height="48"
								class="pa-2 bg-opacity-10"
								:title="`${group.label}, ${variant.rotation}°`"
								@click="selectWall(variant)"
							>
								<div class="club-layout-toolbar__wall-preview">
									<club-layout-wall
										:kind="variant.kind"
										:rotation="variant.rotation"
										preview
									/>
								</div>
							</v-btn>
						</div>
					</div>
				</div>
			</v-sheet>
		</v-menu>

		<v-menu
			v-model="textMenuOpen"
			:close-on-content-click="false"
			location="bottom"
			offset="8"
		>
			<template #activator="{ props: activatorProps }">
				<v-btn
					v-bind="activatorProps"
					icon
					:variant="isElementTypeActive(GRID_ELEMENT_TYPE.TEXT) ? 'flat' : 'text'"
					:color="isElementTypeActive(GRID_ELEMENT_TYPE.TEXT) ? 'blue' : 'white'"
					size="38"
					title="Добавить текст"
				>
					<v-icon
						icon="mdi-format-text"
						size="20"
					/>
				</v-btn>
			</template>

			<v-sheet
				width="360"
				rounded="lg"
				class="pa-4 bg-surface border text-white"
			>
				<div class="font-weight-medium mb-3">Новый текст</div>
				<v-text-field
					v-model="textDraft.text"
					label="Текст"
					placeholder="Например, RECEPTION"
					class="mb-3"
				/>

				<div class="text-caption opacity-60 mb-2">Цвет</div>
				<div class="d-flex ga-2 mb-4">
					<button
						v-for="color in textColors"
						:key="color"
						type="button"
						:class="{ 'club-layout-toolbar__color--active': textDraft.color === color }"
						:style="{ backgroundColor: `rgb(var(--v-theme-${color}))` }"
						:aria-label="`Цвет ${color}`"
						class="club-layout-toolbar__color rounded-circle"
						@click="textDraft.color = color"
					/>
				</div>

				<v-select
					v-model="textDraft.fontSize"
					:items="textSizes"
					label="Размер"
					class="mb-3"
				/>

				<div class="text-caption opacity-60 mb-2">Направление</div>
				<v-btn-toggle
					v-model="textDraft.direction"
					mandatory
					divided
					color="blue"
					class="mb-4 border rounded-lg"
				>
					<v-btn
						v-for="direction in textDirections"
						:key="direction.value"
						:value="direction.value"
						:icon="direction.icon"
						size="38"
						:title="direction.label"
					/>
				</v-btn-toggle>

				<v-btn
					:disabled="!textDraft.text.trim()"
					color="blue"
					block
					@click="selectText"
				>
					Выбрать инструмент
				</v-btn>
			</v-sheet>
		</v-menu>

		<v-menu
			v-model="deviceMenuOpen"
			location="bottom"
			offset="8"
		>
			<template #activator="{ props: activatorProps }">
				<v-btn
					v-bind="activatorProps"
					icon
					:variant="isDeviceToolActive ? 'flat' : 'text'"
					:color="isDeviceToolActive ? 'blue' : 'white'"
					size="38"
					title="Разместить устройство"
				>
					<v-icon
						icon="mdi-monitor"
						size="19"
					/>
				</v-btn>
			</template>

			<v-list
				width="290"
				max-height="360"
				class="bg-surface border rounded-lg pa-2"
			>
				<v-list-subheader>Свободные устройства</v-list-subheader>
				<v-list-item
					v-for="device in availableDevices"
					:key="device.id"
					:title="device.name"
					:subtitle="`ID ${device.id}`"
					rounded="lg"
					@click="selectDevice(device)"
				>
					<template #prepend>
						<v-icon
							:color="device.tone"
							:icon="deviceIcon(device)"
						/>
					</template>
				</v-list-item>
				<v-list-item
					v-if="!availableDevices.length"
					title="Все устройства уже размещены"
					disabled
				/>
			</v-list>
		</v-menu>

		<v-btn
			v-for="tool in simpleElementTools"
			:key="tool.type"
			icon
			:variant="isElementTypeActive(tool.type) ? 'flat' : 'text'"
			:color="isElementTypeActive(tool.type) ? 'blue' : 'white'"
			size="38"
			:title="tool.label"
			@click="selectSimpleElement(tool.type)"
		>
			<v-icon
				:icon="tool.icon"
				size="19"
			/>
		</v-btn>

		<template v-if="selectedCount">
			<v-divider
				vertical
				class="mx-1 opacity-20"
			/>

			<v-btn
				v-if="
					selectedElement &&
					(selectedElement.type === GRID_ELEMENT_TYPE.WALL || selectedElement.type === GRID_ELEMENT_TYPE.TEXT)
				"
				icon
				variant="text"
				color="primary"
				size="38"
				title="Повернуть выбранный элемент"
				@click="emit('rotate-selected')"
			>
				<v-icon
					icon="mdi-rotate-right"
					size="19"
				/>
			</v-btn>

			<v-btn-toggle
				v-if="selectedElement?.type === GRID_ELEMENT_TYPE.TEXT"
				:model-value="selectedElement.alignment || TEXT_ALIGNMENT.CENTER"
				mandatory
				divided
				color="blue"
				class="border rounded-lg"
				@update:model-value="emit('set-text-alignment', $event)"
			>
				<v-btn
					v-for="alignment in textAlignments"
					:key="alignment.value"
					:value="alignment.value"
					:icon="textAlignmentIcon(alignment.value)"
					size="38"
					:title="alignment.label"
				/>
			</v-btn-toggle>

			<v-btn
				icon
				variant="text"
				color="red"
				size="38"
				:title="selectedCount > 1 ? `Удалить выбранные элементы (${selectedCount})` : 'Удалить выбранный элемент'"
				@click="emit('delete-selected')"
			>
				<v-icon
					icon="mdi-delete-outline"
					size="19"
				/>
			</v-btn>
		</template>
	</div>
</template>

<script setup>
	import { GRID_ELEMENT_TYPE, TEXT_ALIGNMENT, TEXT_DIRECTION, WALL_KIND, WALL_ROTATIONS } from "@/store/clubLayout.js";
	import { DEVICE_TYPE } from "@/store/devices.js";

	const props = defineProps({
		activeTool: {
			type: Object,
			required: true,
		},
		selectedElement: {
			type: Object,
			default: null,
		},
		selectedCount: {
			type: Number,
			default: 0,
		},
		devices: {
			type: Array,
			default: () => [],
		},
		placedDeviceIds: {
			type: Array,
			default: () => [],
		},
	});

	const emit = defineEmits(["select-tool", "rotate-selected", "set-text-alignment", "delete-selected"]);

	let wallMenuOpen = $ref(false);
	let textMenuOpen = $ref(false);
	let deviceMenuOpen = $ref(false);
	const textDraft = $ref({
		text: "",
		color: "white",
		fontSize: 14,
		direction: TEXT_DIRECTION.RIGHT,
		alignment: TEXT_ALIGNMENT.CENTER,
	});

	const wallLabels = {
		[WALL_KIND.STRAIGHT]: "Прямая",
		[WALL_KIND.CORNER]: "Угол",
		[WALL_KIND.T_JUNCTION]: "Т-образная",
		[WALL_KIND.CROSS]: "Перекрёсток",
	};
	const textColors = ["white", "red", "blue", "primary", "purple"];
	const textSizes = [12, 14, 16, 18, 20, 24];
	const textDirections = [
		{ value: TEXT_DIRECTION.RIGHT, icon: "mdi-arrow-right", label: "Слева направо" },
		{ value: TEXT_DIRECTION.DOWN, icon: "mdi-arrow-down", label: "Сверху вниз" },
		{ value: TEXT_DIRECTION.LEFT, icon: "mdi-arrow-left", label: "Справа налево" },
		{ value: TEXT_DIRECTION.UP, icon: "mdi-arrow-up", label: "Снизу вверх" },
	];
	const textAlignments = [
		{ value: TEXT_ALIGNMENT.START, label: "Привязать к началу направления" },
		{ value: TEXT_ALIGNMENT.CENTER, label: "Расположить по центру ячейки" },
		{ value: TEXT_ALIGNMENT.END, label: "Привязать к концу направления" },
	];
	const simpleElementTools = [
		{ type: GRID_ELEMENT_TYPE.TOILET, icon: "mdi-toilet", label: "Добавить туалет" },
		{ type: GRID_ELEMENT_TYPE.COAT_RACK, icon: "mdi-hanger", label: "Добавить вешалку" },
	];

	const wallVariantGroups = $computed(() =>
		Object.entries(WALL_ROTATIONS).map(([kind, rotations]) => ({
			kind,
			label: wallLabels[kind],
			variants: rotations.map((rotation) => ({ kind, rotation })),
		}))
	);
	const availableDevices = $computed(() =>
		props.devices.filter(({ id }) => !props.placedDeviceIds.includes(String(id)))
	);

	const isModeActive = (mode) => props.activeTool.mode === mode;
	const isElementTypeActive = (type) => props.activeTool.mode === "place" && props.activeTool.element?.type === type;
	const isDeviceToolActive = $computed(
		() => isElementTypeActive(GRID_ELEMENT_TYPE.DEVICE) || isElementTypeActive(GRID_ELEMENT_TYPE.CONSOLE)
	);
	const isWallVariantActive = ({ kind, rotation }) =>
		isElementTypeActive(GRID_ELEMENT_TYPE.WALL) &&
		props.activeTool.element.kind === kind &&
		props.activeTool.element.rotation === rotation;
	const textAlignmentIcon = (alignment) => {
		const direction = props.selectedElement?.direction ?? TEXT_DIRECTION.RIGHT;
		const icons = {
			[TEXT_DIRECTION.RIGHT]: {
				[TEXT_ALIGNMENT.START]: "mdi-format-align-left",
				[TEXT_ALIGNMENT.CENTER]: "mdi-format-align-center",
				[TEXT_ALIGNMENT.END]: "mdi-format-align-right",
			},
			[TEXT_DIRECTION.DOWN]: {
				[TEXT_ALIGNMENT.START]: "mdi-format-align-top",
				[TEXT_ALIGNMENT.CENTER]: "mdi-format-align-middle",
				[TEXT_ALIGNMENT.END]: "mdi-format-align-bottom",
			},
			[TEXT_DIRECTION.LEFT]: {
				[TEXT_ALIGNMENT.START]: "mdi-format-align-right",
				[TEXT_ALIGNMENT.CENTER]: "mdi-format-align-center",
				[TEXT_ALIGNMENT.END]: "mdi-format-align-left",
			},
			[TEXT_DIRECTION.UP]: {
				[TEXT_ALIGNMENT.START]: "mdi-format-align-bottom",
				[TEXT_ALIGNMENT.CENTER]: "mdi-format-align-middle",
				[TEXT_ALIGNMENT.END]: "mdi-format-align-top",
			},
		};

		return icons[direction][alignment];
	};

	const selectMode = (mode) => {
		emit("select-tool", { mode });
	};

	const selectWall = ({ kind, rotation }) => {
		emit("select-tool", {
			mode: "place",
			element: {
				type: GRID_ELEMENT_TYPE.WALL,
				kind,
				rotation,
			},
		});
		wallMenuOpen = false;
	};

	const selectText = () => {
		emit("select-tool", {
			mode: "place",
			element: {
				type: GRID_ELEMENT_TYPE.TEXT,
				...textDraft,
			},
		});
		textMenuOpen = false;
	};

	const deviceIcon = (device) => (device.type === DEVICE_TYPE.CONSOLE ? "mdi-gamepad-variant-outline" : "mdi-monitor");

	const selectDevice = (device) => {
		emit("select-tool", {
			mode: "place",
			element: {
				type: device.type === DEVICE_TYPE.CONSOLE ? GRID_ELEMENT_TYPE.CONSOLE : GRID_ELEMENT_TYPE.DEVICE,
				deviceId: String(device.id),
			},
		});
		deviceMenuOpen = false;
	};

	const selectSimpleElement = (type) => {
		emit("select-tool", {
			mode: "place",
			element: { type },
		});
	};
</script>

<style scoped lang="scss">
	.club-layout-toolbar {
		max-width: 100%;
		min-height: 48px;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}

		&__color {
			width: 28px;
			height: 28px;
			border: 2px solid transparent;
			outline: 1px solid rgba(var(--v-theme-white), 0.12);
			transition:
				border-color 120ms ease,
				transform 120ms ease;

			&:hover {
				transform: scale(1.08);
			}

			&--active {
				border-color: rgb(var(--v-theme-background));
				outline-color: rgb(var(--v-theme-blue));
			}
		}

		&__wall-preview {
			width: 28px;
			height: 28px;
			flex: 0 0 28px;
		}
	}
</style>
