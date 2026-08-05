import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const DAY_TYPE_SCHEDULE_KIND = Object.freeze({
	WEEKDAYS: "weekdays",
	DATES: "dates",
});

export const ISO_WEEKDAY = Object.freeze({
	MONDAY: 1,
	TUESDAY: 2,
	WEDNESDAY: 3,
	THURSDAY: 4,
	FRIDAY: 5,
	SATURDAY: 6,
	SUNDAY: 7,
});

const MOCK_DAY_TYPES = [
	{
		id: "weekends",
		name: "Выходные дни",
		color: "#EE23FF",
		discount: 10,
		schedule: {
			kind: DAY_TYPE_SCHEDULE_KIND.WEEKDAYS,
			weekdays: [ISO_WEEKDAY.SATURDAY, ISO_WEEKDAY.SUNDAY],
		},
	},
	{
		id: "new-year-holidays",
		name: "Новогодние праздники",
		color: "#23DCFF",
		discount: 15,
		schedule: {
			kind: DAY_TYPE_SCHEDULE_KIND.DATES,
			dates: [
				{ month: 12, day: 31 },
				{ month: 1, day: 1 },
				{ month: 1, day: 2 },
				{ month: 1, day: 3 },
				{ month: 1, day: 4 },
				{ month: 1, day: 5 },
				{ month: 1, day: 6 },
				{ month: 1, day: 7 },
			],
		},
	},
	{
		id: "public-holidays",
		name: "Праздничные дни",
		color: "#F68F3D",
		discount: 5,
		schedule: {
			kind: DAY_TYPE_SCHEDULE_KIND.DATES,
			dates: [
				{ month: 2, day: 23 },
				{ month: 3, day: 8 },
				{ month: 5, day: 1 },
				{ month: 5, day: 9 },
				{ month: 6, day: 12 },
				{ month: 11, day: 4 },
			],
		},
	},
];

let generatedId = 0;

function createDayTypeId() {
	if (globalThis.crypto?.randomUUID) {
		return globalThis.crypto.randomUUID();
	}

	generatedId += 1;
	return `day-type-${Date.now()}-${generatedId}`;
}

function normalizeWeekdays(weekdays) {
	if (!Array.isArray(weekdays) || weekdays.length === 0) {
		throw new TypeError("Тип дня должен содержать хотя бы один день недели");
	}

	const normalizedWeekdays = [...new Set(weekdays.map(Number))].sort((a, b) => a - b);
	const hasInvalidWeekday = normalizedWeekdays.some(
		(weekday) => !Number.isInteger(weekday) || weekday < ISO_WEEKDAY.MONDAY || weekday > ISO_WEEKDAY.SUNDAY
	);

	if (hasInvalidWeekday) {
		throw new RangeError("День недели должен быть целым числом от 1 до 7");
	}

	return normalizedWeekdays;
}

function isCalendarDateValid(month, day, year = 2024) {
	const date = new Date(year, month - 1, day, 12);
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function normalizeCalendarDates(dates) {
	if (!Array.isArray(dates) || dates.length === 0) {
		throw new TypeError("Тип дня должен содержать хотя бы одну календарную дату");
	}

	const uniqueDates = new Map();

	for (const value of dates) {
		const month = Number(value?.month);
		const day = Number(value?.day);

		if (!Number.isInteger(month) || !Number.isInteger(day) || !isCalendarDateValid(month, day)) {
			throw new RangeError("Календарная дата должна содержать корректные month и day");
		}

		uniqueDates.set(`${month}-${day}`, { month, day });
	}

	return [...uniqueDates.values()].sort((a, b) => a.month - b.month || a.day - b.day);
}

function normalizeSchedule(schedule) {
	if (schedule?.kind === DAY_TYPE_SCHEDULE_KIND.WEEKDAYS) {
		return {
			kind: DAY_TYPE_SCHEDULE_KIND.WEEKDAYS,
			weekdays: normalizeWeekdays(schedule.weekdays),
		};
	}

	if (schedule?.kind === DAY_TYPE_SCHEDULE_KIND.DATES) {
		return {
			kind: DAY_TYPE_SCHEDULE_KIND.DATES,
			dates: normalizeCalendarDates(schedule.dates),
		};
	}

	throw new TypeError('schedule.kind должен быть равен "weekdays" или "dates"');
}

function normalizeDayType(dayType) {
	const name = String(dayType?.name ?? "").trim();
	const color = String(dayType?.color ?? "")
		.trim()
		.toUpperCase();
	const discount = Number(dayType?.discount ?? 0);

	if (!name) {
		throw new TypeError("Название типа дня не может быть пустым");
	}

	if (!/^#[\dA-F]{6}$/.test(color)) {
		throw new TypeError("Цвет типа дня должен быть в формате #RRGGBB");
	}

	if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
		throw new RangeError("Скидка должна быть числом от 0 до 100");
	}

	return {
		id: String(dayType.id || createDayTypeId()),
		name,
		color,
		discount,
		schedule: normalizeSchedule(dayType.schedule),
	};
}

function normalizeDate(value) {
	if (typeof value === "string") {
		const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

		if (dateParts) {
			const [, year, month, day] = dateParts;
			return new Date(Number(year), Number(month) - 1, Number(day), 12);
		}
	}

	const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

	if (Number.isNaN(date.getTime())) {
		throw new TypeError("Ожидалась корректная календарная дата");
	}

	return date;
}

function cloneMockDayTypes() {
	return MOCK_DAY_TYPES.map((dayType) => normalizeDayType(dayType));
}

export const useDayTypesStore = defineStore("day_types", () => {
	const dayTypes = ref([]);
	const loading = ref(false);
	const initialized = ref(false);
	const error = ref(null);
	let initializationPromise = null;

	const dayTypesCount = computed(() => dayTypes.value.length);
	const weekdayDayTypes = computed(() =>
		dayTypes.value.filter(({ schedule }) => schedule.kind === DAY_TYPE_SCHEDULE_KIND.WEEKDAYS)
	);
	const calendarDateDayTypes = computed(() =>
		dayTypes.value.filter(({ schedule }) => schedule.kind === DAY_TYPE_SCHEDULE_KIND.DATES)
	);

	function getDayTypeById(id) {
		return dayTypes.value.find((dayType) => dayType.id === String(id));
	}

	async function initializeDayTypes({ force = false } = {}) {
		if (initialized.value && !force) {
			return dayTypes.value;
		}

		if (initializationPromise && !force) {
			return initializationPromise;
		}

		initializationPromise = (async () => {
			loading.value = true;
			error.value = null;

			try {
				await Promise.resolve();
				dayTypes.value = cloneMockDayTypes();
				initialized.value = true;
				return dayTypes.value;
			} catch (initializationError) {
				error.value = initializationError;
				throw initializationError;
			} finally {
				loading.value = false;
			}
		})();

		try {
			return await initializationPromise;
		} finally {
			initializationPromise = null;
		}
	}

	function addDayType(payload) {
		const dayType = normalizeDayType(payload);

		if (getDayTypeById(dayType.id)) {
			throw new Error(`Тип дня с id "${dayType.id}" уже существует`);
		}

		dayTypes.value.push(dayType);
		return dayType;
	}

	function updateDayType(id, changes) {
		const index = dayTypes.value.findIndex((dayType) => dayType.id === String(id));

		if (index === -1) {
			throw new Error(`Тип дня с id "${id}" не найден`);
		}

		const updatedDayType = normalizeDayType({
			...dayTypes.value[index],
			...changes,
			id: dayTypes.value[index].id,
			schedule: changes.schedule ?? dayTypes.value[index].schedule,
		});

		dayTypes.value[index] = updatedDayType;
		return updatedDayType;
	}

	function removeDayType(id) {
		const index = dayTypes.value.findIndex((dayType) => dayType.id === String(id));

		if (index === -1) {
			return false;
		}

		dayTypes.value.splice(index, 1);
		return true;
	}

	function isDayTypeAppliedToDate(dayTypeOrId, value) {
		const dayType = typeof dayTypeOrId === "object" ? dayTypeOrId : getDayTypeById(dayTypeOrId);

		if (!dayType) {
			return false;
		}

		const date = normalizeDate(value);

		if (dayType.schedule.kind === DAY_TYPE_SCHEDULE_KIND.WEEKDAYS) {
			const isoWeekday = date.getDay() || ISO_WEEKDAY.SUNDAY;
			return dayType.schedule.weekdays.includes(isoWeekday);
		}

		return dayType.schedule.dates.some(({ month, day }) => month === date.getMonth() + 1 && day === date.getDate());
	}

	function getDayTypesForDate(value) {
		return dayTypes.value.filter((dayType) => isDayTypeAppliedToDate(dayType, value));
	}

	function getDaysCountForYear(dayTypeOrId, year = new Date().getFullYear()) {
		const dayType = typeof dayTypeOrId === "object" ? dayTypeOrId : getDayTypeById(dayTypeOrId);
		const normalizedYear = Number(year);

		if (!dayType) {
			return 0;
		}

		if (!Number.isInteger(normalizedYear)) {
			throw new TypeError("Год должен быть целым числом");
		}

		if (dayType.schedule.kind === DAY_TYPE_SCHEDULE_KIND.DATES) {
			return dayType.schedule.dates.filter(({ month, day }) => isCalendarDateValid(month, day, normalizedYear)).length;
		}

		let count = 0;
		const date = new Date(normalizedYear, 0, 1, 12);

		while (date.getFullYear() === normalizedYear) {
			if (isDayTypeAppliedToDate(dayType, date)) {
				count += 1;
			}

			date.setDate(date.getDate() + 1);
		}

		return count;
	}

	function resetDayTypes() {
		dayTypes.value = [];
		loading.value = false;
		initialized.value = false;
		error.value = null;
		initializationPromise = null;
	}

	return {
		dayTypes,
		loading,
		initialized,
		error,
		dayTypesCount,
		weekdayDayTypes,
		calendarDateDayTypes,
		getDayTypeById,
		initializeDayTypes,
		addDayType,
		updateDayType,
		removeDayType,
		isDayTypeAppliedToDate,
		getDayTypesForDate,
		getDaysCountForYear,
		resetDayTypes,
	};
});
