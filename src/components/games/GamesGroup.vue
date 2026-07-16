<template>
	<section
		:class="{ 'games-group--dragging': groupDragging }"
		class="games-group"
	>
		<header
			:class="isExpanded && 'rounded-b-0'"
			class="games-group__header d-flex align-center justify-space-between ga-4 bg-white bg-opacity-5 px-5 py-4 rounded-lg"
		>
			<div class="d-flex align-center ga-3 overflow-hidden">
				<s-badge
					:label="gamesCount"
					tone="primary"
					bg-opacity="20"
				/>

				<div class="games-group__title text-white font-weight-bold text-truncate">
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
					:class="{ 'pointer-events-none': !selectedInGroup }"
					icon
					variant="text"
					color="red"
					size="34"
					rounded="md"
					class="bg-red bg-opacity-20 text-red"
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
			<div class="games-group__content bg-white bg-opacity-2 pa-5">
				<v-row
					class="ma-0"
					gap="15px"
					no-gutters
				>
					<v-col
						v-for="game in group.games"
						:key="getGameId(game)"
						cols="auto"
						@dragover.prevent="onGameDragOver($event, game)"
						@dragleave="onGameDragLeave($event, game)"
						@drop.prevent="dropGame($event, game)"
					>
						<article
							:class="{
								'games-group__card--selected': isSelected(game),
								'games-group__card--dragging': draggedGameId === getGameId(game),
								'games-group__card--drop-before': dragOverGameId === getGameId(game) && gameDropPosition === 'before',
								'games-group__card--drop-after': dragOverGameId === getGameId(game) && gameDropPosition === 'after',
							}"
							:style="getCardStyle(game)"
							class="games-group__card no-select position-relative overflow-hidden rounded-md d-flex align-end justify-center cursor-pointer"
							@click="selectGame(game, $event)"
							@dblclick="openGame"
							@pointerenter="hoveredGameId = getGameId(game)"
							@pointerleave="clearGameHover(game)"
						>
							<s-drag-handle
								v-show="hoveredGameId === getGameId(game) || isSelected(game) || draggedGameId === getGameId(game)"
								color="background"
								size="32"
								aria-label="Изменить порядок игры"
								class="games-group__card-drag-button bg-opacity-80 position-absolute"
								@click.stop
								@dblclick.stop
								@dragstart.stop="beginGameDrag($event, game)"
								@dragend.stop="endGameDrag"
							/>

							<div class="games-group__card-title text-white text-center font-weight-bold px-4 pb-4">
								{{ game.name }}
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
		selectedGames: {
			type: Array,
			default: () => [],
		},
	});

	const emit = defineEmits(["select-game", "reorder-games", "group-drag-start", "group-drag-end"]);

	const router = useRouter();
	const gameRoute = "/games/0";
	let isExpanded = $ref(props.expanded);
	let groupDragging = $ref(false);
	let hoveredGameId = $ref(null);

	const gamesCount = $computed(() => props.group.games?.length || 0);

	const selectedInGroup = $computed(() => {
		return props.group.games?.some((game) => isSelected(game));
	});

	const getGameId = (game) => {
		return game?.id || game?.name;
	};

	const isSelected = (game) => {
		return props.selectedGames.some((selectedGame) => getGameId(selectedGame) === getGameId(game));
	};

	const selectGame = (game, event) => {
		emit("select-game", game, event);
	};

	const openGame = () => {
		router.push(gameRoute);
	};

	const {
		draggedItemId: draggedGameId,
		dragOverItemId: dragOverGameId,
		dropPosition: gameDropPosition,
		startItemDrag: startGameDrag,
		onItemDragOver: onGameDragOver,
		onItemDragLeave: onGameDragLeave,
		dropItem,
		endItemDrag: endGameDrag,
	} = useItemReorderDrag({
		getItemId: getGameId,
		targetSelector: ".games-group__card",
		onReorder: ({ itemId, targetItemId, position }) => {
			emit("reorder-games", {
				groupId: props.group.id,
				gameId: itemId,
				targetGameId: targetItemId,
				position,
			});
		},
	});

	const clearGameHover = (game) => {
		if (hoveredGameId === getGameId(game)) hoveredGameId = null;
	};

	const beginGameDrag = (event, game) => {
		hoveredGameId = null;
		startGameDrag(event, game);
	};

	const dropGame = (event, game) => {
		hoveredGameId = dropItem(event, game);
	};

	const startGroupDrag = (event) => {
		groupDragging = true;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData("text/plain", props.group.id);
		}
		emit("group-drag-start", props.group);
	};

	const endGroupDrag = () => {
		groupDragging = false;
		emit("group-drag-end");
	};

	const getCardStyle = (game) => {
		const imageLayer = game?.img ? `url(${game.img})` : "linear-gradient(135deg, #252525 0%, #111 100%)";

		return {
			"--game-card-image": imageLayer,
		};
	};

	watch(
		() => props.expanded,
		(value) => {
			isExpanded = value;
		}
	);
</script>

<style scoped lang="scss">
	.games-group {
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
			height: 231px;
			background-image:
				linear-gradient(180deg, rgba(9, 9, 9, 0) 0%, rgba(9, 9, 9, 0) 50%, #090909 100%), var(--game-card-image);
			background-position: center;
			background-size: cover;
			transition:
				opacity 160ms ease,
				transform 160ms ease;

			&--selected {
				border: 1px solid transparent;
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

		&__card-drag-button {
			top: 8px;
			right: 8px;
		}

		&__card-title {
			width: 100%;
			line-height: 120%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.games-group,
		.games-group__header,
		.games-group__card {
			transition: none;
		}
	}
</style>
