<template>
	<div class="s-page-toolbar d-flex align-center justify-space-between ga-4 flex-wrap">
		<div class="d-flex align-center ga-1 flex-wrap">
			<v-btn
				variant="flat"
				height="44"
				rounded="md"
				class="px-4 bg-white bg-opacity-5 text-white"
			>
				<v-icon
					icon="four-leaf-clover"
					size="16"
					class="mr-2"
				/>
				<span>Приложения</span>
				<s-badge
					:label="totalApps || 0"
					tone="primary"
					class="ml-2"
					bg-opacity="20"
				/>
			</v-btn>

			<v-btn
				:ripple="null"
				variant="flat"
				height="44"
				rounded="md"
				class="px-4 bg-white bg-opacity-5 text-white"
				@click="expanded = !expanded"
			>
				<div class="opacity-50 d-flex align-center">
					<v-icon
						:icon="expanded ? 'chevron-up' : 'down'"
						class="mr-1"
						size="16"
					/>
					<span>{{ expanded ? "Свернуть все группы" : "Развернуть все группы" }}</span>
				</div>
			</v-btn>
		</div>

		<div class="d-flex align-center ga-1 flex-wrap">
			<v-btn
				variant="flat"
				color="button"
				height="44"
				rounded="md"
				class="px-4 text-white"
			>
				<v-icon
					icon="plus"
					size="16"
					class="mr-1"
				/>
				Создать группу
			</v-btn>

			<v-btn
				v-if="selectedApps.length"
				variant="flat"
				color="primary"
				height="44"
				rounded="md"
				class="px-4 text-on-primary"
			>
				<v-icon
					icon="plus"
					size="16"
					class="mr-1"
				/>
				Добавить в группу
				<v-icon
					icon="down"
					size="16"
					class="ml-1"
				/>
			</v-btn>

			<v-btn
				variant="flat"
				color="primary"
				height="44"
				rounded="md"
				class="px-4 text-on-primary"
				@click="emit('create-app')"
			>
				<v-icon
					icon="plus"
					size="16"
					class="mr-1"
				/>
				<span>Добавить приложение</span>
			</v-btn>
		</div>
	</div>
</template>

<script setup>
	const expanded = defineModel("expanded", { type: Boolean, default: true });
	const emit = defineEmits(["create-app"]);

	const props = defineProps({
		groups: {
			type: Array,
		},
		selectedApps: {
			type: Array,
			default: () => [],
		},
	});

	const totalApps = $computed(() => props.groups?.reduce((acc, curr) => acc + curr?.apps?.length, 0));
</script>
