<template>
	<s-dashboard-panel
		title="Активные клиенты"
		icon="mdi-lightning-bolt-outline"
		width="752"
	>
		<template #header-action>
			<v-btn-toggle
				v-model="activeClientTab"
				class="rounded-md h-100 pa-1 bg-white bg-opacity-5 d-flex ga-1 text-white"
				mandatory
				selected-class="bg-primary"
				color="black"
			>
				<v-btn
					v-for="tab in clientTabs"
					:key="tab"
					:value="tab"
					:ripple="null"
					height="28"
					class="rounded-md"
					variant="plain"
				>
					{{ tab }}
				</v-btn>
			</v-btn-toggle>
		</template>

		<s-data-table
			:columns="clientColumns"
			:rows="clientRows"
			:loading="loading"
			table-height="312"
		/>
	</s-dashboard-panel>
</template>

<script setup>
	const testStore = useTestStore();

	let activeClientTab = $ref("День");

	const loading = computed(() => testStore.loading);

	const clientTabs = ["День", "Неделя"];
	const clientColumns = [
		{ key: "nickname", label: "Никнейм", flex: 2, strong: true },
		{ key: "spent", label: "Траты", flex: 1 },
		{ key: "hours", label: "Всего часов", flex: 1 },
		{ key: "lastVisit", label: "Посл. посещение", flex: 1 },
	];
	const clientRows = [
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
	];
</script>

<style scoped lang="scss">
	.s-dashboard-panel {
		padding-bottom: 0;
	}
</style>
