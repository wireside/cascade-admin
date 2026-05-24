<template>
	<s-dashboard-panel width="259">
		<template v-if="testStore.loading">
			<v-row gap="10px">
				<v-col
					v-for="item in cashMetrics"
					:key="item.label"
					cols="12"
				>
					<v-skeleton-loader
						type="heading"
						height="72"
					/>
				</v-col>
			</v-row>
		</template>

		<template v-else>
			<v-row gap="10px">
				<v-col
					v-for="item in cashMetrics"
					:key="item.label"
					cols="12"
				>
					<s-finance-tile v-bind="item" />
				</v-col>
			</v-row>
		</template>
	</s-dashboard-panel>
</template>

<script setup>
	const cashMetrics = [
		{ label: "Наличных в кассе", value: "100 614", icon: "mdi:cash", tone: "primary" },
		{ label: "На начало смены", value: "96 584", icon: "mdi:cash-sync", tone: "primary" },
	];

	const testStore = useTestStore();
</script>
