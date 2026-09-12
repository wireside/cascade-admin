<template>
	<div class="club-layout-grid-scroll overflow-auto pb-2">
		<div
			ref="gridElement"
			:style="gridStyle"
			:class="{ 'club-layout-grid--editing': editing }"
			class="club-layout-grid position-relative"
			@mouseleave="emit('cell-hover', null)"
		>
			<button
				v-for="cell in cells"
				:key="cell.key"
				type="button"
				:disabled="!editing"
				:aria-label="`Ячейка ${cell.x + 1}, ${cell.y + 1}`"
				:style="cellStyle(cell)"
				:class="cellClasses(cell)"
				:data-club-layout-cell="cell.key"
				:data-cell-x="cell.x"
				:data-cell-y="cell.y"
				class="club-layout-grid__cell pa-0 rounded bg-transparent"
				@mouseenter="emit('cell-hover', cell)"
				@focus="emit('cell-hover', cell)"
				@click="emit('cell-click', cell)"
			/>

			<button
				v-for="element in renderedElements"
				:key="element.id"
				type="button"
				:style="elementStyle(element)"
				:disabled="isPreviewElement(element) || (!editing && !isDeviceElement(element))"
				:class="elementClasses(element)"
				:title="elementTitle(element)"
				:aria-pressed="editing ? selectedElementIds.includes(element.id) : undefined"
				:aria-grabbed="editing ? element.id === movingElementId : undefined"
				:data-club-layout-cell="`${element.x}:${element.y}`"
				:data-cell-x="element.x"
				:data-cell-y="element.y"
				class="club-layout-grid__element pa-0 overflow-hidden border-0 rounded bg-transparent text-white"
				@pointerdown="onElementPointerDown(element, $event)"
				@click.stop="onElementClick(element, $event)"
			>
				<club-layout-wall
					v-if="element.type === GRID_ELEMENT_TYPE.WALL"
					:kind="element.kind"
					:rotation="element.rotation"
					:joined="!editing && !isPreviewElement(element)"
				/>

				<div
					v-else-if="isDeviceElement(element)"
					:class="`bg-${devicePresentation(element).tone} bg-opacity-15`"
					class="fill-height d-flex flex-column align-center justify-center position-relative rounded"
				>
					<span
						:class="`text-${devicePresentation(element).tone}`"
						class="club-layout-grid__device-id position-absolute top-0 left-0 ma-1 font-weight-medium"
					>
						{{ element.deviceId }}
					</span>
					<v-icon
						v-if="editing"
						:color="devicePresentation(element).tone"
						:icon="element.type === GRID_ELEMENT_TYPE.CONSOLE ? 'mdi-gamepad-variant-outline' : 'mdi-monitor'"
						size="16"
					/>
					<div
						v-if="!editing && deviceBookingTime(element)"
						:class="`text-${devicePresentation(element).tone}`"
						class="club-layout-grid__device-booking position-absolute bottom-0 left-0 ma-1 d-flex align-center ga-1 font-weight-medium"
					>
						<v-icon
							icon="mdi-clock-outline"
							size="11"
						/>
						<span>{{ deviceBookingTime(element) }}</span>
					</div>
				</div>

				<div
					v-else-if="element.type === GRID_ELEMENT_TYPE.TEXT"
					class="club-layout-grid__text fill-height position-relative font-weight-medium"
				>
					<span
						:style="textAnchorStyle(element)"
						class="club-layout-grid__text-anchor position-absolute w-0 h-0"
					>
						<span
							:style="textStyle(element)"
							class="club-layout-grid__text-value position-absolute d-block text-no-wrap"
						>
							{{ element.text }}
						</span>
					</span>
				</div>

				<span
					v-else-if="element.type === GRID_ELEMENT_TYPE.TOILET"
					class="club-layout-grid__toilet text-red font-weight-medium"
				>
					WC
				</span>

				<v-icon
					v-else-if="element.type === GRID_ELEMENT_TYPE.COAT_RACK"
					icon="mdi-hanger"
					size="18"
					class="opacity-50"
				/>

				<v-icon
					v-else
					:icon="elementIcon(element.type)"
					size="23"
					class="opacity-60"
				/>
			</button>
		</div>
	</div>
</template>

<script setup>
	import { GRID_ELEMENT_TYPE, TEXT_ALIGNMENT, TEXT_DIRECTION } from "@/store/clubLayout.js";

	const props = defineProps({
		gridSize: {
			type: Object,
			required: true,
		},
		elements: {
			type: Array,
			default: () => [],
		},
		devicePresentations: {
			type: Object,
			default: () => ({}),
		},
		editing: {
			type: Boolean,
			default: false,
		},
		interactionActive: {
			type: Boolean,
			default: false,
		},
		previewElement: {
			type: Object,
			default: null,
		},
		previewCells: {
			type: Array,
			default: () => [],
		},
		previewValid: {
			type: Boolean,
			default: false,
		},
		selectedElementIds: {
			type: Array,
			default: () => [],
		},
		movingElementId: {
			type: String,
			default: null,
		},
	});

	const emit = defineEmits([
		"cell-hover",
		"cell-click",
		"element-click",
		"element-drag-start",
		"element-drop",
		"element-drag-cancel",
		"device-click",
	]);
	const DRAG_THRESHOLD = 5;

	let gridElement = $ref(null);
	let pointerDrag = null;
	let suppressClick = false;

	const cells = $computed(() =>
		Array.from({ length: props.gridSize.width * props.gridSize.height }, (_, index) => {
			const x = index % props.gridSize.width;
			const y = Math.floor(index / props.gridSize.width);
			return { x, y, key: `${x}:${y}` };
		})
	);

	const previewCellKeys = $computed(() => new Set(props.previewCells.map(({ x, y }) => `${x}:${y}`)));
	const renderedElements = $computed(() =>
		props.previewElement ? [...props.elements, props.previewElement] : props.elements
	);
	const gridStyle = $computed(() => ({
		gridTemplateColumns: `repeat(${props.gridSize.width}, var(--club-layout-cell-size))`,
		gridTemplateRows: `repeat(${props.gridSize.height}, var(--club-layout-cell-size))`,
	}));

	const cellClasses = (cell) => ({
		border: props.editing,
		"border-0": !props.editing,
		"club-layout-grid__cell--interactive": props.interactionActive,
		"club-layout-grid__cell--preview-valid": previewCellKeys.has(cell.key) && props.previewValid,
		"club-layout-grid__cell--preview-invalid": previewCellKeys.has(cell.key) && !props.previewValid,
	});
	const cellStyle = (cell) => ({
		gridColumnStart: cell.x + 1,
		gridRowStart: cell.y + 1,
	});

	const elementStyle = (element) => ({
		gridColumnStart: element.x + 1,
		gridRowStart: element.y + 1,
	});

	const elementClasses = (element) => {
		const isDevice = isDeviceElement(element);
		const isWall = element.type === GRID_ELEMENT_TYPE.WALL;
		const isText = element.type === GRID_ELEMENT_TYPE.TEXT;
		const isDecoration = element.type === GRID_ELEMENT_TYPE.TOILET || element.type === GRID_ELEMENT_TYPE.COAT_RACK;
		const isMoving = element.id === props.movingElementId;
		const isPreview = isPreviewElement(element);
		const isInteractive = props.editing || isDevice;

		return {
			"overflow-visible": isWall || isText,
			"cursor-pointer": isInteractive && !props.editing,
			"cursor-grab": isInteractive && props.editing && !isMoving,
			"cursor-grabbing opacity-40 border-dashed": isMoving,
			"pointer-events-none opacity-60 border-dashed": isPreview,
			"club-layout-grid__element--selected": props.selectedElementIds.includes(element.id),
			"club-layout-grid__element--moving": isMoving,
			"club-layout-grid__element--interactive": isInteractive,
			"club-layout-grid__element--preview": isPreview,
			"club-layout-grid__element--preview-invalid": isPreview && !props.previewValid,
		};
	};

	const isPreviewElement = (element) => element === props.previewElement;
	const isDeviceElement = ({ type }) => type === GRID_ELEMENT_TYPE.DEVICE || type === GRID_ELEMENT_TYPE.CONSOLE;

	const devicePresentation = (element) =>
		props.devicePresentations[element.deviceId] || {
			name: `Устройство ${element.deviceId}`,
			tone: "blue",
		};
	const deviceBookingTime = (element) => devicePresentation(element).nextBookingTime || "";

	const elementTitle = (element) => {
		if (props.editing) return "Нажмите для выбора, зажмите для перемещения, Shift + клик — добавить к выбору";
		if (isDeviceElement(element)) return devicePresentation(element).name;
		return "";
	};

	const elementIcon = () => "mdi-shape-outline";

	const textAnchorPositions = {
		[TEXT_DIRECTION.RIGHT]: {
			[TEXT_ALIGNMENT.START]: { left: 0, top: "50%" },
			[TEXT_ALIGNMENT.CENTER]: { left: "50%", top: "50%" },
			[TEXT_ALIGNMENT.END]: { left: "100%", top: "50%" },
		},
		[TEXT_DIRECTION.DOWN]: {
			[TEXT_ALIGNMENT.START]: { left: "50%", top: 0 },
			[TEXT_ALIGNMENT.CENTER]: { left: "50%", top: "50%" },
			[TEXT_ALIGNMENT.END]: { left: "50%", top: "100%" },
		},
		[TEXT_DIRECTION.LEFT]: {
			[TEXT_ALIGNMENT.START]: { left: "100%", top: "50%" },
			[TEXT_ALIGNMENT.CENTER]: { left: "50%", top: "50%" },
			[TEXT_ALIGNMENT.END]: { left: 0, top: "50%" },
		},
		[TEXT_DIRECTION.UP]: {
			[TEXT_ALIGNMENT.START]: { left: "50%", top: "100%" },
			[TEXT_ALIGNMENT.CENTER]: { left: "50%", top: "50%" },
			[TEXT_ALIGNMENT.END]: { left: "50%", top: 0 },
		},
	};
	const textTranslations = {
		[TEXT_ALIGNMENT.START]: "translate(0, -50%)",
		[TEXT_ALIGNMENT.CENTER]: "translate(-50%, -50%)",
		[TEXT_ALIGNMENT.END]: "translate(-100%, -50%)",
	};

	const textAnchorStyle = (element) => {
		const direction = element.direction ?? TEXT_DIRECTION.RIGHT;
		const alignment = element.alignment || TEXT_ALIGNMENT.CENTER;

		return {
			...textAnchorPositions[direction][alignment],
			transform: `rotate(${direction}deg)`,
		};
	};
	const textStyle = (element) => ({
		color: ["white", "red", "blue", "primary", "purple"].includes(element.color)
			? `rgb(var(--v-theme-${element.color}))`
			: element.color,
		fontSize: `${element.fontSize}px`,
		transform: textTranslations[element.alignment || TEXT_ALIGNMENT.CENTER],
	});
	const findCellAtPoint = (clientX, clientY) => {
		for (const node of document.elementsFromPoint(clientX, clientY)) {
			const cellNode = node.closest?.("[data-club-layout-cell]");

			if (!cellNode || !gridElement?.contains(cellNode)) continue;

			const x = Number(cellNode.dataset.cellX);
			const y = Number(cellNode.dataset.cellY);

			if (Number.isInteger(x) && Number.isInteger(y)) return { x, y };
		}

		return null;
	};
	const stopPointerTracking = () => {
		window.removeEventListener("pointermove", onElementPointerMove);
		window.removeEventListener("pointerup", onElementPointerUp);
		window.removeEventListener("pointercancel", onElementPointerCancel);
	};

	const finishPointerDrag = (event, cancelled = false) => {
		if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
		stopPointerTracking();

		if (pointerDrag.active) {
			suppressClick = true;
			emit(cancelled ? "element-drag-cancel" : "element-drop", {
				element: pointerDrag.element,
				cell: cancelled ? null : findCellAtPoint(event.clientX, event.clientY) || pointerDrag.lastCell,
			});
			emit("cell-hover", null);
			requestAnimationFrame(() => {
				suppressClick = false;
			});
		}

		pointerDrag = null;
	};

	const onElementPointerDown = (element, event) => {
		if (!props.editing || isPreviewElement(element) || event.button !== 0) return;
		stopPointerTracking();

		pointerDrag = {
			element,
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			active: false,
			lastCell: { x: element.x, y: element.y },
		};
		window.addEventListener("pointermove", onElementPointerMove, { passive: false });
		window.addEventListener("pointerup", onElementPointerUp);
		window.addEventListener("pointercancel", onElementPointerCancel);
	};

	const onElementPointerMove = (event) => {
		if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;

		if (
			!pointerDrag.active &&
			Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY) >= DRAG_THRESHOLD
		) {
			pointerDrag.active = true;
			emit("element-drag-start", pointerDrag.element);
		}

		if (!pointerDrag.active) return;

		event.preventDefault();
		pointerDrag.lastCell = findCellAtPoint(event.clientX, event.clientY);
		emit("cell-hover", pointerDrag.lastCell);
	};

	const onElementPointerUp = (event) => finishPointerDrag(event);
	const onElementPointerCancel = (event) => finishPointerDrag(event, true);
	onBeforeUnmount(stopPointerTracking);

	const onElementClick = (element, event) => {
		if (suppressClick) return;

		if (props.editing) {
			emit("element-click", { element, additive: event.shiftKey });
			return;
		}

		if (isDeviceElement(element)) {
			emit("device-click", element.deviceId);
		}
	};
</script>

<style scoped lang="scss">
	.club-layout-grid-scroll {
		overscroll-behavior-x: contain;
	}

	.club-layout-grid {
		--club-layout-cell-size: 56px;
		--club-layout-grid-gap: 4px;
		--club-layout-grid-half-gap: 2px;

		display: grid;
		gap: var(--club-layout-grid-gap);
		width: max-content;
		min-width: 100%;

		&__cell {
			z-index: 1;
			outline: none;
			transition:
				border-color 120ms ease,
				background-color 120ms ease,
				box-shadow 120ms ease;
		}

		&__cell--interactive {
			z-index: 4;
			cursor: crosshair;
		}

		&__cell--interactive:hover,
		&__cell--preview-valid {
			border-color: rgb(var(--v-theme-primary));
			background: rgba(var(--v-theme-primary), 0.08) !important;
			box-shadow: inset 0 0 0 1px rgba(var(--v-theme-primary), 0.55);
		}

		&__cell--preview-invalid {
			border-color: rgb(var(--v-theme-red));
			background: rgba(var(--v-theme-red), 0.1) !important;
			box-shadow: inset 0 0 0 1px rgba(var(--v-theme-red), 0.45);
		}

		&__element {
			z-index: 2;
			outline: none;
			transition:
				border-color 140ms ease,
				box-shadow 140ms ease,
				opacity 140ms ease;
		}

		&--editing &__element--interactive {
			touch-action: none;
			user-select: none;
		}

		&__element--interactive:hover,
		&__element--selected {
			border-color: rgb(var(--v-theme-blue));
			box-shadow: inset 0 0 0 1px rgba(var(--v-theme-blue), 0.65);
		}

		&__element--preview {
			z-index: 3;
			border-color: rgb(var(--v-theme-primary));
			box-shadow: inset 0 0 0 1px rgba(var(--v-theme-primary), 0.45);
		}

		&__element--preview-invalid {
			border-color: rgb(var(--v-theme-red));
			box-shadow: inset 0 0 0 1px rgba(var(--v-theme-red), 0.4);
		}

		&__text-anchor {
			transform-origin: center;
		}

		&__text-value {
			line-height: 1;
		}

		&__device-id {
			font-size: 10px;
			line-height: 1;
		}

		&__device-booking {
			font-size: 9px;
			line-height: 1;
		}

		&__toilet {
			font-size: 11px;
			line-height: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.club-layout-grid__cell,
		.club-layout-grid__element {
			transition: none;
		}
	}
</style>
