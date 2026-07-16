<template>
	<div class="d-flex flex-column ga-4">
		<apps-toolbar
			v-model:expanded="groupsExpanded"
			:groups="groups"
			:selected-apps="selectedApps"
		/>

		<div class="apps-page__groups d-flex flex-column ga-2">
			<div
				v-for="group in groups"
				:key="group.id"
				:class="{
					'apps-page__group--drop-before': dragOverGroupId === group.id && groupDropPosition === 'before',
					'apps-page__group--drop-after': dragOverGroupId === group.id && groupDropPosition === 'after',
				}"
				class="apps-page__group position-relative"
				@dragover.prevent="onGroupDragOver($event, group)"
				@dragleave="onGroupDragLeave($event, group)"
				@drop.prevent="dropGroup(group)"
			>
				<apps-group
					:group="group"
					:expanded="groupsExpanded"
					:selected-apps="selectedApps"
					@select-app="selectApp"
					@reorder-apps="reorderApps"
					@group-drag-start="startGroupDrag"
					@group-drag-end="endGroupDrag"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
	import logitechGhubImg from "@/assets/images/apps/logitech-ghub.png";
	import wlMouseHubImg from "@/assets/images/apps/wl-mouse-hub.png";
	import { useGroupedOrder } from "@/composables/useGroupedOrder";

	const groupsExpanded = ref(true);
	const selectedApps = ref([]);

	const ghub = {
		name: "G HUB",
		img: logitechGhubImg,
	};

	const wlMouse = {
		name: "WL Mouse",
		img: wlMouseHubImg,
	};

	const createApp = (app, id) => ({
		...app,
		id,
	});

	const mockGroups = [
		{
			id: "devices",
			name: "Девайсы",
			apps: [
				createApp(ghub, "devices-ghub-1"),
				createApp(wlMouse, "devices-wl-mouse-1"),
				...Array.from({ length: 7 }, (_, index) => createApp(ghub, `devices-ghub-repeat-${index + 1}`)),
			],
		},
	];

	const {
		groups,
		dragOverGroupId,
		groupDropPosition,
		reorderItems,
		startGroupDrag,
		onGroupDragOver,
		onGroupDragLeave,
		dropGroup,
		endGroupDrag,
	} = useGroupedOrder({
		storageKey: "cascade-apps-order",
		initialGroups: mockGroups,
		itemsKey: "apps",
		groupHeaderSelector: ".apps-group__header",
	});

	const getAppId = (app) => {
		return app?.id || app?.name;
	};

	const selectApp = (app, event) => {
		const isMultipleSelect = event?.ctrlKey || event?.metaKey;
		const appId = getAppId(app);

		if (!isMultipleSelect) {
			selectedApps.value = [app];
			return;
		}

		const isSelected = selectedApps.value.some((selectedApp) => getAppId(selectedApp) === appId);

		selectedApps.value = isSelected
			? selectedApps.value.filter((selectedApp) => getAppId(selectedApp) !== appId)
			: [...selectedApps.value, app];
	};

	const reorderApps = ({ groupId, appId, targetAppId, position }) => {
		reorderItems({
			groupId,
			itemId: appId,
			targetItemId: targetAppId,
			position,
		});
	};
</script>

<route lang="yaml">
meta:
  layout: default
  title: Программы
  icon: mdi-view-grid-outline
  parentTitle: Приложения
</route>

<style scoped lang="scss">
	.apps-page__group {
		&--drop-before,
		&--drop-after {
			&::before {
				position: absolute;
				z-index: 3;
				right: 0;
				left: 0;
				height: 3px;
				border-radius: 3px;
				background: rgb(var(--v-theme-primary));
				content: "";
			}
		}

		&--drop-before::before {
			top: -5px;
		}

		&--drop-after::before {
			bottom: -5px;
		}
	}
</style>
