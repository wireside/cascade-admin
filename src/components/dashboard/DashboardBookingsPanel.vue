<template>
	<article class="dashboard-card panel">
		<header class="panel__header">
			<div class="panel__title">
				<v-icon icon="mdi-magnify" size="18" />
				<span>Ближайшие бронирования</span>
			</div>
			<button type="button" class="panel__action"><v-icon icon="mdi-arrow-top-right" size="18" /></button>
		</header>

		<div
			v-if="loading"
			class="dashboard-skeleton-booking"
		>
			<v-skeleton-loader type="image" />
		</div>

		<div
			v-else
			class="booking-board"
		>
			<div class="booking-board__rooms">
				<div
					v-for="room in bookingRows"
					:key="room.name"
					class="booking-board__room"
				>
					<div class="booking-board__room-name">{{ room.name }}</div>
					<div class="booking-board__room-subtitle">{{ room.subtitle }}</div>
				</div>
			</div>

			<div class="booking-board__timeline">
				<div class="booking-board__times">
					<span v-for="slot in bookingTimeline" :key="slot">{{ slot }}</span>
				</div>

				<div class="booking-board__tracks">
					<div class="booking-board__indicator" />
					<div
						v-for="room in bookingRows"
						:key="`${room.name}-track`"
						class="booking-board__track"
					>
						<div
							v-for="item in room.bookings"
							:key="`${room.name}-${item.label}`"
							class="booking-board__booking"
							:class="{ 'booking-board__booking--muted': item.muted }"
							:style="bookingStyle(item)"
						>
							<div class="booking-board__booking-name">{{ item.label }}</div>
							<div class="booking-board__booking-time">{{ item.time }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup>
	const bookingTimeline = ["0:00", "0:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00"];
	const bookingRows = [
		{ name: "Компьютер 1", subtitle: "Общий зал", bookings: [{ label: "pappy", time: "0:30 - 3:30", start: 30, end: 210 }] },
		{ name: "Компьютер 2", subtitle: "Общий зал", bookings: [{ label: "french", time: "0:00 - 3:30", start: 0, end: 210 }] },
		{ name: "Компьютер 3", subtitle: "Общий зал", bookings: [{ label: "wii337", time: "1:00 - 4:00", start: 60, end: 240, muted: true }] },
		{ name: "Компьютер 4", subtitle: "Общий зал", bookings: [{ label: "asim2002", time: "0:30 - 3:30", start: 30, end: 210 }] },
	];

	let loading = $ref(true);

	function bookingStyle(item) {
		return { left: `${(item.start / 240) * 100}%`, width: `${((item.end - item.start) / 240) * 100}%` };
	}
</script>
