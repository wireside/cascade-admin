<template>
	<s-dashboard-panel width="486">
		<v-row
			v-if="testStore.loading"
			gap="10px"
		>
			<v-col
				v-for="item in categoryMetrics"
				cols="12"
				md="6"
				:key="item.label"
			>
				<v-skeleton-loader
					type="heading"
					height="72"
				/>
			</v-col>
		</v-row>

		<v-row
			v-else
			gap="15px"
			class="gr-3"
		>
			<v-col
				v-for="item in categoryMetrics"
				cols="6"
				:key="item.label"
			>
				<s-finance-tile
					v-bind="item"
					tone="white"
				/>
			</v-col>
		</v-row>
	</s-dashboard-panel>
</template>

<script setup>
	const categoryMetrics = [
		{ label: "Товары", value: "12 080.45", icon: "shopping-bag-open" },
		{ label: "Тарифы", value: "12 080", icon: "clock" },
		{ label: "Услуги", value: "12 080.45", icon: "tag" },
		{ label: "Траты с депозита", value: "12 080.45", icon: "wallet" },
	];

	const testStore = useTestStore();
</script>
