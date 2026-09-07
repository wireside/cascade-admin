<template>
	<div
		class="club-layout d-flex flex-column ga-3 text-white"
		@keydown.delete.prevent="editing && deleteSelectedElements()"
	>
		<div
			:class="{ 'club-layout__header--editing': editing }"
			class="club-layout__header align-center ga-3"
		>
			<div class="d-flex align-center ga-2 text-no-wrap">
				<v-icon
					:icon="editing ? 'mdi-pencil-outline' : 'mdi-information-outline'"
					:color="editing ? 'blue' : 'white'"
					size="18"
					class="opacity-70"
				/>
				<div>
					<div class="club-layout__status text-caption opacity-50">
						{{ editing ? "Выбран инструмент" : "План помещения" }}
					</div>
					<div class="text-body-2 font-weight-medium">{{ toolLabel }}</div>
				</div>
			</div>

			<club-layout-toolbar
				v-if="editing"
				:active-tool="activeTool"
				:selected-element="selectedElement"
				:selected-count="selectedElementIds.length"
				:devices="deviceOptions"
				:placed-device-ids="placedDeviceIds"
				class="club-layout__toolbar justify-self-center"
				@select-tool="selectTool"
				@rotate-selected="rotateSelectedElement"
				@set-text-alignment="setSelectedTextAlignment"
				@delete-selected="deleteSelectedElements"
			/>

			<div class="d-flex align-center justify-end ga-2">
				<template v-if="editing">
					<v-btn
						variant="text"
						color="white"
						height="40"
						class="px-4 opacity-70"
						@click="cancelEditing"
					>
						Отменить
					</v-btn>
					<v-btn
						color="blue"
						height="40"
						rounded="md"
						class="px-5"
						@click="saveChanges"
					>
						<v-icon
							icon="mdi-content-save-outline"
							size="17"
							class="mr-2"
						/>
						Сохранить
					</v-btn>
				</template>

				<v-btn
					v-else
					color="blue"
					height="40"
					rounded="md"
					class="px-5 bg-opacity-20 text-blue"
					@click="enterEditMode"
				>
					<v-icon
						icon="mdi-pencil-outline"
						size="17"
						class="mr-2"
					/>
					Редактировать
				</v-btn>
			</div>
		</div>

		<div
			v-if="editing"
			:class="previewElement && !previewValid ? 'text-red' : 'text-white'"
			class="club-layout__hint d-flex align-center ga-2 text-caption opacity-60"
		>
			<v-icon
				:icon="previewElement && !previewValid ? 'mdi-alert-circle-outline' : 'mdi-lightbulb-outline'"
				size="15"
			/>
			<span>{{ interactionHint }}</span>
		</div>

		<club-layout-grid
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
			@cell-hover="hoveredCell = $event"
			@cell-click="onCellClick"
			@element-click="onElementClick"
			@device-click="emit('device-click', $event)"
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

		if (activeTool.mode === "move" && movingElement) {
			return {
				...movingElement,
				x: cell.x,
				y: cell.y,
			};
		}

		return null;
	};
	const previewElement = $computed(() => buildInteractiveElement(hoveredCell));
	const previewCells = $computed(() => (previewElement ? getElementCells(previewElement) : []));
	const previewValid = $computed(() => (previewElement ? canPlaceDraftElement(previewElement) : false));
	const interactionActive = $computed(
		() => editing.value && (activeTool.mode === "place" || (activeTool.mode === "move" && Boolean(movingElement)))
	);

	const toolLabel = $computed(() => {
		if (!editing.value) return `${layoutStore.gridSize.width} × ${layoutStore.gridSize.height}`;
		if (activeTool.mode === "select") {
			return selectedElementIds.length ? `Выбрано: ${selectedElementIds.length}` : "Выбор";
		}
		if (activeTool.mode === "move") return movingElement ? "Перемещение" : "Выберите элемент";

		return (
			{
				[GRID_ELEMENT_TYPE.WALL]: "Стена",
				[GRID_ELEMENT_TYPE.TEXT]: "Текст",
				[GRID_ELEMENT_TYPE.DEVICE]: "Компьютер",
				[GRID_ELEMENT_TYPE.CONSOLE]: "Консоль",
				[GRID_ELEMENT_TYPE.TOILET]: "Туалет",
				[GRID_ELEMENT_TYPE.COAT_RACK]: "Вешалка",
			}[activeTool.element?.type] || "Размещение"
		);
	});
	const interactionHint = $computed(() => {
		if (activeTool.mode === "select") {
			if (selectedElementIds.length > 1) {
				return `Выбрано элементов: ${selectedElementIds.length}. Их можно удалить вместе; Shift + клик изменяет выбор.`;
			}

			return selectedElement
				? "Элемент выбран. Shift + клик добавляет к выбору; один элемент можно повернуть или перенести."
				: "Нажмите на элемент, чтобы выбрать его. Shift + клик выбирает несколько.";
		}

		if (activeTool.mode === "move") {
			return movingElement
				? "Наведите на новую ячейку и нажмите, чтобы переместить элемент."
				: "Нажмите на элемент, который хотите переместить.";
		}

		if (previewElement && !previewValid) return "Это место занято или элемент выходит за границы сетки.";
		return "Наведите на ячейку и нажмите, чтобы разместить элемент.";
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

		const ignoredId = activeTool.mode === "move" ? movingElementId : null;
		const occupiedCells = new Set(
			draftElements
				.filter(({ id }) => id !== ignoredId)
				.flatMap((placedElement) => getElementCells(placedElement))
				.map(({ x, y }) => `${x}:${y}`)
		);

		if (cells.some(({ x, y }) => occupiedCells.has(`${x}:${y}`))) return false;

		return !(
			isDeviceElement(element) &&
			draftElements.some(
				(placedElement) =>
					placedElement.id !== ignoredId &&
					isDeviceElement(placedElement) &&
					placedElement.deviceId === element.deviceId
			)
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

		if (tool.mode === "move" && selectedElement) {
			movingElementId = selectedElement.id;
			return;
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

		if (activeTool.mode === "move") {
			movingElementId = element.id;
		}
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
		} else if (activeTool.mode === "move" && movingElementId) {
			const index = draftElements.findIndex(({ id }) => id === movingElementId);
			draftElements[index] = {
				...draftElements[index],
				x: cell.x,
				y: cell.y,
			};
			movingElementId = null;
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

<style scoped lang="scss">
	.club-layout {
		&__header {
			display: grid;
			grid-template-columns: minmax(160px, 1fr) auto;

			&--editing {
				grid-template-columns: minmax(160px, 1fr) minmax(0, auto) minmax(210px, 1fr);
			}
		}

		&__status {
			line-height: 1.1;
		}

		&__toolbar {
			min-width: 0;
		}

		&__hint {
			min-height: 20px;
		}

		@media (max-width: 1199px) {
			&__header,
			&__header--editing {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
			}

			&__toolbar {
				order: 3;
				width: 100%;
			}
		}
	}
</style>
