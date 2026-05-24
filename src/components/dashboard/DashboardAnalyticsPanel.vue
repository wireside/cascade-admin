<template>
	<s-dashboard-panel
		title="Аналитика"
		icon="mdi-finance"
		class="analitycs-panel"
		width="368"
	>
		<template #header-action>
			<v-btn
				icon
				variant="tonal"
				color="transparent"
				width="36"
				height="36"
				rounded
				density="comfortable"
				class="bg-opacity-5 bg-white"
			>
				<v-icon
					icon="mdi-arrow-top-right"
					size="25"
					color="white"
					class="opacity-30"
				/>
			</v-btn>
		</template>

		<div
			v-if="testStore.loading"
			class="d-flex flex-column"
		>
			<v-skeleton-loader
				type="image"
				height="168"
			/>
			<div class="d-flex flex-column ga-4">
				<div
					v-for="series in analyticsSummary"
					:key="series.label"
					class="py-1"
				>
					<v-skeleton-loader
						type="list-item"
						height="35"
					/>
				</div>
			</div>
		</div>

		<div
			v-else
			class="d-flex flex-column ga-3 w-100"
		>
			<div class="w-100">
				<VChart
					class="w-100"
					:option="chartOptions"
					style="width: 314px; height: 168px"
					autoresize
				/>
			</div>

			<div>
				<template
					v-for="(series, index) in analyticsSummary"
					:key="series.label"
				>
					<div class="d-flex flex-column ga-3">
						<div class="d-flex align-center justify-space-between">
							<div class="d-inline-flex align-center ga-3">
								<v-avatar
									:color="series.color"
									size="8"
								/>
								<span class="analitycs-panel__label font-weight-regular">{{ series.label }}</span>
							</div>
							<div
								:class="series.delta.startsWith('-') ? 'bg-error text-error' : 'bg-primary text-primary'"
								class="font-weight-bold bg-opacity-30 py-1 px-3 rounded-sm"
							>
								<span>{{ series.delta }}</span>
							</div>
						</div>

						<v-divider
							v-if="index < analyticsSummary.length - 1"
							class="opacity-20 mb-4"
						/>
					</div>
				</template>
			</div>
		</div>
	</s-dashboard-panel>
</template>

<script setup>
	import { computed } from "vue";
	import VChart from "vue-echarts";
	import { LineChart } from "echarts/charts";
	import {
		GridComponent,
		TooltipComponent,
		LegendComponent,
		TitleComponent,
		MarkPointComponent,
		MarkLineComponent,
	} from "echarts/components";
	import { CanvasRenderer } from "echarts/renderers";
	import { use } from "echarts/core";

	use([
		LineChart,
		GridComponent,
		TooltipComponent,
		LegendComponent,
		TitleComponent,
		MarkPointComponent,
		MarkLineComponent,
		CanvasRenderer,
	]);

	const testStore = useTestStore();
	const analyticsSeries = [
		{ label: "Клиенты", color: "#abf43e", values: [28, 20, 33] },
		{ label: "Товары", color: "#257ff9", values: [40, 49, 18] },
		{ label: "Услуги", color: "#f39c36", values: [24, 30, 26] },
	];
	const analyticsSummary = [
		{ label: "Клиенты", color: "#abf43e", delta: "+ 3%" },
		{ label: "Товары", color: "#257ff9", delta: "- 20%" },
		{ label: "Услуги", color: "#f39c36", delta: "+ 3%" },
	];
	const chartLabels = ["25 февр.", "26 февр.", "25 февр."];
	const minY = 0;
	const maxY = 50;

	const chartOptions = computed(() => ({
		backgroundColor: "transparent",
		grid: {
			left: 0,
			right: 4,
			top: 0,
			bottom: 0,
		},
		tooltip: {
			show: true,
			trigger: "axis",
			axisPointer: {
				type: "line",
				lineStyle: {
					color: "rgba(255, 255, 255, 0.2)",
					width: 1,
				},
			},
			backgroundColor: "rgba(9, 9, 9, 0.95)",
			borderColor: "rgba(255, 255, 255, 0.12)",
			textStyle: {
				color: "#ffffff",
			},
		},
		xAxis: {
			type: "category",
			data: chartLabels,
			axisTick: { show: false },
			axisLine: {
				show: true,
				lineStyle: {
					color: "rgba(255, 255, 255, 0.4)",
					width: 1,
				},
			},
			axisLabel: {
				show: true,
				margin: 8,
				color: "rgba(255, 255, 255, 0.4)",
				fontSize: 12,
				formatter: (value, idx) => {
					if (idx === 0) return `{start|${value}}`;
					if (idx === chartLabels.length - 1) return `{end|${value}}`;
					return value;
				},
				rich: {
					start: {
						padding: [0, 0, 0, 46],
						fontSize: 12,
						color: "rgba(255, 255, 255, 0.4)",
					},
					end: {
						padding: [0, 48, 0, 0],
						fontSize: 12,
						color: "rgba(255, 255, 255, 0.4)",
					},
				},
			},
			splitLine: { show: false },
			boundaryGap: false,
		},
		yAxis: {
			type: "value",
			min: minY,
			max: maxY,
			splitNumber: 5,
			axisTick: { show: false },
			axisLine: {
				show: true,
				lineStyle: {
					color: "rgba(255, 255, 255, 0.4)",
					width: 1,
				},
			},
			axisLabel: {
				show: true,
				margin: 8,
				color: "rgba(255, 255, 255, 0.4)",
				fontSize: 12,
				formatter: (value) => {
					if (value === minY) return `{bottom|${value}}`;
					if (value === maxY) return `{top|${value}}`;
					return value;
				},
				rich: {
					bottom: {
						padding: [0, 0, 10, 0],
						fontSize: 12,
						color: "rgba(255, 255, 255, 0.4)",
					},
					top: {
						padding: [9, 0, 0, 0],
						fontSize: 12,
						color: "rgba(255, 255, 255, 0.4)",
					},
				},
			},
			splitLine: { show: false },
		},
		series: analyticsSeries.map((series) => ({
			name: series.label,
			type: "line",
			data: series.values,
			smooth: true,
			symbol: "circle",
			symbolSize: 8,
			showSymbol: true,
			connectNulls: true,
			lineStyle: {
				color: series.color,
				width: 2,
				type: "dashed",
			},
			itemStyle: {
				color: series.color,
				borderColor: "#090909",
				borderWidth: 3,
			},
			emphasis: { disabled: true },
		})),
		color: analyticsSeries.map((series) => series.color),
		legend: { show: false },
		animation: false,
	}));
</script>

<style lang="scss">
	.analitycs-panel {
		padding-bottom: 22px;

		&__label {
			font-size: 16px;
			line-height: 100%;
		}
	}
</style>
