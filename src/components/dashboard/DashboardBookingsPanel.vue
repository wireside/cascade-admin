<template>
	<s-dashboard-panel
		title="Ближайшие бронирования"
		icon="mdi-magnify"
		width="752"
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

		<div
			v-else
			class="booking-board d-flex overflow-hidden bg-white bg-opacity-3 rounded-lg"
		>
			<div class="booking-board__rooms d-lg-flex d-none flex-column justify-end pl-5 pb-5 bg-primary bg-opacity-20">
				<div
					v-for="room in bookingRows"
					:key="room.name"
					class="text-white"
				>
					<div class="booking-board__device">{{ room.name }}</div>
					<div class="booking-board__room opacity-70">{{ room.subtitle }}</div>
				</div>
			</div>

			<div class="booking-board__timeline flex-grow-1">
				<div class="booking-board__times mb-3 d-flex justify-space-between text-white opacity-60">
					<span
						v-for="slot in bookingTimeline"
						:key="slot"
					>
						{{ slot }}
					</span>
				</div>

				<div class="mb-3">
					<svg
						width="505"
						height="15"
						viewBox="0 0 505 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							width="1"
							height="15"
							fill="#D9D9D9"
						/>
						<rect
							x="58"
							width="1"
							height="10"
							fill="#D9D9D9"
						/>
						<rect
							x="29"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="15"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="44"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="86"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="72"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="101"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="142"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="128"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="157"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="199"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="185"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="214"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="256"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="242"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="271"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="314"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="300"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="329"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="372"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="358"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="387"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="430"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="416"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="445"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="430"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="416"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="445"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="489"
							width="1"
							height="8"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="475"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="504"
							width="1"
							height="4"
							fill="#D9D9D9"
							fill-opacity="0.4"
						/>
						<rect
							x="171"
							width="1"
							height="10"
							fill="#D9D9D9"
						/>
						<rect
							x="286"
							width="1"
							height="10"
							fill="#D9D9D9"
						/>
						<rect
							x="402"
							width="1"
							height="10"
							fill="#D9D9D9"
						/>
						<rect
							x="115"
							width="1"
							height="15"
							fill="#D9D9D9"
						/>
						<rect
							x="228"
							width="1"
							height="15"
							fill="#D9D9D9"
						/>
						<rect
							x="344"
							width="1"
							height="15"
							fill="#D9D9D9"
						/>
						<rect
							x="460"
							width="1"
							height="15"
							fill="#D9D9D9"
						/>
					</svg>
				</div>

				<div class="d-flex flex-column ga-1 position-relative">
					<div class="booking-board__indicator" />

					<div
						v-for="room in bookingRows"
						:key="`${room.name}-track`"
						class="booking-board__track position-relative w-100"
					>
						<div
							v-for="item in room.bookings"
							:key="`${room.name}-${item.label}`"
							class="h-100 position-absolute py-2 pl-4 rounded-md overflow-hidden bg-opacity-5"
							:class="{ 'bg-white': item.muted, 'bg-primary': !item.muted }"
							:style="bookingStyle(item)"
						>
							<div class="booking-board__booking-username font-weight-medium text-white opacity-60">
								{{ item.label }}
							</div>
							<div class="booking-board__booking-time text-white opacity-60">{{ item.time }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</s-dashboard-panel>
</template>

<script setup>
	const testStore = useTestStore();

	const bookingTimeline = ["0:00", "0:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00"];

	const bookingRows = [
		{
			name: "Компьютер 1",
			subtitle: "Общий зал",
			bookings: [{ label: "pappy", time: "0:30 - 3:30", start: 30, end: 210 }],
		},
		{
			name: "Компьютер 2",
			subtitle: "Общий зал",
			bookings: [{ label: "french", time: "0:00 - 3:30", start: 0, end: 210 }],
		},
		{
			name: "Компьютер 3",
			subtitle: "Общий зал",
			bookings: [{ label: "wii337", time: "1:00 - 4:00", start: 60, end: 240, muted: true }],
		},
		{
			name: "Компьютер 4",
			subtitle: "Общий зал",
			bookings: [{ label: "asim2002", time: "0:30 - 3:30", start: 30, end: 210 }],
		},
	];

	function bookingStyle(item) {
		return { left: `${(505 / 262.5) * item.start}px`, width: `${(505 / 262.5) * (item.end - item.start)}px` };
	}
</script>

<style lang="scss">
	.booking-board {
		&__rooms {
			min-width: 148px;
			gap: 19px;
			padding-bottom: 22px;
		}

		&__device {
			font-size: 16px;
			margin-bottom: 5px;
		}

		&__room {
			font-size: 12px;
		}

		&__timeline {
			max-width: none;
			padding-left: 32px;
			padding-top: 15px;
			padding-right: 12px;
			padding-bottom: 15px;
		}

		&__times {
			margin-left: -14px;
			max-width: 490px;
		}

		&__track {
			height: 47px;
			max-width: 505px;
		}

		&__booking-username {
			font-size: 16px;
			margin-bottom: 5px;
		}

		&__booking-time {
			font-size: 12px;
		}

		&__indicator {
			position: absolute;
			top: -26px;
			bottom: 0;
			left: 25%;
			width: 1px;
			color: rgba(171, 244, 62, 1);
			background: rgba(171, 244, 62, 0.8);
			z-index: 2;

			&::after {
				content: "";
				position: absolute;
				top: 0;
				left: 50%;
				width: 7px;
				height: 7px;
				border-radius: 50%;
				transform: translate(-50%, -50%);
				background: currentColor;
			}
		}
	}
</style>
