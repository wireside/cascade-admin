<template>
	<div class="s-page-toolbar d-flex align-center justify-space-between ga-4 flex-wrap">
		<div class="d-flex align-center ga-2 flex-wrap">
			<v-btn
				variant="flat"
				height="44"
				rounded="md"
				class="px-4 bg-white bg-opacity-5 text-white"
			>
				<v-icon
					icon="users-three"
					size="16"
					class="mr-2"
				/>
				<span>Клиенты</span>
				<s-badge
					:label="clientsCount"
					tone="primary"
					class="ml-2"
					bg-opacity="20"
				/>
			</v-btn>

			<v-btn
				variant="flat"
				height="44"
				rounded="md"
				class="px-4 bg-white bg-opacity-5 text-white"
			>
				<v-icon
					icon="user-minus"
					size="16"
					class="mr-2"
				/>
				<span>Заблокированные</span>
				<s-badge
					:label="blockedClientsCount"
					tone="red"
					class="ml-2"
					bg-opacity="25"
				/>
			</v-btn>

			<s-search-bar
				v-model="search"
				placeholder="Найти клиента"
				width="300"
				height="44"
			/>
		</div>

		<div class="d-flex align-center ga-2 flex-wrap">
			<template v-if="hasSelectedClients">
				<v-btn
					variant="flat"
					color="red"
					height="44"
					rounded="md"
					class="px-4 bg-opacity-25 text-red"
				>
					<v-icon
						icon="prohibit"
						size="16"
						class="mr-2"
					/>
					Исключить из группы
				</v-btn>

				<v-btn
					variant="flat"
					color="primary"
					height="44"
					rounded="md"
					class="px-4 text-background"
				>
					<v-icon
						icon="plus"
						size="16"
						class="mr-2"
					/>
					Добавить в группу
					<v-icon
						icon="down"
						size="16"
						class="ml-1"
					/>
				</v-btn>
			</template>

			<v-btn
				icon="clock-counter-clockwise"
				variant="flat"
				size="40"
				rounded="md"
				class="text-white bg-white bg-opacity-5"
			/>
		</div>
	</div>
</template>

<script setup>
	const search = defineModel("search", {
		type: String,
		default: "",
	});

	defineProps({
		clientsCount: {
			type: Number,
			default: 0,
		},
		blockedClientsCount: {
			type: Number,
			default: 0,
		},
		hasSelectedClients: {
			type: Boolean,
			default: false,
		},
	});
</script>
