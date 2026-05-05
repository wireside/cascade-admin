<template>
	<article class="dashboard-card panel">
		<header class="panel__header">
			<div class="panel__title">
				<v-icon icon="mdi-finance" size="18" />
				<span>Аналитика</span>
			</div>
			<button type="button" class="panel__action"><v-icon icon="mdi-arrow-top-right" size="18" /></button>
		</header>

		<div
			v-if="loading"
			class="dashboard-skeleton-panel"
		>
			<div class="dashboard-skeleton-chart">
				<v-skeleton-loader type="image" />
			</div>
			<div class="dashboard-skeleton-list">
				<div
					v-for="series in analyticsSummary"
					:key="series.label"
					class="dashboard-skeleton-tile dashboard-skeleton-tile--row"
				>
					<v-skeleton-loader type="list-item-two-line" />
				</div>
			</div>
		</div>

		<template v-else>
			<div class="analytics-chart">
				<div class="analytics-chart__labels analytics-chart__labels--y">
					<span v-for="value in chartScale" :key="value">{{ value }}</span>
				</div>

				<div class="analytics-chart__plot">
					<div v-for="value in chartScale" :key="`line-${value}`" class="analytics-chart__line" />
					<svg viewBox="0 0 320 180" class="analytics-chart__svg" preserveAspectRatio="none">
						<polyline
							v-for="series in analyticsSeries"
							:key="series.label"
							:points="buildChartLine(series.values)"
							fill="none"
							:stroke="series.color"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<g v-for="series in analyticsSeries" :key="`${series.label}-points`">
							<circle
								v-for="(value, index) in series.values"
								:key="`${series.label}-${index}`"
								:cx="chartX(index)"
								:cy="chartY(value)"
								r="4"
								:fill="series.color"
								stroke="#090909"
								stroke-width="2"
							/>
						</g>
					</svg>

					<div class="analytics-chart__labels analytics-chart__labels--x">
						<span v-for="label in chartLabels" :key="label">{{ label }}</span>
					</div>
				</div>
			</div>

			<div class="analytics-summary">
				<div
					v-for="series in analyticsSummary"
					:key="series.label"
					class="analytics-summary__row"
				>
					<div class="analytics-summary__label">
						<span class="analytics-summary__dot" :style="{ backgroundColor: series.color }" />
						<span>{{ series.label }}</span>
					</div>
					<div class="analytics-summary__delta" :class="{ 'analytics-summary__delta--negative': series.delta.startsWith('-') }">
						{{ series.delta }}
					</div>
				</div>
			</div>
		</template>
	</article>
</template>

<script setup>
	const chartScale = [50, 40, 30, 20, 10, 0];
	const chartLabels = ["25 февр.", "26 февр.", "25 февр."];
	const analyticsSeries = [
		{ label: "Клиенты", color: "#abf43e", values: [28, 21, 20, 30, 31] },
		{ label: "Товары", color: "#257ff9", values: [39, 49, 47, 25, 19] },
		{ label: "Услуги", color: "#f39c36", values: [39, 31, 24, 29, 31] },
	];
	const analyticsSummary = [
		{ label: "Клиенты", color: "#abf43e", delta: "+ 3%" },
		{ label: "Товары", color: "#257ff9", delta: "- 20%" },
		{ label: "Услуги", color: "#f39c36", delta: "+ 3%" },
	];

	let loading = $ref(true);

	function chartX(index) {
		return analyticsSeries[0].values.length === 1 ? 0 : (index / (analyticsSeries[0].values.length - 1)) * 320;
	}

	function chartY(value) {
		return 180 - (value / 50) * 180;
	}

	function buildChartLine(values) {
		return values.map((value, index) => `${chartX(index)},${chartY(value)}`).join(" ");
	}
</script>
