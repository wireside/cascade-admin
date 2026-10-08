<template>
	<div
		class="club-layout d-flex flex-column ga-3 text-white h-100"
		@keydown.delete.prevent="editing && deleteSelectedElements()"
	>
		<v-row
			v-if="editing"
			align="center"
			no-gutters
			class="justify-space-between flex-grow-0"
		>
			<v-col
				cols="6"
				lg="1"
				class="text-caption text-no-wrap opacity-60 d-inline-flex flex-wrap"
			>
				<span>Выбран инструмент:</span>
				<span class="text-white">{{ toolLabel }}</span>
			</v-col>

			<v-col
				cols="12"
				lg="auto"
				order="3"
				order-lg="2"
				class="d-flex justify-center overflow-hidden px-1"
			>
				<club-layout-toolbar
					:active-tool="activeTool"
					:selected-element="selectedElement"
					:selected-count="selectedElementIds.length"
					:devices="deviceOptions"
					:placed-device-ids="placedDeviceIds"
					@select-tool="selectTool"
					@rotate-selected="rotateSelectedElement"
					@set-text-alignment="setSelectedTextAlignment"
					@delete-selected="deleteSelectedElements"
				/>
			</v-col>

			<v-col
				cols="6"
				lg="auto"
				order="2"
				order-lg="3"
				class="d-flex align-center justify-end ga-2"
			>
				<v-btn
					prepend-icon="mdi-restore"
					variant="flat"
					color="surface"
					height="44"
					rounded="md"
					class="px-5 text-secondary"
					@click="cancelEditing"
				>
					Отмена
				</v-btn>
				<v-btn
					prepend-icon="mdi-content-save-outline"
					variant="tonal"
					color="primary"
					height="44"
					rounded="md"
					class="px-5"
					@click="saveChanges"
				>
					Сохранить
				</v-btn>
			</v-col>
		</v-row>

		<div
			v-else
			class="d-flex align-center justify-space-between"
		>
			<v-btn
				rounded="md"
				variant="flat"
				size="40"
				title="Информация о плане помещения"
				class="bg-white bg-opacity-5 text-white"
			>
				<v-icon
					icon="mdi-information-outline"
					size="18"
					class="opacity-60"
				/>
			</v-btn>
			<v-btn
				rounded="md"
				variant="flat"
				size="40"
				title="Редактировать карту клуба"
				class="bg-white bg-opacity-5 text-white"
				@click="enterEditMode"
			>
				<v-icon
					icon="mdi-pencil-outline"
					size="18"
					class="opacity-60"
				/>
			</v-btn>
		</div>

		<div
			:class="{ 'pt-5': !editing }"
			class="club-layout__grid d-flex flex-column flex-1-1-0 position-relative"
		>
			<club-layout-grid
				class="flex-1-1-0"
				:grid-size="layoutStore.gridSize"
				:elements="visibleElements"
				:device-presentations="devicePresentations"
				:editing="editing"
				:interaction-active="interactionActive"
				:preview-element="previewElement"
				:preview-cells="previewCells"
				:preview-valid="previewValid"
				:selected-element-ids="selectedElementIds"
				:moving-element-id="movingElementId"
				:zoom="zoom"
				@cell-hover="hoveredCell = $event"
				@cell-click="onCellClick"
				@element-click="onElementClick"
				@element-drag-start="onElementDragStart"
				@element-drop="onElementDrop"
				@element-drag-cancel="finishElementDrag"
				@device-click="emit('device-click', $event)"
			/>
		</div>

		<club-layout-zoom
			v-model="zoom"
			class="position-fixed right-0 bottom-0 ma-6"
		/>
	</div>
</template>

<script setup>
	import { GRID_ELEMENT_TYPE, TEXT_DIRECTION, WALL_ROTATIONS } from "@/store/clubLayout.js";
	import { DEVICE_TYPE } from "@/store/devices.js";

	const editing = defineModel("editing", {
		type: Boolean,
		default: false,
	});
	const emit = defineEmits(["device-click", "save", "cancel"]);

	const layoutStore = useClubLayoutStore();
	const devicesStore = useDevicesStore();

	let draftElements = $ref([]);
	let activeTool = $ref({ mode: "select" });
	let selectedElementIds = $ref([]);
	let movingElementId = $ref(null);
	let hoveredCell = $ref(null);
	let zoom = $ref(100);

	const cloneElements = (elements) => elements.map((element) => ({ ...element }));
	const createDraftElementId = () =>
		globalThis.crypto?.randomUUID?.() || `layout-draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;

	const visibleElements = $computed(() => (editing.value ? draftElements : layoutStore.elements));
	const selectedElements = $computed(() => draftElements.filter(({ id }) => selectedElementIds.includes(id)));
	const selectedElement = $computed(() => (selectedElements.length === 1 ? selectedElements[0] : null));
	const isDeviceElement = ({ type }) => type === GRID_ELEMENT_TYPE.DEVICE || type === GRID_ELEMENT_TYPE.CONSOLE;
	const placedDeviceIds = $computed(() =>
		draftElements.filter(isDeviceElement).map(({ deviceId }) => String(deviceId))
	);
	const deviceOptions = $computed(() =>
		devicesStore.bootcamps.flatMap((bootcamp) =>
			bootcamp.devices.map((device) => ({
				...device,
				type: device.type || DEVICE_TYPE.COMPUTER,
				tone: bootcamp.tone || "blue",
			}))
		)
	);
	const devicePresentations = $computed(() =>
		Object.fromEntries(deviceOptions.map((device) => [String(device.id), device]))
	);

	const movingElement = $computed(() => draftElements.find(({ id }) => id === movingElementId));
	const buildInteractiveElement = (cell) => {
		if (!cell) return null;

		if (activeTool.mode === "place") {
			return {
				id: "placement-preview",
				...activeTool.element,
				x: cell.x,
				y: cell.y,
			};
		}

		if (movingElement) {
			return {
				...movingElement,
				id: "movement-preview",
				x: cell.x,
				y: cell.y,
			};
		}

		return null;
	};
	const previewElement = $computed(() => buildInteractiveElement(hoveredCell));
	const previewCells = $computed(() => (previewElement ? getElementCells(previewElement) : []));
	const previewValid = $computed(() => {
		if (!previewElement) return false;
		return movingElement ? canMoveDraftElement(previewElement) : canPlaceDraftElement(previewElement);
	});
	const interactionActive = $computed(() => editing.value && (activeTool.mode === "place" || Boolean(movingElement)));

	const toolLabel = $computed(() => {
		if (!editing.value) return `${layoutStore.gridSize.width} × ${layoutStore.gridSize.height}`;
		if (movingElement) return "Перемещение";
		if (activeTool.mode === "select") {
			return selectedElementIds.length ? `Выбрано: ${selectedElementIds.length}` : "Выбор";
		}

		return (
			{
				[GRID_ELEMENT_TYPE.WALL]: "Стена",
				[GRID_ELEMENT_TYPE.TEXT]: "Текст",
				[GRID_ELEMENT_TYPE.DEVICE]: "Компьютер",
				[GRID_ELEMENT_TYPE.CONSOLE]: "Консоль",
				[GRID_ELEMENT_TYPE.VR]: "VR-зона",
				[GRID_ELEMENT_TYPE.STEERING_WHEEL]: "Гоночный симулятор",
				[GRID_ELEMENT_TYPE.TARGET]: "Игровая зона",
				[GRID_ELEMENT_TYPE.BOARD_GAME]: "Настольные игры",
				[GRID_ELEMENT_TYPE.ROOM_SERVICE]: "Зона обслуживания",
				[GRID_ELEMENT_TYPE.TOILET]: "Туалет",
				[GRID_ELEMENT_TYPE.COAT_RACK]: "Вешалка",
				[GRID_ELEMENT_TYPE.SOFA]: "Диван",
				[GRID_ELEMENT_TYPE.COFFEE]: "Кофейная зона",
				[GRID_ELEMENT_TYPE.FOOD]: "Кухонная зона",
			}[activeTool.element?.type] || "Размещение"
		);
	});

	function getElementCells(element) {
		return [{ x: element.x, y: element.y }];
	}

	function canPlaceDraftElement(element) {
		const cells = getElementCells(element);
		const isInsideGrid = cells.every(
			({ x, y }) => x >= 0 && x < layoutStore.gridSize.width && y >= 0 && y < layoutStore.gridSize.height
		);

		if (!isInsideGrid) return false;

		const occupiedCells = new Set(
			draftElements.flatMap((placedElement) => getElementCells(placedElement)).map(({ x, y }) => `${x}:${y}`)
		);

		if (cells.some(({ x, y }) => occupiedCells.has(`${x}:${y}`))) return false;

		return !(
			isDeviceElement(element) &&
			draftElements.some(
				(placedElement) => isDeviceElement(placedElement) && placedElement.deviceId === element.deviceId
			)
		);
	}

	function canMoveDraftElement(element) {
		return (
			element.x >= 0 &&
			element.x < layoutStore.gridSize.width &&
			element.y >= 0 &&
			element.y < layoutStore.gridSize.height
		);
	}

	function resetEditorState() {
		draftElements = cloneElements(layoutStore.elements);
		activeTool = { mode: "select" };
		selectedElementIds = [];
		movingElementId = null;
		hoveredCell = null;
	}

	function enterEditMode() {
		resetEditorState();
		editing.value = true;
	}

	function cancelEditing() {
		resetEditorState();
		editing.value = false;
		emit("cancel");
	}

	function saveChanges() {
		layoutStore.replaceElements(cloneElements(draftElements));
		resetEditorState();
		editing.value = false;
		emit("save", cloneElements(layoutStore.elements));
	}

	function selectTool(tool) {
		activeTool = tool;
		hoveredCell = null;

		if (tool.mode === "place") {
			selectedElementIds = [];
		}

		movingElementId = null;
	}

	function onElementClick({ element, additive }) {
		if (activeTool.mode === "select" && additive) {
			selectedElementIds = selectedElementIds.includes(element.id)
				? selectedElementIds.filter((id) => id !== element.id)
				: [...selectedElementIds, element.id];
			return;
		}

		selectedElementIds = [element.id];
	}

	function onElementDragStart(element) {
		activeTool = { mode: "select" };
		selectedElementIds = [element.id];
		movingElementId = element.id;
	}

	function onElementDrop({ cell }) {
		if (!movingElement || !cell || !canMoveDraftElement({ ...movingElement, ...cell })) {
			finishElementDrag();
			return;
		}

		const source = { x: movingElement.x, y: movingElement.y };
		const targetElement = draftElements.find(({ id, x, y }) => id !== movingElement.id && x === cell.x && y === cell.y);

		movingElement.x = cell.x;
		movingElement.y = cell.y;

		if (targetElement) {
			targetElement.x = source.x;
			targetElement.y = source.y;
		}

		finishElementDrag();
	}

	function finishElementDrag() {
		movingElementId = null;
		hoveredCell = null;
	}

	function onCellClick(cell) {
		if (activeTool.mode === "select") {
			selectedElementIds = [];
			return;
		}

		const targetElement = buildInteractiveElement(cell);
		if (!targetElement || !canPlaceDraftElement(targetElement)) return;

		if (activeTool.mode === "place") {
			const element = {
				...activeTool.element,
				id: createDraftElementId(),
				x: cell.x,
				y: cell.y,
			};

			draftElements.push(element);
			selectedElementIds = [element.id];

			if (isDeviceElement(element)) {
				activeTool = { mode: "select" };
			}
		}

		hoveredCell = null;
	}

	function rotateSelectedElement() {
		if (!selectedElement) return;

		if (selectedElement.type === GRID_ELEMENT_TYPE.WALL) {
			const rotations = WALL_ROTATIONS[selectedElement.kind];
			const currentIndex = rotations.indexOf(selectedElement.rotation);
			selectedElement.rotation = rotations[(currentIndex + 1) % rotations.length];
		} else if (selectedElement.type === GRID_ELEMENT_TYPE.TEXT) {
			const directions = Object.values(TEXT_DIRECTION);
			const currentIndex = directions.indexOf(selectedElement.direction);
			selectedElement.direction = directions[(currentIndex + 1) % directions.length];
		}
	}

	function setSelectedTextAlignment(alignment) {
		if (selectedElement?.type !== GRID_ELEMENT_TYPE.TEXT) return;
		selectedElement.alignment = alignment;
	}

	function deleteSelectedElements() {
		if (!selectedElementIds.length) return;

		const selectedIds = new Set(selectedElementIds);
		draftElements = draftElements.filter(({ id }) => !selectedIds.has(id));
		selectedElementIds = [];
		movingElementId = null;
	}

	watch(
		() => editing.value,
		(isEditing) => {
			if (isEditing) resetEditorState();
		},
		{ immediate: true }
	);
</script>

<style scoped>
	.club-layout,
	.club-layout__grid {
		min-height: 0;
	}
</style>
