<template>
	<article class="dashboard-card panel">
		<header class="panel__header">
			<div class="panel__title">
				<v-icon icon="mdi-monitor" size="18" />
				<span>Статус</span>
			</div>
			<button type="button" class="panel__action"><v-icon icon="mdi-arrow-top-right" size="18" /></button>
		</header>

		<div
			v-if="loading"
			class="dashboard-skeleton-list"
		>
			<div
				v-for="item in statusItems"
				:key="item.label"
				class="dashboard-skeleton-tile dashboard-skeleton-tile--row"
			>
				<v-skeleton-loader type="list-item-avatar-two-line" />
			</div>
		</div>

		<div
			v-else
			class="status-list"
		>
			<div
				v-for="item in statusItems"
				:key="item.label"
				class="status-list__row"
			>
				<div class="status-list__label">
					<span class="status-list__icon" :style="{ backgroundColor: item.color }">
						<v-icon :icon="item.icon" size="13" />
					</span>
					<span>{{ item.label }}</span>
				</div>
				<div class="status-list__value">{{ item.value }}</div>
			</div>
		</div>
	</article>
</template>

<script setup>
	const statusItems = [
		{ label: "Устройства", value: "28", color: "rgba(255, 255, 255, 0.2)", icon: "mdi-monitor" },
		{ label: "Включены", value: "27", color: "#0ca157", icon: "mdi-power" },
		{ label: "Активные сеансы", value: "10", color: "#257ff9", icon: "mdi-account" },
		{ label: "Обслуживание", value: "2", color: "#f37d1d", icon: "mdi-traffic-cone" },
		{ label: "Высокий доступ", value: "0", color: "#de3e3d", icon: "mdi-code-tags" },
		{ label: "Без оболочки", value: "1", color: "#af2e2d", icon: "mdi-alert-circle-outline" },
	];

	let loading = $ref(true);
</script>
