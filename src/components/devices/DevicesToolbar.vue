<template>
	<div class="s-page-toolbar d-flex align-center justify-space-between ga-3 flex-wrap">
		<v-sheet
			color="filter"
			class="devices-toolbar__filters d-flex pa-1 overflow-x-auto"
			role="tablist"
			aria-label="Фильтр устройств"
		>
			<v-btn
				v-for="item in filters"
				:key="item.value"
				:color="filter === item.value ? 'primary' : 'transparent'"
				:aria-selected="filter === item.value"
				height="36"
				rounded="md"
				class="devices-toolbar__filter"
				role="tab"
				@click="filter = item.value"
			>
				<span :class="filter === item.value ? 'text-on-primary font-weight-semibold' : 'text-filter-label'">
					{{ item.label }}
				</span>
				<span
					:class="filter === item.value ? 'text-on-primary opacity-70' : 'text-white'"
					class="devices-toolbar__count font-weight-semibold"
				>
					{{ item.count }}
				</span>
			</v-btn>
		</v-sheet>
		<div class="d-flex align-center ga-3 flex-wrap">
			<v-btn
				prepend-icon="move"
				append-icon="down"
				height="44"
				class="px-4"
			>
				Переместить
			</v-btn>
			<v-btn
				prepend-icon="folder"
				height="44"
				class="px-4"
			>
				Новая группа
			</v-btn>
			<v-btn
				prepend-icon="folder"
				color="primary"
				height="44"
				class="px-4 text-on-primary"
			>
				Добавить устройство
			</v-btn>
		</div>
	</div>
</template>

<script setup>
	import { matchesDeviceFilter } from "@/utils/device";
	const filter = defineModel("filter", { type: String, default: "all" });
	const devicesStore = useDevicesStore();
	const filterOptions = [
		{ value: "all", label: "Все" },
		{ value: "powered", label: "Включены" },
		{ value: "session", label: "Сеансы" },
		{ value: "service", label: "Обслуживание" },
		{ value: "admin", label: "Высокий доступ" },
		{ value: "shell", label: "Без оболочки" },
	];
	const filters = $computed(() =>
		filterOptions.map((item) => ({
			...item,
			count: devicesStore.devices.filter((device) => matchesDeviceFilter(device, item.value)).length,
		}))
	);
</script>

<style scoped lang="scss">
	.devices-toolbar {
		&__filters {
			max-width: 100%;
			border-radius: 10px;
			gap: 2px;
		}
		&__filter {
			flex-shrink: 0;
			min-width: 0;
			font-weight: 500;
			padding-inline: 14px;
		}
		&__count {
			margin-inline-start: 6px;
		}
	}
</style>
