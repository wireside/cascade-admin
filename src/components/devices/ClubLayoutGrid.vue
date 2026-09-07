<template>
	<div class="club-layout-grid-scroll overflow-auto pb-2">
		<div
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
				class="club-layout-grid__cell bg-transparent rounded"
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
				class="club-layout-grid__element rounded text-white"
				@click.stop="onElementClick(element, $event)"
			>
				<club-layout-wall
					v-if="element.type === GRID_ELEMENT_TYPE.WALL"
					:kind="element.kind"
					:rotation="element.rotation"
				/>

				<div
					v-else-if="isDeviceElement(element)"
					:class="`bg-${devicePresentation(element).tone} bg-opacity-15`"
					class="club-layout-grid__device fill-height d-flex flex-column align-center justify-center position-relative"
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
						class="club-layout-grid__text-anchor"
					>
						<span
							:style="textStyle(element)"
							class="club-layout-grid__text-value"
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

	const emit = defineEmits(["cell-hover", "cell-click", "element-click", "device-click"]);

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
		"club-layout-grid__cell--interactive": props.interactionActive,
		"club-layout-grid__cell--preview-valid": previewCellKeys.has(cell.key) && props.previewValid,
		"club-layout-grid__cell--preview-invalid": previewCellKeys.has(cell.key) && !props.previewValid,
	});
	// Explicit coordinates keep the cell layer aligned with positioned elements and previews.
	const cellStyle = (cell) => ({
		gridColumnStart: cell.x + 1,
		gridRowStart: cell.y + 1,
	});

	const elementStyle = (element) => ({
		gridColumnStart: element.x + 1,
		gridRowStart: element.y + 1,
	});

	const elementClasses = (element) => ({
		"club-layout-grid__element--selected": props.selectedElementIds.includes(element.id),
		"club-layout-grid__element--moving": element.id === props.movingElementId,
		"club-layout-grid__element--device": isDeviceElement(element),
		"club-layout-grid__element--wall": element.type === GRID_ELEMENT_TYPE.WALL,
		"club-layout-grid__element--text": element.type === GRID_ELEMENT_TYPE.TEXT,
		"club-layout-grid__element--decoration":
			element.type === GRID_ELEMENT_TYPE.TOILET || element.type === GRID_ELEMENT_TYPE.COAT_RACK,
		"club-layout-grid__element--interactive": props.editing || isDeviceElement(element),
		"club-layout-grid__element--preview": isPreviewElement(element),
		"club-layout-grid__element--preview-invalid": isPreviewElement(element) && !props.previewValid,
	});

	const isPreviewElement = (element) => element === props.previewElement;
	const isDeviceElement = ({ type }) => type === GRID_ELEMENT_TYPE.DEVICE || type === GRID_ELEMENT_TYPE.CONSOLE;

	const devicePresentation = (element) =>
		props.devicePresentations[element.deviceId] || {
			name: `Устройство ${element.deviceId}`,
			tone: "blue",
		};
	const deviceBookingTime = (element) => devicePresentation(element).nextBookingTime || "";

	const elementTitle = (element) => {
		if (props.editing) return "Нажмите для выбора, Shift + клик — добавить к выбору";
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
		whiteSpace: "nowrap",
	});

	const onElementClick = (element, event) => {
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
		--club-layout-cell-size: clamp(44px, 3.6vw, 56px);

		display: grid;
		gap: 4px;
		width: max-content;
		min-width: 100%;

		&__cell,
		&__element {
			min-width: 0;
			border: 1px solid transparent;
		}

		&__cell {
			z-index: 1;
			padding: 0;
			outline: none;
			transition:
				border-color 120ms ease,
				background-color 120ms ease,
				box-shadow 120ms ease;
		}

		&--editing &__cell {
			border-color: rgba(var(--v-border-color), var(--v-border-opacity));
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
			padding: 0;
			overflow: hidden;
			border-color: rgba(var(--v-border-color), 0.08);
			background: rgba(var(--v-theme-white), 0.025);
			outline: none;
			transition:
				border-color 140ms ease,
				box-shadow 140ms ease,
				opacity 140ms ease;
		}

		&__element--interactive {
			cursor: pointer;
		}

		&__element--device {
			border: 0;
		}

		&__element--interactive:hover,
		&__element--selected {
			border-color: rgb(var(--v-theme-blue));
			box-shadow: inset 0 0 0 1px rgba(var(--v-theme-blue), 0.65);
		}

		&__element--moving {
			opacity: 0.35;
			border-style: dashed;
		}

		&__element--preview {
			z-index: 3;
			opacity: 0.62;
			border-color: rgb(var(--v-theme-primary));
			border-style: dashed;
			box-shadow: inset 0 0 0 1px rgba(var(--v-theme-primary), 0.45);
			pointer-events: none;
		}

		&__element--preview-invalid {
			border-color: rgb(var(--v-theme-red));
			box-shadow: inset 0 0 0 1px rgba(var(--v-theme-red), 0.4);
		}

		&__element--wall,
		&__element--text,
		&__element--decoration {
			border-color: transparent;
			background: transparent;
		}

		&__element--text {
			overflow: visible;
		}

		&__text-anchor {
			position: absolute;
			width: 0;
			height: 0;
			transform-origin: center;
		}

		&__text-value {
			position: absolute;
			display: block;
			line-height: 1;
		}

		&__element:disabled {
			color: inherit;
		}

		&__device {
			border-radius: inherit;
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
