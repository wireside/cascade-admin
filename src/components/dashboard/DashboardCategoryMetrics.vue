<template>
	<div class="dashboard-card goods-grid">
		<div
			v-if="loading"
			class="dashboard-skeleton-grid dashboard-skeleton-grid--2"
		>
			<div
				v-for="item in categoryMetrics"
				:key="item.label"
				class="dashboard-skeleton-tile dashboard-skeleton-tile--metric"
			>
				<v-skeleton-loader type="heading, text" />
			</div>
		</div>

		<template v-else>
			<article
				v-for="item in categoryMetrics"
				:key="item.label"
				class="goods-grid__tile"
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
	const categoryMetrics = [
		{ label: "Товары", value: "12 080.45", icon: "mdi-store-outline" },
		{ label: "Тарифы", value: "12 080", icon: "mdi-timelapse" },
		{ label: "Услуги", value: "12 080.45", icon: "mdi-tag-outline" },
		{ label: "Траты с депозита", value: "12 080.45", icon: "mdi-wallet-plus-outline" },
	];

	let loading = $ref(true);
</script>
