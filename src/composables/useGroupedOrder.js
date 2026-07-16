import { useStorage } from "@vueuse/core";
import { ref, watch } from "vue";

export const useGroupedOrder = ({ storageKey, initialGroups, itemsKey, groupHeaderSelector }) => {
	const savedOrder = useStorage(storageKey, {
		groups: [],
		[itemsKey]: {},
	});

	const applySavedOrder = (items, ids, getId) => {
		const itemsById = new Map(items.map((item) => [getId(item), item]));
		const orderedIds = Array.isArray(ids) ? ids : [];
		const orderedIdSet = new Set(orderedIds);

		return [
			...orderedIds.map((id) => itemsById.get(id)).filter(Boolean),
			...items.filter((item) => !orderedIdSet.has(getId(item))),
		];
	};

	const moveItem = (items, itemId, targetItemId, position, getId) => {
		if (itemId === targetItemId) return items;

		const nextItems = [...items];
		const sourceIndex = nextItems.findIndex((item) => getId(item) === itemId);
		if (sourceIndex < 0) return items;

		const [movedItem] = nextItems.splice(sourceIndex, 1);
		const targetIndex = nextItems.findIndex((item) => getId(item) === targetItemId);
		if (targetIndex < 0) return items;

		nextItems.splice(targetIndex + (position === "after" ? 1 : 0), 0, movedItem);
		return nextItems;
	};

	const orderedGroups = applySavedOrder(initialGroups, savedOrder.value?.groups, (group) => group.id);
	const groups = ref(
		orderedGroups.map((group) => ({
			...group,
			[itemsKey]: applySavedOrder(group[itemsKey], savedOrder.value?.[itemsKey]?.[group.id], (item) => item.id),
		}))
	);

	const draggedGroupId = ref(null);
	const dragOverGroupId = ref(null);
	const groupDropPosition = ref(null);

	const reorderItems = ({ groupId, itemId, targetItemId, position }) => {
		groups.value = groups.value.map((group) => {
			if (group.id !== groupId) return group;

			return {
				...group,
				[itemsKey]: moveItem(group[itemsKey], itemId, targetItemId, position, (item) => item.id),
			};
		});
	};

	const clearGroupDropTarget = () => {
		dragOverGroupId.value = null;
		groupDropPosition.value = null;
	};

	const endGroupDrag = () => {
		draggedGroupId.value = null;
		clearGroupDropTarget();
	};

	const startGroupDrag = (group) => {
		draggedGroupId.value = group.id;
	};

	const onGroupDragOver = (event, group) => {
		if (!draggedGroupId.value || draggedGroupId.value === group.id) {
			clearGroupDropTarget();
			return;
		}

		const header = event.currentTarget.querySelector(groupHeaderSelector);
		const bounds = header?.getBoundingClientRect() || event.currentTarget.getBoundingClientRect();

		dragOverGroupId.value = group.id;
		groupDropPosition.value = event.clientY > bounds.top + bounds.height / 2 ? "after" : "before";
		if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
	};

	const onGroupDragLeave = (event, group) => {
		if (event.currentTarget.contains(event.relatedTarget)) return;
		if (dragOverGroupId.value === group.id) clearGroupDropTarget();
	};

	const dropGroup = (group) => {
		if (draggedGroupId.value && draggedGroupId.value !== group.id) {
			groups.value = moveItem(
				groups.value,
				draggedGroupId.value,
				group.id,
				groupDropPosition.value || "before",
				(item) => item.id
			);
		}

		endGroupDrag();
	};

	watch(
		groups,
		(value) => {
			savedOrder.value = {
				groups: value.map((group) => group.id),
				[itemsKey]: Object.fromEntries(value.map((group) => [group.id, group[itemsKey].map((item) => item.id)])),
			};
		},
		{ deep: true, immediate: true }
	);

	return {
		groups,
		draggedGroupId,
		dragOverGroupId,
		groupDropPosition,
		reorderItems,
		startGroupDrag,
		onGroupDragOver,
		onGroupDragLeave,
		dropGroup,
		endGroupDrag,
	};
};
