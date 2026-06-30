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
			row-border
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
		{ key: "nickname", label: "Никнейм", width: { maxChars: 18 }, strong: true },
		{ key: "spent", label: "Траты", width: { maxChars: 12 } },
		{ key: "hours", label: "Всего часов", width: { maxChars: 12 } },
		{ key: "lastVisit", label: "Посл. посещение", width: { maxChars: 16 } },
	];
	const clientRows = [
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
