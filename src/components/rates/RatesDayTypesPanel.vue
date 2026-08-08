<template>
	<section class="rates-day-types-panel bg-white bg-opacity-2 pa-5 pt-4 mb-2">
		<h2 class="rates-day-types-panel__title text-white font-weight-medium ma-0">Типы дней</h2>

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
					@toggle-weekday="toggleWeekday"
					@rename="renameDayType"
					@open-menu="openDayTypeMenu"
					@delete="deleteDayType"
				/>
			</template>

			<div
				v-else
				class="rates-day-types-panel__message d-flex align-center justify-center text-white opacity-50"
			>
				Типы дней пока не добавлены
			</div>
		</div>
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

	const selectedDayType = defineModel({ type: Object, default: null });
	const emit = defineEmits(["selection-change", "edit-day-type", "open-day-type-menu", "delete-day-type"]);

	const dayTypesStore = useDayTypesStore();

	const dayTypes = $computed(() => dayTypesStore.dayTypes);
	const loading = $computed(() => dayTypesStore.loading);
	const initialized = $computed(() => dayTypesStore.initialized);
	const error = $computed(() => dayTypesStore.error);

	const isSelected = (dayType) => {
		return selectedDayType.value?.id === dayType.id;
	};

	const toggleSelection = (dayType) => {
		selectedDayType.value = isSelected(dayType) ? null : dayType;

		emit("selection-change", selectedDayType.value);
	};

	const getDaysCount = (dayType) => dayTypesStore.getDaysCountForYear(dayType, props.year);
	const toggleWeekday = (dayType, weekday) => dayTypesStore.toggleDayTypeWeekday(dayType, weekday);
	const renameDayType = (dayType, name) => {
		const updatedDayType = dayTypesStore.updateDayType(dayType.id, { name });

		if (isSelected(dayType)) {
			selectedDayType.value = updatedDayType;
			emit("selection-change", updatedDayType);
		}
	};
	const deleteDayType = (dayType) => {
		const wasSelected = isSelected(dayType);
		const removed = dayTypesStore.removeDayType(dayType.id);

		if (!removed) {
			return;
		}

		if (wasSelected) {
			selectedDayType.value = null;
			emit("selection-change", null);
		}

		emit("delete-day-type", dayType);
	};

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
