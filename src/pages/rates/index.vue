<template>
	<div class="d-flex flex-column">
		<rates-toolbar v-model="activeView" />

		<template v-if="activeView === 'calendar'">
			<rates-day-types-panel
				v-model="selectedDayTypes"
				:year="calendarYear"
			/>

			<rates-year-calendar v-model:year="calendarYear" />
		</template>
	</div>
</template>

<script setup>
	let activeView = $ref("calendar");
	let selectedDayTypes = $ref([]);
	let calendarYear = $ref(new Date().getFullYear());
</script>

<route lang="yaml">
meta:
  layout: default
  title: Тарифы
  icon: mdi-controller
</route>
