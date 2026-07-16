<template>
	<div class="d-flex align-center justify-space-between ga-4 flex-wrap">
		<div class="d-flex align-center ga-1 flex-wrap">
			<v-btn
				variant="flat"
				height="40"
				rounded="md"
				class="px-4 bg-white bg-opacity-5 text-white"
			>
				<v-icon
					icon="mdi-view-grid-outline"
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
				height="40"
				rounded="md"
				class="px-4 bg-white bg-opacity-5 text-white"
				@click="expanded = !expanded"
			>
				<div class="opacity-50 d-flex align-center">
					<v-icon
						:icon="expanded ? 'mdi-chevron-up-circle-outline' : 'mdi-chevron-down-circle-outline'"
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
				color="blue"
				height="40"
				rounded="md"
				class="px-4 bg-opacity-20 text-blue"
			>
				<v-icon
					icon="mdi-plus-circle-outline"
					size="16"
					class="mr-1"
				/>
				Создать группу
			</v-btn>

			<v-btn
				v-if="selectedApps.length"
				variant="flat"
				color="primary"
				height="40"
				rounded="md"
				class="px-4 bg-opacity-20 text-primary"
			>
				<v-icon
					icon="mdi-plus-circle-outline"
					size="16"
					class="mr-1"
				/>
				Добавить в группу
				<v-icon
					icon="mdi-chevron-down"
					size="16"
					class="ml-1"
				/>
			</v-btn>

			<v-btn
				variant="flat"
				color="primary"
				height="40"
				rounded="md"
				class="px-4 bg-opacity-20 text-primary"
			>
				<v-icon
					icon="mdi-plus-circle-outline"
					color="primary"
					size="16"
					class="mr-1"
				/>
				<span class="text-primary">Добавить приложение</span>
			</v-btn>
		</div>
	</div>
</template>

<script setup>
	const expanded = defineModel("expanded", { type: Boolean, default: true });

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
