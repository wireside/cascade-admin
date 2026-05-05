<template>
	<div class="devices-page">
		<section class="devices-page__stack">
			<devices-section-panel :section="bootcampSections[0]" />
			<devices-section-panel :section="bootcampSections[1]" />
		</section>

		<devices-details-panel v-if="false" />
	</div>
</template>

<script setup>
	const bootcampSections = [
		{
			badge: "1",
			title: "BOOTCAMP №1",
			rows: [
				{ index: "1", name: "Компьютер 1", status: { label: "Включен", tone: "online" }, booking: { label: "Есть бронь", tone: "reserved" }, client: "—", tariff: "—", start: "—", end: "—", app: "Cascade [v.1.5.2]" },
				{ index: "2", name: "Компьютер 2", status: { label: "Включен", tone: "online" }, booking: { label: "Без брони", tone: "idle" }, client: "—", tariff: "—", start: "—", end: "—", app: "Cascade [v.1.5.2]" },
				{ index: "3", name: "Компьютер 3", status: { label: "Выключен", tone: "offline" }, booking: { label: "Без брони", tone: "idle" }, client: "—", tariff: "—", start: "—", end: "—", app: "Cascade [v.1.5.2]" },
				{ index: "4", name: "Компьютер 4", status: { label: "Включен", tone: "online" }, booking: { label: "Есть бронь", tone: "reserved" }, client: "—", tariff: "—", start: "—", end: "—", app: "Cascade [v.1.5.2]" },
			],
		},
		{
			badge: "2",
			title: "BOOTCAMP №2",
			rows: [
				{ index: "1", name: "Компьютер 5", status: { label: "Занят", tone: "busy" }, booking: { label: "Без брони", tone: "idle" }, client: "SEVA2001", tariff: "Буткемп 3 часа", start: "10:01:02", end: "13:01:02", app: "Counter Strike 2" },
				{ index: "2", name: "Компьютер 6", status: { label: "Занят", tone: "busy" }, booking: { label: "Без брони", tone: "idle" }, client: "79092223430", tariff: "Буткемп 3 часа", start: "10:00:30", end: "13:00:30", app: "Counter Strike 2" },
				{ index: "3", name: "Компьютер 7", status: { label: "Занят", tone: "busy" }, booking: { label: "Без брони", tone: "idle" }, client: "PAPPY", tariff: "Буткемп 3 часа", start: "09:58:11", end: "12:58:11", app: "Dota 2" },
				{ index: "4", name: "Компьютер 8", status: { label: "Обслуживание", tone: "service" }, booking: { label: "Без брони", tone: "idle" }, client: "—", tariff: "—", start: "—", end: "—", app: "Cascade [v.1.5.2]" },
			],
		},
	];
</script>

<style src="@/assets/styles/admin-panels.scss" lang="scss"></style>

<style lang="scss">
.devices-page {
	--panel-bg: rgba(17, 17, 17, 0.6);
	--panel-border: rgba(255, 255, 255, 0.15);
	--panel-border-soft: rgba(255, 255, 255, 0.08);
	--text-main: rgba(255, 255, 255, 0.96);
	--text-muted: rgba(255, 255, 255, 0.6);
	--text-faint: rgba(255, 255, 255, 0.38);
	--accent: #abf43e;
	display: grid;
	gap: 16px;
}

.devices-page__stack {
	display: grid;
	gap: 16px;
}

.dashboard-skeleton-grid--3 {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
}

.devices-section__header {
	align-items: flex-start;
}

.devices-section__heading {
	display: flex;
	align-items: center;
	gap: 10px;
}

.devices-section__badge {
	width: 32px;
	height: 22px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: rgba(171, 244, 62, 0.2);
	color: var(--accent);
	font-size: 14px;
	font-weight: 600;
	line-height: 1;
}

.devices-section__actions {
	display: flex;
	align-items: center;
	gap: 16px;
}

.devices-section__buttons {
	display: flex;
	gap: 8px;
}

.devices-section__select-all {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	color: var(--text-muted);
	font-size: 14px;
	line-height: 1;
}

.devices-table th:nth-child(1),
.devices-table td:nth-child(1) {
	width: 48px;
}

.devices-table th:nth-child(2),
.devices-table td:nth-child(2) {
	min-width: 180px;
}

.devices-table__index {
	color: var(--text-muted);
}

.devices-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 68px;
	padding: 7px 10px;
	border-radius: 8px;
	font-size: 12px;
	font-weight: 500;
	line-height: 1;
}

.devices-chip--online {
	background: rgba(12, 161, 87, 0.18);
	color: #7fe6b0;
}

.devices-chip--offline {
	background: rgba(255, 255, 255, 0.08);
	color: rgba(255, 255, 255, 0.72);
}

.devices-chip--busy {
	background: rgba(37, 127, 249, 0.18);
	color: #7fb3ff;
}

.devices-chip--reserved {
	background: rgba(171, 244, 62, 0.18);
	color: var(--accent);
}

.devices-chip--idle {
	background: rgba(255, 255, 255, 0.06);
	color: rgba(255, 255, 255, 0.56);
}

.devices-chip--service {
	background: rgba(243, 125, 29, 0.18);
	color: #ffb26d;
}

.devices-details__title-wrap {
	display: grid;
	gap: 6px;
}

.devices-details__eyebrow {
	font-size: 12px;
	line-height: 1;
	color: var(--text-faint);
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.devices-details__actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

.devices-details__skeleton {
	display: grid;
	gap: 12px;
}

.devices-details__top,
.devices-details__grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
}

.devices-details__grid + .devices-details__grid,
.devices-details__grid + .devices-details__card,
.devices-details__top + .devices-details__grid {
	margin-top: 12px;
}

.devices-details__card {
	padding: 16px 18px;
	border-radius: 14px;
	border: 1px solid var(--panel-border-soft);
	background: rgba(255, 255, 255, 0.03);
	min-width: 0;
}

.devices-details__label {
	font-size: 12px;
	line-height: 1;
	color: var(--text-muted);
	margin-bottom: 10px;
}

.devices-details__value {
	font-size: 18px;
	font-weight: 500;
	line-height: 1.25;
	color: var(--text-main);
}

.devices-details__network {
	display: grid;
	gap: 8px;
	font-size: 16px;
	line-height: 1.2;
	color: var(--text-main);
}

.devices-details__disks {
	display: grid;
	gap: 14px;
}

.devices-details__disk-row {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 8px;
}

.devices-details__disk-name {
	font-size: 18px;
	font-weight: 500;
}

.devices-details__disk-meta {
	font-size: 12px;
	color: var(--text-muted);
}

.devices-details__disk-bar {
	height: 28px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.06);
	overflow: hidden;
}

.devices-details__disk-fill {
	height: 100%;
	border-radius: inherit;
	background: linear-gradient(90deg, rgba(171, 244, 62, 0.76), rgba(113, 184, 5, 0.9));
}

@media (max-width: 1279px) {
	.devices-section__header,
	.devices-section__actions {
		flex-wrap: wrap;
	}

	.devices-details__top,
	.devices-details__grid,
	.dashboard-skeleton-grid--3 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 767px) {
	.devices-details__top,
	.devices-details__grid,
	.dashboard-skeleton-grid--3 {
		grid-template-columns: 1fr;
	}

	.devices-section__actions {
		width: 100%;
		justify-content: space-between;
	}
}
</style>
