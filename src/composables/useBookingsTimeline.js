const MINUTES_IN_DAY = 24 * 60;

function normalizeMinutes(value) {
	return ((value % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
}

function formatTimelineTime(value) {
	const minutes = normalizeMinutes(value);
	const hours = Math.floor(minutes / 60);
	const remainder = minutes % 60;

	return `${hours}:${String(remainder).padStart(2, "0")}`;
}

function roundUpToStep(value, step) {
	return Math.ceil(value / step) * step;
}

export function useBookingsTimeline(options = {}) {
	const {
		pastHours = 12,
		futureHours = 24,
		anchorMinute = 0,
		pixelsPerMinute = 505 / 262.5,
		labelStep = 30,
		tickStep = 15,
	} = options;

	const startMinute = anchorMinute - pastHours * 60;
	const endMinute = anchorMinute + futureHours * 60;
	const totalMinutes = endMinute - startMinute;
	const contentWidth = Math.round(totalMinutes * pixelsPerMinute);

	function clampMinute(value) {
		return Math.min(Math.max(value, startMinute), endMinute);
	}

	function minuteToX(value) {
		return (value - startMinute) * pixelsPerMinute;
	}

	function xToMinute(value) {
		return clampMinute(Math.round(value / pixelsPerMinute + startMinute));
	}

	function durationToWidth(start, end) {
		return Math.max((end - start) * pixelsPerMinute, 0);
	}

	const timeLabels = computed(() => {
		const labels = [];
		const firstLabelMinute = roundUpToStep(startMinute, labelStep);

		for (let minute = firstLabelMinute; minute <= endMinute; minute += labelStep) {
			labels.push({
				minute,
				label: formatTimelineTime(minute),
				x: minuteToX(minute),
			});
		}

		return labels;
	});

	const ticks = computed(() => {
		const items = [];
		const firstTickMinute = roundUpToStep(startMinute, tickStep);

		for (let minute = firstTickMinute; minute <= endMinute; minute += tickStep) {
			const normalized = normalizeMinutes(minute);
			const isHour = normalized % 60 === 0;
			const isHalfHour = normalized % 30 === 0;

			items.push({
				minute,
				x: minuteToX(minute),
				kind: isHour ? "hour" : isHalfHour ? "half" : "quarter",
			});
		}

		return items;
	});

	return {
		startMinute,
		endMinute,
		contentWidth,
		timeLabels,
		ticks,
		clampMinute,
		minuteToX,
		xToMinute,
		durationToWidth,
		formatTimelineTime,
	};
}
