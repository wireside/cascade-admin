<template>
	<div class="d-flex flex-column ga-4">
		<games-toolbar
			v-model:expanded="groupsExpanded"
			:groups="groups"
			:selected-game="selectedGame"
		/>

		<games-group
			v-for="group in groups"
			:key="group.name"
			:group="group"
			:expanded="groupsExpanded"
			:selected-game="selectedGame"
			@select-game="selectGame"
		/>
	</div>
</template>

<script setup>
	import callOfDutyImg from "@/assets/images/games/call_of_duty.png";
	import pubgImg from "@/assets/images/games/pubg.png";
	import valorantImg from "@/assets/images/games/valorant.png";

	const groupsExpanded = ref(true);
	const selectedGame = ref(null);

	const callOfDuty = {
		name: "Call Of Duty: Warzone",
		img: callOfDutyImg,
	};

	const valorant = {
		name: "Valorant",
		img: valorantImg,
	};

	const pubg = {
		name: "PUBG: Battlegrounds",
		img: pubgImg,
	};

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

	const createGame = (game, id) => ({
		...game,
		id,
	});

	const createMockGames = (games, count, groupKey) =>
		Array.from({ length: count }, (_, index) => ({
			...games[index % games.length],
			id: `${groupKey}-${index + 1}`,
		}));

	const groups = [
		{
			name: "Без группы",
			games: [
				createGame(callOfDuty, "ungrouped-1"),
				createGame(valorant, "ungrouped-2"),
				createGame(pubg, "ungrouped-3"),
				...Array.from({ length: 6 }, (_, index) => createGame(callOfDuty, `ungrouped-cod-${index + 1}`)),
				...Array.from({ length: 9 }, (_, index) => createGame(pubg, `ungrouped-pubg-${index + 1}`)),
			],
		},
		{
			name: "Шутеры",
			games: createMockGames(groupMockGames.shooters, 28, "shooters"),
		},
		{
			name: "MMO RPG",
			games: createMockGames(groupMockGames.mmoRpg, 20, "mmo-rpg"),
		},
		{
			name: "Extraction",
			games: createMockGames(groupMockGames.extraction, 2, "extraction"),
		},
	];

	const selectGame = (game) => {
		selectedGame.value = game;
	};
</script>

<route lang="yaml">
meta:
  layout: default
  title: Игры
  icon: mdi-controller
  parentTitle: Приложения
</route>
