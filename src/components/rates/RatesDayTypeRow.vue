<template>
	<article
		class="rates-day-type-row d-flex align-center flex-wrap flex-md-nowrap ga-3 bg-white bg-opacity-2 rounded-md"
	>
		<div class="rates-day-type-row__main d-flex align-center flex-1-1-0 overflow-hidden">
			<v-btn
				:variant="selected ? 'flat' : 'outlined'"
				:color="selected ? 'primary' : 'white'"
				:class="selected ? 'text-black' : 'text-white opacity-50'"
				:aria-label="selected ? 'Снять выделение типа дня' : 'Выделить тип дня'"
				icon
				rounded="md"
				size="18"
				class="rates-day-type-row__select"
				@click.stop="emit('toggle-selection', dayType)"
			>
				<v-icon
					v-if="selected"
					icon="mdi-check"
					size="12"
				/>
			</v-btn>

			<span class="rates-day-type-row__name ml-3 text-white font-weight-medium text-truncate">
				{{ dayType.name }}
			</span>

			<v-btn
				:density="null"
				icon
				variant="plain"
				size="16"
				class="rates-day-type-row__edit ml-2 pa-0 text-white opacity-50 flex-shrink-0"
				aria-label="Редактировать тип дня"
				@click.stop="emit('edit', dayType)"
			>
				<v-icon
					icon="mdi-pencil-outline"
					size="16"
				/>
			</v-btn>

			<s-badge
				:label="`Дней: ${daysCount}`"
				:tone="dayType.color"
				bg-opacity="20"
				class="ml-2 flex-shrink-0"
			/>
		</div>

		<div
			class="rates-day-type-row__weekdays d-flex align-center justify-center order-3 order-md-0 flex-1-1-100 flex-md-0-0 ga-1"
		>
			<template v-if="isWeekdayType">
				<s-badge
					v-for="weekday in weekdays"
					:key="weekday.value"
					:label="weekday.label"
					:tone="isActiveWeekday(weekday.value) ? dayType.color : 'white'"
					:bg-opacity="isActiveWeekday(weekday.value) ? 20 : 2"
					class="rates-day-type-row__weekday text-center"
				/>
			</template>
		</div>

		<div class="rates-day-type-row__actions d-flex align-center justify-end flex-0-0 flex-md-1-1-0 ga-1">
			<v-btn
				width="60"
				height="34"
				rounded="md"
				variant="flat"
				class="rates-day-type-row__menu-button text-background px-0"
				aria-label="Открыть меню типа дня"
				aria-haspopup="menu"
				@click.stop="emit('open-menu', dayType, $event)"
			>
				<v-icon
					icon="mdi-brush-outline"
					size="16"
				/>
				<v-icon
					icon="mdi-chevron-down"
					size="16"
					class="ml-1"
				/>
			</v-btn>

			<v-btn
				icon
				color="red"
				size="34"
				rounded="md"
				variant="flat"
				class="bg-opacity-20 text-red"
				aria-label="Удалить тип дня"
				@click.stop="emit('delete', dayType)"
			>
				<v-icon
					icon="mdi-trash-can-outline"
					size="16"
				/>
			</v-btn>
		</div>
	</article>
</template>

<script setup>
	import { DAY_TYPE_SCHEDULE_KIND, ISO_WEEKDAY } from "@/store/dayTypes";

	const props = defineProps({
		dayType: {
			type: Object,
			required: true,
		},
		daysCount: {
			type: Number,
			default: 0,
		},
		selected: {
			type: Boolean,
			default: false,
		},
	});

	const emit = defineEmits(["toggle-selection", "edit", "open-menu", "delete"]);

	const weekdays = [
		{ value: ISO_WEEKDAY.MONDAY, label: "Пн" },
		{ value: ISO_WEEKDAY.TUESDAY, label: "Вт" },
		{ value: ISO_WEEKDAY.WEDNESDAY, label: "Ср" },
		{ value: ISO_WEEKDAY.THURSDAY, label: "Чт" },
		{ value: ISO_WEEKDAY.FRIDAY, label: "Пт" },
		{ value: ISO_WEEKDAY.SATURDAY, label: "Сб" },
		{ value: ISO_WEEKDAY.SUNDAY, label: "Вс" },
	];

	const isWeekdayType = $computed(() => props.dayType.schedule.kind === DAY_TYPE_SCHEDULE_KIND.WEEKDAYS);

	const isActiveWeekday = (weekday) => props.dayType.schedule.weekdays.includes(weekday);
</script>

<style scoped lang="scss">
	.rates-day-type-row {
		height: 48px;
		padding-inline: 20px;

		&__name {
			line-height: 125%;
		}

		&__edit {
			min-width: 16px !important;
		}

		&__select {
			border-radius: 6px !important;
			border-color: rgba(255, 255, 255, 0.5);
		}

		&__weekday {
			box-sizing: border-box;
			width: 36px;
			height: 28px;
		}

		&__menu-button {
			min-width: 0 !important;
			background: linear-gradient(
				135deg,
				rgb(var(--v-theme-red)) 0%,
				rgb(var(--v-theme-orange)) 52%,
				rgb(var(--v-theme-primary)) 100%
			) !important;
		}
	}

	@media (max-width: 1019px) {
		.rates-day-type-row {
			height: auto;
			min-height: 48px;
			padding-block: 4px;

			&__weekdays {
				justify-content: flex-start !important;
			}
		}
	}
</style>
