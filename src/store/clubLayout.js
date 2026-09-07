import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

export const CLUB_LAYOUT_STORAGE_KEY = "cascade:club-layout";

export const GRID_ELEMENT_TYPE = Object.freeze({
	WALL: "wall",
	DEVICE: "device",
	CONSOLE: "console",
	TOILET: "toilet",
	COAT_RACK: "coat-rack",
	TEXT: "text",
});

export const WALL_KIND = Object.freeze({
	STRAIGHT: "straight",
	CORNER: "corner",
	T_JUNCTION: "t-junction",
	CROSS: "cross",
});

export const ELEMENT_ROTATION = Object.freeze({
	DEG_0: 0,
	DEG_90: 90,
	DEG_180: 180,
	DEG_270: 270,
});

export const TEXT_DIRECTION = Object.freeze({
	RIGHT: ELEMENT_ROTATION.DEG_0,
	DOWN: ELEMENT_ROTATION.DEG_90,
	LEFT: ELEMENT_ROTATION.DEG_180,
	UP: ELEMENT_ROTATION.DEG_270,
});

export const TEXT_ALIGNMENT = Object.freeze({
	START: "start",
	CENTER: "center",
	END: "end",
});

export const WALL_ROTATIONS = Object.freeze({
	[WALL_KIND.STRAIGHT]: Object.freeze([ELEMENT_ROTATION.DEG_0, ELEMENT_ROTATION.DEG_90]),
	[WALL_KIND.CORNER]: Object.freeze(Object.values(ELEMENT_ROTATION)),
	[WALL_KIND.T_JUNCTION]: Object.freeze(Object.values(ELEMENT_ROTATION)),
	[WALL_KIND.CROSS]: Object.freeze([ELEMENT_ROTATION.DEG_0]),
});

export const DEFAULT_CLUB_GRID_SIZE = Object.freeze({
	width: 20,
	height: 10,
});

const DEFAULT_TEXT_COLOR = "white";
const DEFAULT_TEXT_SIZE = 14;
const DEFAULT_TEXT_ALIGNMENT = TEXT_ALIGNMENT.CENTER;
const VALID_ELEMENT_TYPES = new Set(Object.values(GRID_ELEMENT_TYPE));
const VALID_TEXT_DIRECTIONS = new Set(Object.values(TEXT_DIRECTION));
const VALID_TEXT_ALIGNMENTS = new Set(Object.values(TEXT_ALIGNMENT));

let generatedElementId = 0;

function createElementId() {
	if (globalThis.crypto?.randomUUID) {
		return globalThis.crypto.randomUUID();
	}

	generatedElementId += 1;
	return `layout-element-${Date.now()}-${generatedElementId}`;
}

function normalizeRequiredString(value, fieldName) {
	const normalizedValue = String(value ?? "").trim();

	if (!normalizedValue) {
		throw new TypeError(`Поле "${fieldName}" не может быть пустым`);
	}

	return normalizedValue;
}

function normalizeInteger(value, fieldName, minimum = 0) {
	const normalizedValue = Number(value);

	if (!Number.isInteger(normalizedValue) || normalizedValue < minimum) {
		throw new RangeError(`Поле "${fieldName}" должно быть целым числом не меньше ${minimum}`);
	}

	return normalizedValue;
}

function normalizePositiveNumber(value, fieldName) {
	const normalizedValue = Number(value);

	if (!Number.isFinite(normalizedValue) || normalizedValue <= 0) {
		throw new RangeError(`Поле "${fieldName}" должно быть положительным числом`);
	}

	return normalizedValue;
}

function normalizeGridSize(gridSize) {
	return {
		width: normalizeInteger(gridSize?.width, "width", 1),
		height: normalizeInteger(gridSize?.height, "height", 1),
	};
}

function normalizeRotation(value, allowedRotations, fieldName = "rotation") {
	const rotation = Number(value ?? ELEMENT_ROTATION.DEG_0);

	if (!allowedRotations.includes(rotation)) {
		throw new RangeError(`Недопустимое значение поля "${fieldName}": ${value}`);
	}

	return rotation;
}

// Grid coordinates are zero-based: the top-left cell is { x: 0, y: 0 }.
function normalizeElement(payload, { id = payload?.id || createElementId() } = {}) {
	const type = normalizeRequiredString(payload?.type, "type");

	if (!VALID_ELEMENT_TYPES.has(type)) {
		throw new TypeError(`Неизвестный тип элемента: "${type}"`);
	}

	const element = {
		id: normalizeRequiredString(id, "id"),
		type,
		x: normalizeInteger(payload?.x, "x"),
		y: normalizeInteger(payload?.y, "y"),
	};

	if (type === GRID_ELEMENT_TYPE.WALL) {
		const kind = payload?.kind || WALL_KIND.STRAIGHT;
		const allowedRotations = WALL_ROTATIONS[kind];

		if (!allowedRotations) {
			throw new TypeError(`Неизвестный вид стены: "${kind}"`);
		}

		return {
			...element,
			kind,
			rotation: normalizeRotation(payload?.rotation, allowedRotations),
		};
	}

	if (type === GRID_ELEMENT_TYPE.DEVICE || type === GRID_ELEMENT_TYPE.CONSOLE) {
		return {
			...element,
			deviceId: normalizeRequiredString(payload?.deviceId, "deviceId"),
		};
	}

	if (type === GRID_ELEMENT_TYPE.TEXT) {
		const alignment = payload?.alignment || DEFAULT_TEXT_ALIGNMENT;

		if (!VALID_TEXT_ALIGNMENTS.has(alignment)) {
			throw new RangeError(`Недопустимое значение поля "alignment": ${alignment}`);
		}

		return {
			...element,
			text: String(payload?.text ?? ""),
			color: normalizeRequiredString(payload?.color || DEFAULT_TEXT_COLOR, "color"),
			fontSize: normalizePositiveNumber(payload?.fontSize ?? DEFAULT_TEXT_SIZE, "fontSize"),
			direction: normalizeRotation(payload?.direction, [...VALID_TEXT_DIRECTIONS], "direction"),
			alignment,
		};
	}

	return element;
}

function getElementCells(element) {
	return [{ x: element.x, y: element.y }];
}

function isElementWithinGrid(element, gridSize) {
	return getElementCells(element).every(({ x, y }) => x >= 0 && x < gridSize.width && y >= 0 && y < gridSize.height);
}

function elementsOverlap(firstElement, secondElement) {
	const occupiedCells = new Set(getElementCells(firstElement).map(({ x, y }) => `${x}:${y}`));
	return getElementCells(secondElement).some(({ x, y }) => occupiedCells.has(`${x}:${y}`));
}

function isSameDevice(firstElement, secondElement) {
	const deviceElementTypes = [GRID_ELEMENT_TYPE.DEVICE, GRID_ELEMENT_TYPE.CONSOLE];

	return (
		deviceElementTypes.includes(firstElement.type) &&
		deviceElementTypes.includes(secondElement.type) &&
		firstElement.deviceId === secondElement.deviceId
	);
}

function createDefaultState() {
	return {
		gridSize: { ...DEFAULT_CLUB_GRID_SIZE },
		elements: [],
	};
}

function sanitizeState(value) {
	const defaultState = createDefaultState();

	if (!value || typeof value !== "object") {
		return defaultState;
	}

	let gridSize;

	try {
		gridSize = normalizeGridSize(value.gridSize);
	} catch {
		return defaultState;
	}

	const elements = [];
	const elementIds = new Set();

	for (const payload of Array.isArray(value.elements) ? value.elements : []) {
		try {
			const element = normalizeElement(payload, { id: payload?.id });
			const isDuplicateId = elementIds.has(element.id);
			const hasCollision = elements.some((placedElement) => elementsOverlap(placedElement, element));
			const isDeviceAlreadyPlaced = elements.some((placedElement) => isSameDevice(placedElement, element));

			if (!isDuplicateId && !hasCollision && !isDeviceAlreadyPlaced && isElementWithinGrid(element, gridSize)) {
				elements.push(element);
				elementIds.add(element.id);
			}
		} catch {
			// Ignore invalid records so one stale element cannot break the whole saved layout.
		}
	}

	return { gridSize, elements };
}

function readStoredState() {
	try {
		const serializedState = globalThis.localStorage?.getItem(CLUB_LAYOUT_STORAGE_KEY);
		return serializedState ? sanitizeState(JSON.parse(serializedState)) : createDefaultState();
	} catch {
		return createDefaultState();
	}
}

function writeStoredState(gridSize, elements) {
	try {
		globalThis.localStorage?.setItem(
			CLUB_LAYOUT_STORAGE_KEY,
			JSON.stringify({
				gridSize,
				elements,
			})
		);
	} catch {
		// The in-memory layout remains usable when storage is unavailable or full.
	}
}

export const useClubLayoutStore = defineStore("club_layout", () => {
	const initialState = readStoredState();
	const gridSize = ref(initialState.gridSize);
	const elements = ref(initialState.elements);

	const elementsCount = computed(() => elements.value.length);
	const occupiedCellsCount = computed(
		() => new Set(elements.value.flatMap((element) => getElementCells(element).map(({ x, y }) => `${x}:${y}`))).size
	);

	function getElementById(id) {
		return elements.value.find((element) => element.id === String(id));
	}

	function getElementsAtCell(x, y) {
		const normalizedX = Number(x);
		const normalizedY = Number(y);

		return elements.value.filter((element) =>
			getElementCells(element).some((cell) => cell.x === normalizedX && cell.y === normalizedY)
		);
	}

	function isCellInsideGrid(x, y) {
		const normalizedX = Number(x);
		const normalizedY = Number(y);

		return (
			Number.isInteger(normalizedX) &&
			Number.isInteger(normalizedY) &&
			normalizedX >= 0 &&
			normalizedX < gridSize.value.width &&
			normalizedY >= 0 &&
			normalizedY < gridSize.value.height
		);
	}

	function isCellOccupied(x, y) {
		return getElementsAtCell(x, y).length > 0;
	}

	function getOccupiedCells(elementOrId) {
		const element = typeof elementOrId === "object" ? elementOrId : getElementById(elementOrId);
		return element ? getElementCells(element) : [];
	}

	function assertElementCanBePlaced(element, ignoredElementId = null) {
		if (!isElementWithinGrid(element, gridSize.value)) {
			throw new RangeError(`Элемент "${element.id}" выходит за границы сетки`);
		}

		const otherElements = elements.value.filter(({ id }) => id !== ignoredElementId);

		if (otherElements.some((placedElement) => elementsOverlap(placedElement, element))) {
			throw new Error("Выбранные ячейки уже заняты");
		}

		if (otherElements.some((placedElement) => isSameDevice(placedElement, element))) {
			throw new Error(`Устройство "${element.deviceId}" уже размещено на плане`);
		}
	}

	function canPlaceElement(payload, ignoredElementId = null) {
		try {
			const element = normalizeElement(payload, {
				id: payload?.id || "placement-preview",
			});
			assertElementCanBePlaced(element, ignoredElementId);
			return true;
		} catch {
			return false;
		}
	}

	function addElement(payload) {
		const element = normalizeElement(payload);

		if (getElementById(element.id)) {
			throw new Error(`Элемент с id "${element.id}" уже существует`);
		}

		assertElementCanBePlaced(element);
		elements.value.push(element);
		return element;
	}

	function updateElement(id, changes) {
		const index = elements.value.findIndex((element) => element.id === String(id));

		if (index === -1) {
			throw new Error(`Элемент с id "${id}" не найден`);
		}

		const currentElement = elements.value[index];
		const updatedElement = normalizeElement(
			{
				...currentElement,
				...changes,
			},
			{ id: currentElement.id }
		);

		assertElementCanBePlaced(updatedElement, currentElement.id);
		elements.value[index] = updatedElement;
		return updatedElement;
	}

	function moveElement(id, x, y) {
		return updateElement(id, { x, y });
	}

	function removeElement(id) {
		const index = elements.value.findIndex((element) => element.id === String(id));

		if (index === -1) {
			return false;
		}

		elements.value.splice(index, 1);
		return true;
	}

	function replaceElements(payloads) {
		if (!Array.isArray(payloads)) {
			throw new TypeError("Элементы плана должны быть массивом");
		}

		const nextElements = [];
		const elementIds = new Set();

		for (const payload of payloads) {
			const element = normalizeElement(payload, { id: payload?.id });

			if (elementIds.has(element.id)) {
				throw new Error(`Элемент с id "${element.id}" встречается в плане несколько раз`);
			}

			if (!isElementWithinGrid(element, gridSize.value)) {
				throw new RangeError(`Элемент "${element.id}" выходит за границы сетки`);
			}

			if (nextElements.some((placedElement) => elementsOverlap(placedElement, element))) {
				throw new Error(`Элемент "${element.id}" пересекается с другим элементом`);
			}

			if (nextElements.some((placedElement) => isSameDevice(placedElement, element))) {
				throw new Error(`Устройство "${element.deviceId}" размещено на плане несколько раз`);
			}

			nextElements.push(element);
			elementIds.add(element.id);
		}

		elements.value = nextElements;
		return elements.value;
	}

	function setGridSize(width, height, { removeOutOfBounds = false } = {}) {
		const nextGridSize = normalizeGridSize({ width, height });
		const outOfBoundsElements = elements.value.filter((element) => !isElementWithinGrid(element, nextGridSize));

		if (outOfBoundsElements.length && !removeOutOfBounds) {
			throw new Error("Новый размер сетки оставляет размещённые элементы за её границами");
		}

		gridSize.value = nextGridSize;

		if (outOfBoundsElements.length) {
			const outOfBoundsIds = new Set(outOfBoundsElements.map(({ id }) => id));
			elements.value = elements.value.filter(({ id }) => !outOfBoundsIds.has(id));
		}

		return gridSize.value;
	}

	function clearElements() {
		elements.value = [];
	}

	function resetLayout() {
		const defaultState = createDefaultState();
		gridSize.value = defaultState.gridSize;
		elements.value = defaultState.elements;
	}

	watch(
		[gridSize, elements],
		() => {
			writeStoredState(gridSize.value, elements.value);
		},
		{ deep: true, immediate: true }
	);

	return {
		gridSize,
		elements,
		elementsCount,
		occupiedCellsCount,
		getElementById,
		getElementsAtCell,
		getOccupiedCells,
		isCellInsideGrid,
		isCellOccupied,
		canPlaceElement,
		addElement,
		updateElement,
		moveElement,
		removeElement,
		replaceElements,
		setGridSize,
		clearElements,
		resetLayout,
	};
});
