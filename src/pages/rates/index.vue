<template>
	<div class="d-flex flex-column">
		<rates-toolbar
			v-model="activeView"
			@add-type="addDayType"
		/>

		<template v-if="activeView === 'calendar'">
			<rates-day-types-panel
				v-model="selectedDayType"
				:year="calendarYear"
			/>

			<rates-year-calendar
				v-model:year="calendarYear"
				@day-click="toggleSelectedDayType"
			/>
		</template>
	</div>
</template>

<script setup>
	import { useDayTypesStore } from "@/store/dayTypes";

	const dayTypesStore = useDayTypesStore();

	let activeView = $ref("calendar");
	let selectedDayType = $ref(null);
	let calendarYear = $ref(new Date().getFullYear());

	const addDayType = () => {
		dayTypesStore.addDayType({
			name: "Без названия",
			color: "#8D5CFC",
			discount: 0,
			schedule: {
				weekdays: [],
				dates: [],
			},
		});
	};

	const toggleSelectedDayType = ({ date }) => {
		if (!selectedDayType) {
			return;
		}

		dayTypesStore.toggleDayTypeForDate(selectedDayType, date);
	};
</script>

<route lang="yaml">
meta:
  layout: default
  title: Тарифы
  icon: mdi-controller
</route>
