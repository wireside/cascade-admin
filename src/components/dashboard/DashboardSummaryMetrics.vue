<template>
	<s-dashboard-panel width="522">
		<v-row
			v-if="testStore.loading"
			gap="10px"
		>
			<v-col
				v-for="item in summaryMetrics"
				:key="item.label"
				cols="12"
				md="6"
			>
				<v-skeleton-loader
					type="heading"
					height="72"
				/>
			</v-col>
		</v-row>

		<v-row
			v-else
			gap="10px"
		>
			<v-col
				v-for="item in summaryMetrics"
				cols="6"
				xl="6"
				:key="item.label"
			>
				<s-finance-tile v-bind="item" />
			</v-col>
		</v-row>
	</s-dashboard-panel>
</template>

<script setup>
	const testStore = useTestStore();

	const summaryMetrics = [
		{ label: "Выручка", value: "12 080.45", tone: "deep-purple", icon: "mdi:cash-register" },
		{ label: "Наличные", value: "12 080.45", tone: "primary", icon: "mdi:cash", badge: "70%", badgeTone: "primary" },
		{
			label: "Онлайн пополнения",
			value: "12 080.45",
			tone: "orange",
			icon: "mdi:line-scan",
			badge: "30%",
			badgeTone: "orange",
		},
		{
			label: "Карта",
			value: "12 080.45",
			tone: "blue",
			icon: "mdi:credit-card-outline",
			badge: "30%",
			badgeTone: "blue",
		},
	];
</script>
