<template>
	<section class="rates-year-calendar bg-white bg-opacity-2 pa-5">
		<div
			role="heading"
			aria-level="2"
			class="mb-4 text-body-2 text-white font-weight-medium"
		>
			Календарь дней
		</div>

		<v-row
			no-gutters
			class="ga-2"
		>
			<v-col
				v-for="month in months"
				:key="`${year}-${month}`"
				cols="auto"
			>
				<rates-month-calendar
					:year="year"
					:month="month"
					show-year-controls
					@previous-year="year -= 1"
					@next-year="year += 1"
					@day-click="emit('day-click', $event)"
				/>
			</v-col>
		</v-row>
	</section>
</template>

<script setup>
	import { useDayTypesStore } from "@/store/dayTypes";

	const year = defineModel("year", {
		type: Number,
		default: () => new Date().getFullYear(),
	});
	const emit = defineEmits(["day-click"]);
	const dayTypesStore = useDayTypesStore();
	const months = Array.from({ length: 12 }, (_, month) => month);

	onMounted(() => {
		dayTypesStore.initializeDayTypes().catch(() => {});
	});
</script>

<style lang="scss" scoped>
	.rates-year-calendar {
		border-radius: 10px;
	}
</style>
