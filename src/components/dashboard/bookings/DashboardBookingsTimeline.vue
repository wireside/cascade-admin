<template>
	<div class="booking-board d-flex w-100 overflow-hidden bg-white bg-opacity-3 rounded-lg">
		<div class="booking-board__rooms d-lg-flex d-none flex-column justify-end pl-5 pb-5 bg-primary bg-opacity-20">
			<div
				v-for="room in rows"
				:key="room.name"
				class="text-white"
			>
				<div class="booking-board__device">{{ room.name }}</div>
				<div class="booking-board__room opacity-70">{{ room.subtitle }}</div>
			</div>
		</div>

		<div class="booking-board__timeline flex-1-1 overflow-hidden">
			<div
				ref="viewportEl"
				class="booking-board__viewport w-100"
				@scroll.passive="handleScroll"
			>
				<div
					class="booking-board__canvas position-relative"
					:style="canvasStyle"
				>
					<div class="booking-board__times position-relative mb-3 text-white opacity-60">
						<span
							v-for="slot in timeLabels"
							:key="slot.minute"
							class="booking-board__time-label"
							:style="{ left: `${slot.x}px` }"
						>
							{{ slot.label }}
						</span>
					</div>

					<div class="booking-board__ruler position-relative mb-3">
						<div
							v-for="tick in ticks"
							:key="tick.minute"
							class="booking-board__tick"
							:class="`booking-board__tick--${tick.kind}`"
							:style="{ left: `${tick.x}px` }"
						/>
					</div>

					<div
						class="booking-board__tracks d-flex flex-column ga-1 position-relative"
						@click="handleTrackClick"
					>
						<div
							class="booking-board__indicator"
							:style="indicatorStyle"
							@pointerdown="startIndicatorDrag"
						/>

						<div
							v-for="room in rows"
							:key="`${room.name}-track`"
							class="booking-board__track position-relative w-100"
						>
							<div class="booking-board__mobile-room d-lg-none text-white opacity-70">
								{{ room.name }}
							</div>

							<button
								v-for="item in room.bookings"
								:key="`${room.name}-${item.label}-${item.start}`"
								type="button"
								class="booking-board__booking h-100 position-absolute py-2 pl-4 pr-3 rounded-md overflow-hidden text-left bg-opacity-5"
								:class="{ 'bg-white': item.muted, 'bg-primary': !item.muted }"
								:style="bookingStyle(item)"
								@click.stop="emitBookingClick(room, item)"
							>
								<div class="booking-board__booking-username font-weight-medium text-white opacity-60 text-truncate">
									{{ item.label }}
								</div>
								<div class="booking-board__booking-time text-white opacity-60 text-truncate">
									{{ item.time }}
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { nextTick, onBeforeUnmount, onMounted } from "vue";
	import { useBookingsTimeline } from "./useBookingsTimeline";

	const props = defineProps({
		rows: {
			type: Array,
			required: true,
		},
		initialMinute: {
			type: Number,
			default: 60,
		},
	});

	const emit = defineEmits(["booking-click", "indicator-change"]);

	const timeline = useBookingsTimeline({
		pastHours: 12,
		futureHours: 24,
		anchorMinute: props.initialMinute,
	});

	const { contentWidth, timeLabels, ticks, minuteToX, xToMinute, durationToWidth, formatTimelineTime } = timeline;

	let viewportEl = $ref(null);
	let indicatorMinute = $ref(props.initialMinute);
	let draggingIndicator = $ref(false);
	let didDragIndicator = false;

	const canvasStyle = $computed(() => ({
		width: `${contentWidth}px`,
	}));

	const indicatorStyle = $computed(() => ({
		left: `${minuteToX(indicatorMinute)}px`,
	}));

	function bookingStyle(item) {
		return {
			left: `${minuteToX(item.start)}px`,
			width: `${durationToWidth(item.start, item.end)}px`,
		};
	}

	function getCanvasX(event) {
		const rect = viewportEl.getBoundingClientRect();

		return event.clientX - rect.left + viewportEl.scrollLeft;
	}

	function setIndicatorFromPointer(event, shouldEmit = true) {
		indicatorMinute = xToMinute(getCanvasX(event));

		if (shouldEmit) {
			emit("indicator-change", {
				minute: indicatorMinute,
				label: formatTimelineTime(indicatorMinute),
			});
		}
	}

	function startIndicatorDrag(event) {
		event.preventDefault();
		event.stopPropagation();

		draggingIndicator = true;
		didDragIndicator = false;
		event.currentTarget.setPointerCapture?.(event.pointerId);

		window.addEventListener("pointermove", handleIndicatorDrag);
		window.addEventListener("pointerup", stopIndicatorDrag, { once: true });
	}

	function handleIndicatorDrag(event) {
		if (!draggingIndicator) return;

		didDragIndicator = true;
		setIndicatorFromPointer(event);
	}

	function stopIndicatorDrag() {
		draggingIndicator = false;
		window.removeEventListener("pointermove", handleIndicatorDrag);
	}

	function handleTrackClick(event) {
		if (didDragIndicator || !viewportEl) return;

		setIndicatorFromPointer(event);
	}

	function handleScroll() {
		didDragIndicator = false;
	}

	function emitBookingClick(room, booking) {
		emit("booking-click", {
			room,
			booking,
		});
	}

	onMounted(async () => {
		await nextTick();

		if (viewportEl) {
			viewportEl.scrollLeft = Math.max(minuteToX(indicatorMinute) - viewportEl.clientWidth * 0.25, 0);
		}
	});

	onBeforeUnmount(() => {
		window.removeEventListener("pointermove", handleIndicatorDrag);
		window.removeEventListener("pointerup", stopIndicatorDrag);
	});
</script>

<style lang="scss">
	.booking-board {
		min-width: 0;

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
			flex: 1 1 0;
			min-width: 0;
			padding: 15px 12px 15px 32px;
		}

		&__viewport {
			overflow-x: auto;
			overflow-y: hidden;
			scrollbar-width: none;
			touch-action: pan-x;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		&__canvas {
			min-width: 100%;
		}

		&__times {
			height: 14px;
			margin-left: -14px;
		}

		&__time-label {
			position: absolute;
			top: 0;
			font-size: 14px;
			white-space: nowrap;
			transform: translateX(-50%);
		}

		&__ruler {
			height: 15px;
		}

		&__tick {
			position: absolute;
			top: 0;
			width: 1px;
			background: rgba(217, 217, 217, 0.4);

			&--quarter {
				height: 8px;
			}

			&--half {
				height: 10px;
				background: rgba(217, 217, 217, 1);
			}

			&--hour {
				height: 15px;
				background: rgba(217, 217, 217, 1);
			}
		}

		&__track {
			height: 47px;
		}

		&__mobile-room {
			position: sticky;
			left: 0;
			z-index: 1;
			width: 112px;
			padding: 6px 0 0 2px;
			font-size: 12px;
			pointer-events: none;
		}

		&__booking {
			border: 1px solid transparent;
			color: inherit;
			cursor: pointer;
			appearance: none;
			transition:
				border-color 0.16s ease,
				background-color 0.16s ease,
				box-shadow 0.16s ease;

			&:hover,
			&:focus-visible {
				border-color: rgba(var(--v-theme-primary), 0.8);
				box-shadow: inset 0 0 0 1px rgba(var(--v-theme-primary), 0.18);
			}

			&:focus-visible {
				outline: none;
			}
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
			width: 13px;
			color: rgba(171, 244, 62, 1);
			cursor: ew-resize;
			transform: translateX(-6px);
			z-index: 3;
			touch-action: none;

			&::before {
				content: "";
				position: absolute;
				top: 0;
				bottom: 0;
				left: 6px;
				width: 1px;
				background: rgba(171, 244, 62, 0.8);
			}

			&::after {
				content: "";
				position: absolute;
				top: 0;
				left: 6px;
				width: 7px;
				height: 7px;
				border-radius: 50%;
				transform: translate(-50%, -50%);
				background: currentColor;
			}
		}
	}

	@media (max-width: 1098px) {
		.booking-board {
			&__timeline {
				padding-left: 18px;
			}
		}
	}

	@media (max-width: 575px) {
		.booking-board {
			&__timeline {
				padding-right: 10px;
				padding-left: 14px;
			}
		}
	}
</style>
