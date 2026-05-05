<template>
	<div class="dashboard-card summary-stack">
		<div
			v-if="loading"
			class="dashboard-skeleton-grid dashboard-skeleton-grid--2"
		>
			<div
				v-for="item in summaryMetrics"
				:key="item.label"
				class="dashboard-skeleton-tile dashboard-skeleton-tile--metric"
			>
				<v-skeleton-loader type="heading, text" />
			</div>
		</div>

		<div
			v-else
			class="summary-stack__grid"
		>
			<article
				v-for="item in summaryMetrics"
				:key="item.label"
				class="metric-tile"
				:class="`metric-tile--${item.tone}`"
			>
				<div class="metric-tile__meta">
					<div class="metric-tile__label">
						<v-icon :icon="item.icon" size="14" />
						<span>{{ item.label }}</span>
					</div>
					<span
						v-if="item.badge"
						class="metric-tile__badge"
						:class="`metric-tile__badge--${item.badgeTone || item.tone}`"
					>
						{{ item.badge }}
					</span>
				</div>
				<div class="metric-tile__value"><span class="metric-tile__currency">₽</span>{{ item.value }}</div>
			</article>
		</div>
	</div>
</template>

<script setup>
	const summaryMetrics = [
		{ label: "Выручка", value: "12 080.45", tone: "violet", icon: "mdi-wallet-outline" },
		{ label: "Наличные", value: "12 080.45", tone: "lime", icon: "mdi-cash-multiple", badge: "70%" },
		{ label: "Онлайн пополнения", value: "12 080.45", tone: "orange", icon: "mdi-cellphone-nfc", badge: "30%", badgeTone: "orange" },
		{ label: "Карта", value: "12 080.45", tone: "blue", icon: "mdi-credit-card-outline", badge: "30%", badgeTone: "blue" },
	];

	let loading = $ref(true);
</script>
