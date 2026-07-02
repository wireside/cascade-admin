<template>
	<s-dashboard-panel
		title="Ближайшие бронирования"
		icon="mdi-magnify"
		width="752"
		class="dashboard-bookings-panel"
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

		<div v-if="testStore.loading">
			<v-skeleton-loader
				type="card"
				height="287"
			/>
		</div>

		<dashboard-bookings-timeline
			v-else
			:rows="bookingRows"
			:initial-minute="currentMinute"
			@booking-click="emit('booking-click', $event)"
			@indicator-change="emit('indicator-change', $event)"
		/>
	</s-dashboard-panel>
</template>

<script setup>
	import DashboardBookingsTimeline from "./bookings/DashboardBookingsTimeline.vue";

	const testStore = useTestStore();
	const emit = defineEmits(["booking-click", "indicator-change"]);

	const now = new Date();
	const currentMinute = now.getHours() * 60 + now.getMinutes();

	function normalizeMinute(value) {
		const minutesInDay = 24 * 60;

		return ((value % minutesInDay) + minutesInDay) % minutesInDay;
	}

	function formatTime(value) {
		const minutes = normalizeMinute(value);
		const hours = Math.floor(minutes / 60);
		const rest = minutes % 60;

		return `${hours}:${String(rest).padStart(2, "0")}`;
	}

	function createBooking(label, startOffset, endOffset, options = {}) {
		const start = currentMinute + startOffset;
		const end = currentMinute + endOffset;

		return {
			label,
			start,
			end,
			time: `${formatTime(start)} - ${formatTime(end)}`,
			...options,
		};
	}

	const bookingRows = computed(() => [
		{
			name: "Компьютер 1",
			subtitle: "Общий зал",
			bookings: [createBooking("pappy", -60, 120)],
		},
		{
			name: "Компьютер 2",
			subtitle: "Общий зал",
			bookings: [createBooking("french", 0, 60)],
		},
		{
			name: "Компьютер 3",
			subtitle: "Общий зал",
			bookings: [createBooking("wii337", 45, 180, { muted: true })],
		},
		{
			name: "Компьютер 4",
			subtitle: "Общий зал",
			bookings: [createBooking("asim2002", -30, 150)],
		},
	]);
</script>

<style lang="scss">
	.dashboard-bookings-panel {
		width: 100% !important;
		max-width: 100%;
		min-width: 0 !important;
		overflow: hidden;

		@media (min-width: 1920px) {
			max-width: 752px;
		}
	}
</style>
