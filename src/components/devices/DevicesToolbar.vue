<template>
	<div class="d-flex align-center justify-space-between ga-4 flex-wrap">
		<div class="d-flex align-center ga-1 flex-wrap">
			<v-btn
				variant="flat"
				height="40"
				rounded="md"
				class="px-4 bg-white bg-opacity-5 text-white mr-2"
			>
				<v-icon
					icon="mdi-desktop-tower-monitor"
					size="16"
					class="mr-2"
				/>
				<span>Устройства</span>
				<s-badge
					:label="totalDevices"
					tone="primary"
					class="ml-2"
					bg-opacity="20"
				/>
			</v-btn>

			<v-btn
				v-for="metric in metrics"
				:key="metric.label"
				variant="flat"
				:color="metric.tone"
				height="23"
				rounded="md"
				class="px-2 text-background devices-toolbar__metric"
			>
				<v-icon
					:icon="metric.icon"
					size="14"
					class="mr-1"
				/>
				<span>{{ metric.label }}</span>
				<span class="font-weight-bold ml-1">{{ metric.value }}</span>
			</v-btn>
		</div>

		<div class="d-flex align-center ga-1 flex-wrap">
			<v-btn
				variant="flat"
				color="primary"
				height="40"
				rounded="md"
				class="px-4 bg-opacity-20 text-primary"
			>
				<v-icon
					icon="mdi-arrow-top-right"
					size="16"
					class="mr-1"
				/>
				Переместить
				<v-icon
					icon="mdi-chevron-down"
					size="16"
					class="ml-1"
				/>
			</v-btn>

			<v-btn
				:variant="null"
				color="white"
				height="40"
				rounded="md"
				class="px-4 bg-white bg-opacity-20 text-white"
			>
				<div class="opacity-50 d-flex align-center">
					<v-icon
						icon="mdi-plus-circle-outline"
						size="16"
						class="mr-1"
					/>
					<span>Добавить устройство</span>
				</div>
			</v-btn>

			<v-btn
				variant="flat"
				color="blue"
				height="40"
				rounded="md"
				class="px-4 bg-opacity-20 text-blue"
			>
				<v-icon
					icon="mdi-plus-circle-outline"
					size="16"
					class="mr-1"
				/>
				Создать группу
			</v-btn>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		sections: {
			type: Array,
			default: () => [],
		},
	});

	const totalDevices = computed(() => {
		const total = props.sections.reduce((sum, section) => sum + (section.rows?.length || 0), 0);
		return Math.max(total, 15);
	});

	const metrics = [
		{ label: "Включены", value: 15, tone: "green", icon: "mdi-power" },
		{ label: "Активные сеансы", value: 3, tone: "blue", icon: "mdi-account-group-outline" },
		{ label: "Обслуживание", value: 1, tone: "orange", icon: "mdi-alert-rhombus-outline" },
		{ label: "Высокий доступ", value: 2, tone: "red", icon: "mdi-code-tags" },
		{ label: "Без оболочки", value: 4, tone: "error", icon: "mdi-controller-classic-outline" },
	];
</script>

<style scoped lang="scss">
	.devices-toolbar__metric {
		font-size: 12px;
	}
</style>
