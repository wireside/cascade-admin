<template>
	<div class="d-flex flex-column ga-4">
		<games-toolbar
			v-model:expanded="groupsExpanded"
			:groups="displayedGroups"
			:selected-games="selectedGames"
			@create-game="addGame"
		/>

		<div class="games-page__groups d-flex flex-column ga-2">
			<div
				v-for="group in displayedGroups"
				:key="group.id"
				:class="{
					'games-page__group--drop-before': dragOverGroupId === group.id && groupDropPosition === 'before',
					'games-page__group--drop-after': dragOverGroupId === group.id && groupDropPosition === 'after',
				}"
				class="games-page__group position-relative"
				@dragover.prevent="onGroupDragOver($event, group)"
				@dragleave="onGroupDragLeave($event, group)"
				@drop.prevent="dropGroup(group)"
			>
				<games-group
					:group="group"
					:expanded="groupsExpanded"
					:selected-games="selectedGames"
					:loading="testStore.loading"
					@select-game="selectGame"
					@reorder-games="reorderGames"
					@group-drag-start="startGroupDrag"
					@group-drag-end="endGroupDrag"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
	import callOfDutyImg from "@/assets/images/games/call_of_duty.png";
	import pubgImg from "@/assets/images/games/pubg.png";
	import valorantImg from "@/assets/images/games/valorant.png";
	import { useGroupedOrder } from "@/composables/useGroupedOrder";

	const groupsExpanded = ref(true);
	const selectedGames = ref([]);
	const testStore = useTestStore();

	const groupMockGames = {
		shooters: [
			{ name: "Counter-Strike 2", img: callOfDutyImg },
			{ name: "Apex Legends", img: valorantImg },
			{ name: "Overwatch 2", img: valorantImg },
			{ name: "Rainbow Six Siege", img: callOfDutyImg },
			{ name: "The Finals", img: pubgImg },
			{ name: "Battlefield 2042", img: callOfDutyImg },
		],
		mmoRpg: [
			{ name: "World of Warcraft", img: valorantImg },
			{ name: "Lineage 2", img: pubgImg },
			{ name: "Lost Ark", img: valorantImg },
			{ name: "Black Desert", img: callOfDutyImg },
			{ name: "Final Fantasy XIV", img: pubgImg },
		],
		extraction: [
			{ name: "Escape from Tarkov", img: pubgImg },
			{ name: "Hunt: Showdown", img: callOfDutyImg },
		],
	};

	const createMockGames = (games, count, groupKey) =>
		Array.from({ length: count }, (_, index) => ({
			...games[index % games.length],
			id: `${groupKey}-${index + 1}`,
		}));

	const mockGroups = [
		{
			id: "ungrouped",
			name: "Без группы",
			isDefault: true,
			games: [],
		},
		{
			id: "shooters",
			name: "Шутеры",
			games: createMockGames(groupMockGames.shooters, 28, "shooters"),
		},
		{
			id: "mmo-rpg",
			name: "MMO RPG",
			games: createMockGames(groupMockGames.mmoRpg, 20, "mmo-rpg"),
		},
		{
			id: "extraction",
			name: "Extraction",
			games: createMockGames(groupMockGames.extraction, 2, "extraction"),
		},
	];

	const getGameId = (game) => {
		return game?.id || game?.name;
	};

	const selectGame = (game, event) => {
		const isMultipleSelect = event?.ctrlKey || event?.metaKey;
		const gameId = getGameId(game);

		if (!isMultipleSelect) {
			selectedGames.value = [game];
			return;
		}

		const isSelected = selectedGames.value.some((selectedGame) => getGameId(selectedGame) === gameId);

		selectedGames.value = isSelected
			? selectedGames.value.filter((selectedGame) => getGameId(selectedGame) !== gameId)
			: [...selectedGames.value, game];
	};

	const {
		displayedGroups,
		dragOverGroupId,
		groupDropPosition,
		reorderItems,
		addItemToDefaultGroup,
		startGroupDrag,
		onGroupDragOver,
		onGroupDragLeave,
		dropGroup,
		endGroupDrag,
	} = useGroupedOrder({
		storageKey: "cascade-games-order",
		initialGroups: mockGroups,
		itemsKey: "games",
		groupHeaderSelector: ".games-group__header",
	});

	const addGame = () => {
		const isAdded = addItemToDefaultGroup({
			id: `new-game-${Date.now()}`,
			name: "Новая игра",
			img: null,
		});
		if (!isAdded) return;
		groupsExpanded.value = true;
	};

	const reorderGames = ({ groupId, gameId, targetGameId, position }) => {
		reorderItems({
			groupId,
			itemId: gameId,
			targetItemId: targetGameId,
			position,
		});
	};
</script>

<route lang="yaml">
meta:
  layout: default
  title: Игры
  icon: mdi-controller
  parentTitle: Приложения
</route>

<style scoped lang="scss">
	.games-page__group {
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
