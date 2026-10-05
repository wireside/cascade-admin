<template>
	<v-sheet
		max-width="697px"
		height="40"
		color="surface"
		rounded="pill"
		class="club-layout-toolbar d-inline-flex flex-nowrap flex-shrink-1 align-center pa-1 overflow-x-auto"
	>
		<div class="club-layout-toolbar__section d-flex align-center flex-shrink-0">
			<v-btn
				icon
				:variant="isModeActive('select') ? 'tonal' : 'text'"
				:color="isModeActive('select') ? 'primary' : 'secondary'"
				size="32"
				title="Выбор элемента"
				@click="selectMode('select')"
			>
				<v-icon
					icon="mdi-cursor-default-outline"
					size="18"
				/>
			</v-btn>

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
						:variant="isElementTypeActive(GRID_ELEMENT_TYPE.TEXT) ? 'tonal' : 'text'"
						:color="isElementTypeActive(GRID_ELEMENT_TYPE.TEXT) ? 'primary' : 'secondary'"
						size="32"
						title="Добавить текст"
					>
						<v-icon
							icon="mdi-format-text"
							size="18"
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
						<v-btn
							v-for="color in textColors"
							:key="color.value"
							:aria-label="color.label"
							:color="color.preview"
							icon
							size="28"
							@click="textDraft.color = color.value"
						>
							<v-icon
								v-if="textDraft.color === color.value"
								icon="mdi-check"
								size="14"
							/>
						</v-btn>
					</div>

					<v-select
						v-model="textDraft.fontSize"
						:items="textSizes"
						variant="solo"
						class="mb-3 text-white"
					>
						<template v-slot:label><span class="text-white">Размер</span></template>
					</v-select>

					<div class="text-caption opacity-60 mb-2">Направление</div>
					<v-btn-toggle
						v-model="textDraft.direction"
						mandatory
						divided
						color="primary"
						class="mb-4 border rounded-lg flex-shrink-0"
					>
						<v-btn
							v-for="direction in textDirections"
							:key="direction.value"
							:value="direction.value"
							:icon="direction.icon"
							size="46"
							:title="direction.label"
						/>
					</v-btn-toggle>

					<v-btn
						:disabled="!textDraft.text.trim()"
						color="primary"
						block
						@click="selectText"
					>
						Выбрать инструмент
					</v-btn>
				</v-sheet>
			</v-menu>
		</div>

		<v-divider
			vertical
			class="mx-1 opacity-20 flex-shrink-0"
		/>

		<div class="club-layout-toolbar__section d-flex align-center flex-shrink-0">
			<v-btn
				v-for="wall in wallTools"
				:key="wall.kind"
				icon
				:variant="isWallKindActive(wall.kind) ? 'tonal' : 'text'"
				:color="isWallKindActive(wall.kind) ? 'primary' : 'secondary'"
				size="32"
				:title="wall.label"
				@click="selectWall(wall.kind)"
			>
				<v-sheet
					width="18"
					height="18"
					color="transparent"
					class="flex-shrink-0"
				>
					<club-layout-wall
						:kind="wall.kind"
						:rotation="0"
						compact
					/>
				</v-sheet>
			</v-btn>

			<v-btn
				icon
				variant="text"
				color="secondary"
				size="32"
				title="Повернуть стену"
				@click="rotateWall"
			>
				<v-icon
					icon="mdi-arrow-right"
					size="18"
				/>
			</v-btn>
		</div>

		<v-divider
			vertical
			class="mx-1 opacity-20 flex-shrink-0"
		/>

		<div class="club-layout-toolbar__section d-flex align-center flex-shrink-0">
			<v-menu
				v-for="deviceTool in deviceTools"
				:key="deviceTool.deviceType"
				location="bottom"
				offset="8"
			>
				<template #activator="{ props: activatorProps }">
					<v-btn
						v-bind="activatorProps"
						icon
						:variant="isElementTypeActive(deviceTool.elementType) ? 'tonal' : 'text'"
						:color="isElementTypeActive(deviceTool.elementType) ? 'primary' : 'secondary'"
						size="32"
						:title="deviceTool.label"
					>
						<v-icon
							:icon="deviceTool.icon"
							size="18"
						/>
					</v-btn>
				</template>

				<v-list
					width="290"
					max-height="360"
					class="bg-surface border rounded-lg pa-2"
				>
					<v-list-subheader>{{ deviceTool.listTitle }}</v-list-subheader>
					<v-list-item
						v-for="device in availableDevicesFor(deviceTool.deviceType)"
						:key="device.id"
						:title="device.name"
						:subtitle="`ID ${device.id}`"
						rounded="lg"
						@click="selectDevice(device)"
					>
						<template #prepend>
							<v-icon
								:color="device.tone"
								:icon="deviceTool.icon"
							/>
						</template>
					</v-list-item>
					<v-list-item
						v-if="!availableDevicesFor(deviceTool.deviceType).length"
						title="Все устройства уже размещены"
						disabled
					/>
				</v-list>
			</v-menu>

			<v-btn
				v-for="tool in gamingTools"
				:key="tool.type"
				icon
				:variant="isElementTypeActive(tool.type) ? 'tonal' : 'text'"
				:color="isElementTypeActive(tool.type) ? 'primary' : 'secondary'"
				size="32"
				:title="tool.label"
				@click="selectSimpleElement(tool.type)"
			>
				<v-icon
					:icon="tool.icon"
					size="18"
				/>
			</v-btn>
		</div>

		<v-divider
			vertical
			class="mx-1 opacity-20 flex-shrink-0"
		/>

		<div class="club-layout-toolbar__section d-flex align-center flex-shrink-0">
			<v-btn
				v-for="tool in amenityTools"
				:key="tool.type"
				icon
				:variant="isElementTypeActive(tool.type) ? 'tonal' : 'text'"
				:color="isElementTypeActive(tool.type) ? 'primary' : 'secondary'"
				size="32"
				:title="tool.label"
				@click="selectSimpleElement(tool.type)"
			>
				<span
					v-if="tool.text"
					class="text-caption font-weight-medium"
				>
					{{ tool.text }}
				</span>
				<v-icon
					v-else
					:icon="tool.icon"
					size="18"
				/>
			</v-btn>
		</div>

		<template v-if="selectedCount">
			<v-divider
				vertical
				class="mx-1 opacity-20 flex-shrink-0"
			/>

			<div class="club-layout-toolbar__section d-flex align-center flex-shrink-0">
				<v-btn
					v-if="selectedElement?.type === GRID_ELEMENT_TYPE.TEXT"
					icon
					variant="text"
					color="primary"
					size="32"
					title="Повернуть выбранный текст"
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
					density="compact"
					height="32"
					color="primary"
					class="border rounded-lg flex-shrink-0"
					@update:model-value="emit('set-text-alignment', $event)"
				>
					<v-btn
						v-for="alignment in textAlignments"
						:key="alignment.value"
						:value="alignment.value"
						:icon="textAlignmentIcon(alignment.value)"
						size="32"
						:title="alignment.label"
					/>
				</v-btn-toggle>

				<v-btn
					icon
					variant="text"
					color="red"
					size="32"
					:title="selectedCount > 1 ? `Удалить выбранные элементы (${selectedCount})` : 'Удалить выбранный элемент'"
					@click="emit('delete-selected')"
				>
					<v-icon
						icon="mdi-delete-outline"
						size="19"
					/>
				</v-btn>
			</div>
		</template>
	</v-sheet>
</template>

<script setup>
	import { GRID_ELEMENT_TYPE, TEXT_ALIGNMENT, TEXT_DIRECTION, WALL_KIND, WALL_ROTATIONS } from "@/store/clubLayout.js";
	import { DEVICE_TYPE } from "@/store/devices.js";

	const props = defineProps({
		activeTool: { type: Object, required: true },
		selectedElement: { type: Object, default: null },
		selectedCount: { type: Number, default: 0 },
		devices: { type: Array, default: () => [] },
		placedDeviceIds: { type: Array, default: () => [] },
	});

	const emit = defineEmits(["select-tool", "rotate-selected", "set-text-alignment", "delete-selected"]);

	let textMenuOpen = $ref(false);
	const textDraft = $ref({
		text: "",
		color: "white",
		fontSize: 14,
		direction: TEXT_DIRECTION.RIGHT,
		alignment: TEXT_ALIGNMENT.CENTER,
	});

	const wallTools = [
		{ kind: WALL_KIND.STRAIGHT, label: "Прямая стена" },
		{ kind: WALL_KIND.CORNER, label: "Угловая стена" },
		{ kind: WALL_KIND.T_JUNCTION, label: "Т-образная стена" },
		{ kind: WALL_KIND.CROSS, label: "Перекрёсток стен" },
	];
	const deviceTools = [
		{
			deviceType: DEVICE_TYPE.COMPUTER,
			elementType: GRID_ELEMENT_TYPE.DEVICE,
			icon: "mdi-monitor",
			label: "Разместить компьютер",
			listTitle: "Свободные компьютеры",
		},
		{
			deviceType: DEVICE_TYPE.CONSOLE,
			elementType: GRID_ELEMENT_TYPE.CONSOLE,
			icon: "mdi-gamepad-variant-outline",
			label: "Разместить консоль",
			listTitle: "Свободные консоли",
		},
	];
	const gamingTools = [
		{ type: GRID_ELEMENT_TYPE.VR, icon: "mdi-virtual-reality", label: "Добавить VR-зону" },
		{ type: GRID_ELEMENT_TYPE.STEERING_WHEEL, icon: "mdi-steering", label: "Добавить гоночный симулятор" },
		{ type: GRID_ELEMENT_TYPE.TARGET, icon: "mdi-bullseye", label: "Добавить игровую зону" },
		{ type: GRID_ELEMENT_TYPE.BOARD_GAME, icon: "mdi-dice-multiple-outline", label: "Добавить настольные игры" },
	];
	const amenityTools = [
		{ type: GRID_ELEMENT_TYPE.ROOM_SERVICE, icon: "mdi-room-service-outline", label: "Добавить зону обслуживания" },
		{ type: GRID_ELEMENT_TYPE.COAT_RACK, icon: "mdi-hanger", label: "Добавить вешалку" },
		{ type: GRID_ELEMENT_TYPE.TOILET, text: "WC", label: "Добавить туалет" },
		{ type: GRID_ELEMENT_TYPE.SOFA, icon: "mdi-sofa-outline", label: "Добавить диван" },
		{ type: GRID_ELEMENT_TYPE.COFFEE, icon: "mdi-coffee-outline", label: "Добавить кофейную зону" },
		{ type: GRID_ELEMENT_TYPE.FOOD, icon: "mdi-silverware-fork-knife", label: "Добавить кухонную зону" },
	];
	const textColors = [
		{ value: "white", preview: "white", label: "Белый" },
		{ value: "wall", preview: "rgba(255, 255, 255, 0.4)", label: "Серый" },
		{ value: "red", preview: "red", label: "Красный" },
		{ value: "blue", preview: "blue", label: "Синий" },
		{ value: "primary", preview: "primary", label: "Основной" },
		{ value: "purple", preview: "purple", label: "Фиолетовый" },
	];
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

	const isModeActive = (mode) => props.activeTool.mode === mode;
	const isElementTypeActive = (type) => props.activeTool.mode === "place" && props.activeTool.element?.type === type;
	const isWallKindActive = (kind) =>
		isElementTypeActive(GRID_ELEMENT_TYPE.WALL) && props.activeTool.element.kind === kind;
	const availableDevicesFor = (type) =>
		props.devices.filter((device) => device.type === type && !props.placedDeviceIds.includes(String(device.id)));
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

	const selectMode = (mode) => emit("select-tool", { mode });
	const selectWall = (kind) => {
		emit("select-tool", {
			mode: "place",
			element: {
				type: GRID_ELEMENT_TYPE.WALL,
				kind,
				rotation: WALL_ROTATIONS[kind][0],
			},
		});
	};
	const rotateWall = () => {
		if (props.selectedElement?.type === GRID_ELEMENT_TYPE.WALL) {
			emit("rotate-selected");
			return;
		}

		if (!isElementTypeActive(GRID_ELEMENT_TYPE.WALL)) return;

		const wall = props.activeTool.element;
		const rotations = WALL_ROTATIONS[wall.kind];
		const currentIndex = rotations.indexOf(wall.rotation);

		emit("select-tool", {
			mode: "place",
			element: {
				...wall,
				rotation: rotations[(currentIndex + 1) % rotations.length],
			},
		});
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
	const selectDevice = (device) => {
		emit("select-tool", {
			mode: "place",
			element: {
				type: device.type === DEVICE_TYPE.CONSOLE ? GRID_ELEMENT_TYPE.CONSOLE : GRID_ELEMENT_TYPE.DEVICE,
				deviceId: String(device.id),
			},
		});
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
		scrollbar-width: none;

		&__section {
			gap: 2px;
		}

		&::-webkit-scrollbar {
			display: none;
		}
	}
</style>
