<template>
	<section class="rates-day-types-panel bg-white bg-opacity-2 pa-5 pt-2 mb-2">
		<header class="d-flex align-center justify-space-between">
			<h2 class="rates-day-types-panel__title text-white font-weight-medium ma-0">Типы дней</h2>

			<v-btn
				:aria-label="expanded ? 'Свернуть список типов дней' : 'Развернуть список типов дней'"
				:aria-expanded="expanded"
				icon
				color="white"
				size="34"
				rounded="md"
				variant="flat"
				class="bg-white bg-opacity-5 text-white"
				@click="expanded = !expanded"
			>
				<v-icon
					:icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
					size="16"
					class="opacity-50"
				/>
			</v-btn>
		</header>

		<s-collapse :expanded="expanded">
			<div class="rates-day-types-panel__list d-flex flex-column ga-2 pt-2">
				<template v-if="loading || !initialized">
					<v-skeleton-loader
						v-for="index in 3"
						:key="index"
						type="list-item"
						height="48"
						class="rounded-md overflow-hidden"
					/>
				</template>

				<div
					v-else-if="error"
					class="rates-day-types-panel__message d-flex align-center justify-center text-error"
				>
					Не удалось загрузить типы дней
				</div>

				<template v-else-if="dayTypes.length">
					<rates-day-type-row
						v-for="dayType in dayTypes"
						:key="dayType.id"
						:day-type="dayType"
						:days-count="getDaysCount(dayType)"
						:selected="isSelected(dayType)"
						@toggle-selection="toggleSelection"
						@edit="emit('edit-day-type', $event)"
						@open-menu="openDayTypeMenu"
						@delete="emit('delete-day-type', $event)"
					/>
				</template>

				<div
					v-else
					class="rates-day-types-panel__message d-flex align-center justify-center text-white opacity-50"
				>
					Типы дней пока не добавлены
				</div>
			</div>
		</s-collapse>
	</section>
</template>

<script setup>
	import { useDayTypesStore } from "@/store/dayTypes";

	const props = defineProps({
		year: {
			type: Number,
			default: () => new Date().getFullYear(),
		},
	});

	const selectedDayTypes = defineModel({ type: Array, default: () => [] });
	const expanded = defineModel("expanded", { type: Boolean, default: true });
	const emit = defineEmits(["selection-change", "edit-day-type", "open-day-type-menu", "delete-day-type"]);

	const dayTypesStore = useDayTypesStore();

	const dayTypes = $computed(() => dayTypesStore.dayTypes);
	const loading = $computed(() => dayTypesStore.loading);
	const initialized = $computed(() => dayTypesStore.initialized);
	const error = $computed(() => dayTypesStore.error);

	const isSelected = (dayType) => {
		return selectedDayTypes.value.some(({ id }) => id === dayType.id);
	};

	const toggleSelection = (dayType) => {
		selectedDayTypes.value = isSelected(dayType)
			? selectedDayTypes.value.filter(({ id }) => id !== dayType.id)
			: [...selectedDayTypes.value, dayType];

		emit("selection-change", selectedDayTypes.value);
	};

	const getDaysCount = (dayType) => dayTypesStore.getDaysCountForYear(dayType, props.year);

	const openDayTypeMenu = (dayType, event) => {
		emit("open-day-type-menu", { dayType, event });
	};

	onMounted(() => {
		dayTypesStore.initializeDayTypes().catch(() => {});
	});
</script>

<style scoped lang="scss">
	.rates-day-types-panel {
		border-radius: 10px;

		&__title {
			font-size: 14px;
			line-height: 125%;
		}

		&__message {
			min-height: 48px;
		}
	}
</style>
