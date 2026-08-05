<template>
	<v-sheet
		width="289"
		height="297"
		color="white"
		class="rates-month-calendar d-flex flex-column bg-opacity-2 pa-4"
	>
		<v-sheet
			height="15"
			color="transparent"
			class="rates-month-calendar__header d-flex align-center justify-space-between ga-2 flex-shrink-0"
		>
			<span
				role="heading"
				aria-level="3"
				class="text-body-2 text-white font-weight-medium"
			>
				{{ monthName }}
			</span>

			<div
				v-if="showYearControls"
				class="d-flex align-center ga-1"
			>
				<v-btn
					icon
					color="white"
					variant="text"
					size="16"
					class="text-white"
					aria-label="Предыдущий год"
					@click="emit('previous-year')"
				>
					<v-icon
						icon="mdi-chevron-left"
						size="16"
					/>
				</v-btn>

				<span class="text-body-2 text-white">
					{{ year }}
				</span>

				<v-btn
					icon
					color="white"
					variant="text"
					size="16"
					class="text-white"
					aria-label="Следующий год"
					@click="emit('next-year')"
				>
					<v-icon
						icon="mdi-chevron-right"
						size="16"
					/>
				</v-btn>
			</div>
		</v-sheet>

		<v-sheet
			height="14"
			color="transparent"
			class="flex-shrink-0"
		/>

		<v-sheet
			height="32"
			color="transparent"
			class="d-flex align-center justify-space-between flex-shrink-0"
		>
			<v-sheet
				v-for="weekday in WEEKDAYS"
				:key="weekday"
				width="35"
				height="32"
				color="transparent"
				class="d-flex align-center justify-center flex-0-0 text-caption text-white opacity-30"
			>
				{{ weekday }}
			</v-sheet>
		</v-sheet>

		<v-sheet
			height="2"
			color="transparent"
			class="flex-shrink-0"
		/>

		<v-sheet
			height="202"
			color="transparent"
			class="d-flex flex-column justify-space-between flex-shrink-0"
		>
			<div
				v-for="(week, weekIndex) in calendarWeeks"
				:key="weekIndex"
				class="d-flex justify-space-between"
			>
				<template
					v-for="calendarDay in week"
					:key="calendarDay.dateKey"
				>
					<v-btn
						:aria-label="getDayAriaLabel(calendarDay)"
						:class="calendarDay.color ? '' : 'text-white'"
						:color="calendarDay.color || 'white'"
						:style="calendarDay.color ? { '--v-activated-opacity': 0.2 } : undefined"
						:variant="calendarDay.color ? 'tonal' : 'text'"
						width="35"
						height="32"
						min-width="35"
						rounded="md"
						class="rates-month-calendar__day flex-grow-0 flex-shrink-0 px-0 font-weight-regular"
						@click="selectDay(calendarDay)"
					>
						<span
							:class="getDayTextClass(calendarDay)"
							class="rates-month-calendar__day-text font-weight-regular"
						>
							{{ calendarDay.day }}
						</span>
					</v-btn>
				</template>
			</div>
		</v-sheet>
	</v-sheet>
</template>

<script setup>
	import { useDayTypesStore } from "@/store/dayTypes";

	const props = defineProps({
		year: {
			type: Number,
			required: true,
		},
		month: {
			type: Number,
			required: true,
			validator: (month) => month >= 0 && month <= 11,
		},
		showYearControls: {
			type: Boolean,
			default: false,
		},
	});

	const emit = defineEmits(["previous-year", "next-year", "day-click"]);
	const dayTypesStore = useDayTypesStore();

	const MONTHS = [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь",
	];
	const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
	const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	const monthName = $computed(() => MONTHS[props.month]);
	const calendarWeeks = $computed(() => {
		const firstDay = new Date(props.year, props.month, 1, 12);
		const firstDayOffset = (firstDay.getDay() + 6) % 7;
		const firstCalendarDate = new Date(props.year, props.month, 1 - firstDayOffset, 12);
		const days = Array.from({ length: 42 }, (_, index) => {
			const date = new Date(firstCalendarDate);
			date.setDate(firstCalendarDate.getDate() + index);

			const isCurrentMonth = date.getFullYear() === props.year && date.getMonth() === props.month;
			const dayTypes = isCurrentMonth ? dayTypesStore.getDayTypesForDate(date) : [];

			return {
				date,
				dateKey: [
					date.getFullYear(),
					String(date.getMonth() + 1).padStart(2, "0"),
					String(date.getDate()).padStart(2, "0"),
				].join("-"),
				day: date.getDate(),
				dayTypes,
				color: dayTypes[0]?.color,
				isCurrentMonth,
			};
		});

		return Array.from({ length: 6 }, (_, week) => days.slice(week * 7, week * 7 + 7));
	});

	const getDayTextClass = (calendarDay) => {
		if (!calendarDay.isCurrentMonth) {
			return "opacity-70";
		}

		return "";
	};

	const getDayAriaLabel = (calendarDay) => {
		const typeNames = calendarDay.dayTypes.map(({ name }) => name).join(", ");
		const dateLabel = dateFormatter.format(calendarDay.date);

		return typeNames ? `${dateLabel} — ${typeNames}` : dateLabel;
	};

	const selectDay = (calendarDay) => {
		emit("day-click", {
			date: new Date(calendarDay.date),
			dateKey: calendarDay.dateKey,
			year: calendarDay.date.getFullYear(),
			month: calendarDay.date.getMonth() + 1,
			day: calendarDay.day,
			dayTypes: [...calendarDay.dayTypes],
			isOutsideMonth: !calendarDay.isCurrentMonth,
		});
	};
</script>

<style lang="scss" scoped>
	.rates-month-calendar {
		border-radius: 10px;

		&__header {
			padding-inline: 6px 3px;
		}

		&__day-text {
			font-size: 12px;
		}

		&__day {
			font-size: 12px !important;
		}
	}
</style>
