import { ref } from "vue";

export const useItemReorderDrag = ({
	getItemId,
	targetSelector,
	dragPreviewSelector = targetSelector,
	dragPreviewScale = 0.9,
	onReorder,
}) => {
	const draggedItemId = ref(null);
	const dragOverItemId = ref(null);
	const dropPosition = ref(null);

	const setDragPreview = (event) => {
		if (!event.dataTransfer || !dragPreviewSelector) return;

		const source = event.currentTarget.closest(dragPreviewSelector);
		if (!source) return;

		const bounds = source.getBoundingClientRect();
		const preview = source.cloneNode(true);
		const previewWidth = bounds.width * dragPreviewScale;
		const previewHeight = bounds.height * dragPreviewScale;

		preview.querySelectorAll("[data-drag-handle]").forEach((handle) => handle.remove());
		Object.assign(preview.style, {
			position: "fixed",
			top: "-10000px",
			left: "-10000px",
			width: `${previewWidth}px`,
			height: `${previewHeight}px`,
			opacity: "0.9",
			transform: "none",
			pointerEvents: "none",
		});

		document.body.append(preview);
		event.dataTransfer.setDragImage(preview, previewWidth / 2, 24);
		setTimeout(() => preview.remove());
	};

	const clearDropTarget = () => {
		dragOverItemId.value = null;
		dropPosition.value = null;
	};

	const endItemDrag = () => {
		draggedItemId.value = null;
		clearDropTarget();
	};

	const startItemDrag = (event, item) => {
		draggedItemId.value = getItemId(item);

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData("text/plain", draggedItemId.value);
			setDragPreview(event);
		}
	};

	const onItemDragOver = (event, item) => {
		if (!draggedItemId.value) return;

		event.stopPropagation();
		const targetItemId = getItemId(item);

		if (draggedItemId.value === targetItemId) {
			clearDropTarget();
			return;
		}

		const target = event.currentTarget.querySelector(targetSelector);
		const bounds = target?.getBoundingClientRect();

		dragOverItemId.value = targetItemId;
		dropPosition.value = bounds && event.clientX > bounds.left + bounds.width / 2 ? "after" : "before";
		if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
	};

	const onItemDragLeave = (event, item) => {
		if (event.currentTarget.contains(event.relatedTarget)) return;
		if (dragOverItemId.value === getItemId(item)) clearDropTarget();
	};

	const dropItem = (event, item) => {
		if (!draggedItemId.value) return null;

		event.stopPropagation();
		const movedItemId = draggedItemId.value;
		const targetItemId = getItemId(item);

		if (movedItemId !== targetItemId) {
			onReorder({
				itemId: movedItemId,
				targetItemId,
				position: dropPosition.value || "before",
			});
		}

		endItemDrag();
		return movedItemId;
	};

	return {
		draggedItemId,
		dragOverItemId,
		dropPosition,
		startItemDrag,
		onItemDragOver,
		onItemDragLeave,
		dropItem,
		endItemDrag,
	};
};
