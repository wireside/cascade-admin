<template>
	<section
		:class="{ 'apps-group--dragging': groupDragging }"
		class="apps-group"
	>
		<header
			:class="isExpanded && 'rounded-b-0'"
			class="apps-group__header d-flex align-center justify-space-between ga-4 bg-white bg-opacity-5 px-5 py-4 rounded-lg"
		>
			<div class="d-flex align-center ga-3 overflow-hidden">
				<s-badge
					:label="appsCount"
					tone="primary"
					bg-opacity="20"
				/>

				<div class="apps-group__title text-white font-weight-bold text-truncate">
					{{ group.name }}
				</div>

				<v-icon
					icon="mdi-pencil-outline"
					size="18"
					class="text-white opacity-50 flex-shrink-0"
				/>
			</div>

			<div class="d-flex align-center ga-2 flex-shrink-0">
				<v-btn
					icon
					variant="text"
					color="red"
					size="34"
					rounded="md"
					class="bg-red bg-opacity-20 text-red"
					:class="{ 'pointer-events-none': !selectedInGroup }"
				>
					<v-icon
						icon="mdi-trash-can-outline"
						size="16"
					/>
				</v-btn>

				<v-btn
					icon
					variant="flat"
					color="white"
					size="34"
					rounded="md"
					class="bg-white bg-opacity-5 text-white"
					@click="isExpanded = !isExpanded"
				>
					<v-icon
						:icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
						size="16"
						class="opacity-50"
					/>
				</v-btn>

				<s-drag-handle
					size="34"
					aria-label="Изменить порядок группы"
					class="bg-white bg-opacity-5"
					@dragstart.stop="startGroupDrag"
					@dragend.stop="endGroupDrag"
				/>
			</div>
		</header>

		<s-collapse :expanded="isExpanded">
			<div class="apps-group__content bg-white bg-opacity-2 pa-5">
				<v-row
					class="ma-0 ga-4"
					no-gutters
				>
					<v-col
						v-for="app in group.apps"
						:key="getAppId(app)"
						cols="auto"
						@dragover.prevent="onAppDragOver($event, app)"
						@dragleave="onAppDragLeave($event, app)"
						@drop.prevent="dropApp($event, app)"
					>
						<article
							:class="{
								'apps-group__card--selected': isSelected(app),
								'apps-group__card--dragging': draggedAppId === getAppId(app),
								'apps-group__card--drop-before': dragOverAppId === getAppId(app) && appDropPosition === 'before',
								'apps-group__card--drop-after': dragOverAppId === getAppId(app) && appDropPosition === 'after',
							}"
							draggable="true"
							class="apps-group__card position-relative rounded-md d-flex flex-column align-center px-5 bg-white bg-opacity-2"
							@click="selectApp(app, $event)"
							@dragstart.stop="startAppDrag($event, app)"
							@dragend.stop="endAppDrag"
						>
							<v-img
								:src="app.img"
								:alt="app.name"
								width="77"
								height="77"
								class="apps-group__icon flex-grow-0"
								contain
							/>

							<div class="apps-group__card-title text-white text-center font-weight-bold">
								{{ app.name }}
							</div>
						</article>
					</v-col>
				</v-row>
			</div>
		</s-collapse>
	</section>
</template>

<script setup>
	import { useItemReorderDrag } from "@/composables/useItemReorderDrag";

	const props = defineProps({
		group: {
			type: Object,
			required: true,
		},
		expanded: {
			type: Boolean,
			default: true,
		},
		selectedApps: {
			type: Array,
			default: () => [],
		},
	});

	const emit = defineEmits(["select-app", "reorder-apps", "group-drag-start", "group-drag-end"]);

	const isExpanded = ref(props.expanded);
	const groupDragging = ref(false);

	const appsCount = computed(() => props.group.apps?.length || 0);

	const selectedInGroup = computed(() => {
		return props.group.apps?.some((app) => isSelected(app));
	});

	const getAppId = (app) => {
		return app?.id || app?.name;
	};

	const isSelected = (app) => {
		return props.selectedApps.some((selectedApp) => getAppId(selectedApp) === getAppId(app));
	};

	const selectApp = (app, event) => {
		emit("select-app", app, event);
	};

	const {
		draggedItemId: draggedAppId,
		dragOverItemId: dragOverAppId,
		dropPosition: appDropPosition,
		startItemDrag: startAppDrag,
		onItemDragOver: onAppDragOver,
		onItemDragLeave: onAppDragLeave,
		dropItem: dropApp,
		endItemDrag: endAppDrag,
	} = useItemReorderDrag({
		getItemId: getAppId,
		targetSelector: ".apps-group__card",
		onReorder: ({ itemId, targetItemId, position }) => {
			emit("reorder-apps", {
				groupId: props.group.id,
				appId: itemId,
				targetAppId: targetItemId,
				position,
			});
		},
	});

	const startGroupDrag = (event) => {
		groupDragging.value = true;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData("text/plain", props.group.id);
		}
		emit("group-drag-start", props.group);
	};

	const endGroupDrag = () => {
		groupDragging.value = false;
		emit("group-drag-end");
	};

	watch(
		() => props.expanded,
		(value) => {
			isExpanded.value = value;
		}
	);
</script>

<style scoped lang="scss">
	.apps-group {
		transition: opacity 180ms ease;

		&--dragging {
			opacity: 0.5;
		}

		&__header {
			min-height: 48px;
			transition: border-radius 300ms cubic-bezier(0.4, 0, 0.2, 1);
		}

		&__title {
			font-size: 18px;
			line-height: 120%;
		}

		&__content {
			border-radius: 0 0 10px 10px;
		}

		&__card {
			width: 155px;
			height: 157px;
			border: 1px solid transparent;
			cursor: grab;
			transition:
				opacity 160ms ease,
				transform 160ms ease;

			&:active {
				cursor: grabbing;
			}

			&--selected {
				border-color: rgb(var(--v-theme-primary));
			}

			&--dragging {
				opacity: 0.45;
				transform: scale(0.97);
			}

			&--drop-before,
			&--drop-after {
				&::before {
					position: absolute;
					z-index: 2;
					top: 8px;
					bottom: 8px;
					width: 3px;
					border-radius: 3px;
					background: rgb(var(--v-theme-primary));
					content: "";
				}
			}

			&--drop-before::before {
				left: 0;
			}

			&--drop-after::before {
				right: 0;
			}
		}

		&__icon {
			margin-top: 15px;
		}

		&__card-title {
			position: absolute;
			right: 22px;
			bottom: 25px;
			left: 22px;
			line-height: 120%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.apps-group,
		.apps-group__header,
		.apps-group__card {
			transition: none;
		}
	}
</style>
