<template>
	<s-dashboard-panel
		title="Статус"
		icon="sidebar"
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
					icon="arrow-right"
					size="25"
					color="white"
					class="opacity-30"
				/>
			</v-btn>
		</template>

		<div
			v-if="testStore.loading"
			class="d-flex flex-column ga-4"
		>
			<div
				v-for="item in statusItems"
				:key="item.label"
			>
				<v-skeleton-loader
					type="list-item"
					height="38"
				/>
			</div>
		</div>

		<div v-else>
			<div
				v-for="(item, index) in statusItems"
				:key="item.label"
				class="d-flex flex-column ga-4"
			>
				<div class="d-flex justify-space-between align-center">
					<div class="d-flex ga-2 align-center">
						<div
							:class="`bg-${item.color}`"
							class="pa-1 rounded-md d-flex align-center justify-center"
						>
							<s-smart-icon
								:icon="item.icon"
								size="14"
							/>
						</div>
						<span>{{ item.label }}</span>
					</div>
					<div class="">{{ item.value }}</div>
				</div>

				<v-divider
					v-if="index < statusItems.length - 1"
					class="opacity-20 mb-4"
				/>
			</div>
		</div>
	</s-dashboard-panel>
</template>

<script setup>
	const testStore = useTestStore();
	const statusItems = [
		{ label: "Устройства", value: "28", color: "secondary", icon: "sidebar" },
		{ label: "Включены", value: "27", color: "green", icon: "power" },
		{ label: "Активные сеансы", value: "10", color: "blue", icon: "user" },
		{ label: "Обслуживание", value: "2", color: "orange", icon: "warning" },
		{ label: "Высокий доступ", value: "0", color: "red", icon: "code" },
		{ label: "Без оболочки", value: "1", color: "error", icon: "warning" },
	];
</script>
