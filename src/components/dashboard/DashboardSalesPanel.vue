<template>
	<s-dashboard-panel
		title="Продажи"
		icon="mdi-history"
	>
		<template #header-action>
			<v-btn-toggle
				v-model="activeSalesTab"
				class="rounded-md h-100 pa-1 bg-white bg-opacity-5 d-flex ga-1 text-white"
				mandatory
				selected-class="bg-primary"
				color="black"
			>
				<v-btn
					v-for="tab in salesTabs"
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
			:columns="salesColumnsConfig"
			:rows="salesRows"
			:loading="loading"
			table-height="312"
		/>
	</s-dashboard-panel>
</template>

<script setup>
	const testStore = useTestStore();

	let activeSalesTab = $ref("Товары");

	const loading = $computed(() => testStore.loading);

	const salesTabs = ["Товары", "Тарифы", "Услуги"];

	const salesColumnsConfig = [
		{ key: "name", label: "Никнейм", width: { maxChars: 22 }, strong: true },
		{ key: "quantity", label: "Количество", width: { maxChars: 10 } },
		{ key: "amount", label: "Стоимость", width: { maxChars: 10 } },
	];
	const salesRows = [
		{ name: "Monster Rio Punch", quantity: "3", amount: "375 ₽" },
		{ name: "Adrenaline Extra 0,449", quantity: "2", amount: "205 ₽" },
		{ name: "Салат Куриный BBQ", quantity: "1", amount: "310 ₽" },
		{ name: "Рис с курицей и овощами", quantity: "1", amount: "380 ₽" },
		{ name: "Рис с курицей и овощами", quantity: "1", amount: "380 ₽" },
	];
</script>

<style scoped lang="scss">
	.s-dashboard-panel {
		padding-bottom: 0 !important;
	}
</style>
