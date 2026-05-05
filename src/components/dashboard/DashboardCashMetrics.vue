<template>
	<div class="dashboard-card finance-stack">
		<template v-if="loading">
			<div
				v-for="item in cashMetrics"
				:key="item.label"
				class="dashboard-skeleton-tile dashboard-skeleton-tile--metric"
			>
				<v-skeleton-loader type="heading, text" />
			</div>
		</template>

		<template v-else>
			<article
				v-for="item in cashMetrics"
				:key="item.label"
				class="finance-stack__tile"
			>
				<div class="metric-tile__label">
					<v-icon :icon="item.icon" size="14" />
					<span>{{ item.label }}</span>
				</div>
				<div class="metric-tile__value"><span class="metric-tile__currency">₽</span>{{ item.value }}</div>
			</article>
		</template>
	</div>
</template>

<script setup>
	const cashMetrics = [
		{ label: "Наличных в кассе", value: "100 614", icon: "mdi-cash" },
		{ label: "На начало смены", value: "96 584", icon: "mdi-cash-refund" },
	];

	let loading = $ref(true);
</script>
