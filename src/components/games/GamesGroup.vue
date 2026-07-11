<template>
	<section class="games-group">
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

				<v-btn
					:class="{ 'pointer-events-none': !selectedInGroup }"
					:to="selectedInGroup ? gameRoute : undefined"
					icon
					variant="flat"
					color="white"
					size="34"
					rounded="md"
					class="bg-white bg-opacity-5 text-white"
				>
					<v-icon
						icon="mdi-arrow-expand-all"
						size="16"
						class="opacity-50 mdi-rotate-45"
					/>
				</v-btn>
			</div>
		</header>

		<v-expand-transition>
			<div
				v-show="isExpanded"
				class="games-group__content bg-white bg-opacity-2 pa-5"
			>
				<v-row
					class="ma-0"
					gap="15px"
					no-gutters
				>
					<v-col
						v-for="game in group.games"
						:key="getGameId(game)"
						cols="auto"
					>
						<v-hover>
							<template #default="{ isHovering, props: hoverProps }">
								<article
									v-bind="hoverProps"
									:class="{ 'games-group__card--selected': isSelected(game) }"
									:style="getCardStyle(game)"
									class="games-group__card position-relative overflow-hidden rounded-md d-flex align-end justify-center cursor-pointer"
									@click="selectGame(game)"
								>
									<v-btn
										v-if="isHovering || isSelected(game)"
										:to="gameRoute"
										icon
										variant="flat"
										color="background"
										size="32"
										rounded="md"
										class="games-group__open-button bg-opacity-80 text-white position-absolute"
										@click.stop
									>
										<v-icon
											icon="mdi-arrow-expand-all"
											size="16"
											class="opacity-50 mdi-rotate-45"
										/>
									</v-btn>

									<div class="games-group__card-title text-white text-center font-weight-bold px-4 pb-4">
										{{ game.name }}
									</div>
								</article>
							</template>
						</v-hover>
					</v-col>
				</v-row>
			</div>
		</v-expand-transition>
	</section>
</template>

<script setup>
	const props = defineProps({
		group: {
			type: Object,
			required: true,
		},
		expanded: {
			type: Boolean,
			default: true,
		},
		selectedGame: {
			type: Object,
			default: null,
		},
	});

	const emit = defineEmits(["select-game"]);

	const gameRoute = "/games/0";
	let isExpanded = $ref(props.expanded);

	const gamesCount = $computed(() => props.group.games?.length || 0);

	const selectedInGroup = $computed(() => {
		return props.group.games?.some((game) => isSelected(game));
	});

	const getGameId = (game) => {
		return game?.id || game?.name;
	};

	const isSelected = (game) => {
		return Boolean(props.selectedGame && getGameId(props.selectedGame) === getGameId(game));
	};

	const selectGame = (game) => {
		emit("select-game", game);
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
		&__header {
			min-height: 48px;
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

			&--selected {
				border: 1px solid transparent;
				border-color: rgb(var(--v-theme-primary));
			}
		}

		&__open-button {
			top: 8px;
			right: 8px;
		}

		&__card-title {
			width: 100%;
			line-height: 120%;
		}
	}
</style>
