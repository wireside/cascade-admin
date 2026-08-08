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

			<v-text-field
				v-if="isEditingName"
				ref="nameInput"
				v-model="editedName"
				bg-color="transparent"
				density="compact"
				hide-details
				single-line
				variant="plain"
				class="rates-day-type-row__name-input ml-3 text-white font-weight-medium"
				aria-label="Название типа дня"
				@blur="saveName"
				@keydown.enter.prevent="saveName"
				@keydown.esc.prevent="cancelNameEditing"
			/>

			<span
				v-else
				class="rates-day-type-row__name ml-3 text-white font-weight-medium text-truncate"
			>
				{{ dayType.name }}
			</span>

			<v-btn
				:density="null"
				:aria-label="isEditingName ? 'Сохранить название типа дня' : 'Редактировать название типа дня'"
				icon
				variant="plain"
				size="16"
				class="rates-day-type-row__edit ml-2 pa-0 text-white opacity-50 flex-shrink-0"
				@mousedown="isEditingName && $event.preventDefault()"
				@click.stop="isEditingName ? saveName() : startNameEditing()"
			>
				<v-icon
					:icon="isEditingName ? 'mdi-check' : 'mdi-pencil-outline'"
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
			<v-btn
				v-for="weekday in weekdays"
				:key="weekday.value"
				:aria-label="getWeekdayAriaLabel(weekday)"
				:aria-pressed="isActiveWeekday(weekday.value)"
				:class="isActiveWeekday(weekday.value) ? '' : 'bg-white bg-opacity-7 text-white'"
				:color="isActiveWeekday(weekday.value) ? dayType.color : 'white'"
				:style="isActiveWeekday(weekday.value) ? { '--v-activated-opacity': 0.2 } : undefined"
				:variant="isActiveWeekday(weekday.value) ? 'tonal' : 'flat'"
				width="36"
				height="28"
				min-width="36"
				rounded="md"
				class="rates-day-type-row__weekday px-0 text-caption font-weight-regular"
				@click.stop="emit('toggle-weekday', dayType, weekday.value)"
			>
				{{ weekday.label }}
			</v-btn>
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
	import { ISO_WEEKDAY } from "@/store/dayTypes";

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

	const emit = defineEmits(["toggle-selection", "toggle-weekday", "rename", "open-menu", "delete"]);
	const nameInput = ref(null);

	let isEditingName = $ref(false);
	let editedName = $ref("");

	const weekdays = [
		{ value: ISO_WEEKDAY.MONDAY, label: "Пн" },
		{ value: ISO_WEEKDAY.TUESDAY, label: "Вт" },
		{ value: ISO_WEEKDAY.WEDNESDAY, label: "Ср" },
		{ value: ISO_WEEKDAY.THURSDAY, label: "Чт" },
		{ value: ISO_WEEKDAY.FRIDAY, label: "Пт" },
		{ value: ISO_WEEKDAY.SATURDAY, label: "Сб" },
		{ value: ISO_WEEKDAY.SUNDAY, label: "Вс" },
	];

	const isActiveWeekday = (weekday) => props.dayType.schedule.weekdays.includes(weekday);
	const getWeekdayAriaLabel = ({ value, label }) => {
		return `${isActiveWeekday(value) ? "Убрать" : "Добавить"} ${label} для типа «${props.dayType.name}»`;
	};

	const startNameEditing = async () => {
		editedName = props.dayType.name;
		isEditingName = true;

		await nextTick();

		const input = nameInput.value?.$el?.querySelector("input");
		input?.focus();
		input?.select();
	};

	const saveName = () => {
		if (!isEditingName) {
			return;
		}

		const normalizedName = editedName.trim() || "Без названия";
		isEditingName = false;

		if (normalizedName !== props.dayType.name) {
			emit("rename", props.dayType, normalizedName);
		}
	};

	const cancelNameEditing = () => {
		editedName = props.dayType.name;
		isEditingName = false;
	};
</script>

<style scoped lang="scss">
	.rates-day-type-row {
		height: 48px;
		padding-inline: 20px;

		&__name {
			min-width: 0;
			line-height: 125%;
		}

		&__name-input {
			min-width: 100px;
			max-width: 180px;

			:deep(.v-field__input) {
				min-height: 28px;
				padding-block: 0;
				font-size: 14px;
				line-height: 125%;
			}
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
