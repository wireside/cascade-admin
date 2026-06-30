<template>
	<div
		class="dashboard-panel bg-white bg-opacity-3"
		:class="{ 'dashboard-panel--expanded': !collapsed }"
	>
		<div
			class="d-flex align-center justify-space-between"
			:class="{ 'mb-4': !collapsed }"
		>
			<div class="d-flex align-center ga-2 flex-wrap">
				<v-chip
					:size="null"
					:color="section.tone || 'primary'"
					variant="flat"
					class="bootcamp-badge bg-opacity-20 font-weight-medium rounded-md px-3 py-1"
					:class="`text-${section.tone}`"
				>
					{{ section.badge }}
				</v-chip>
				<span class="text-white text-subtitle-1 font-weight-semibold">{{ section.title }}</span>
				<v-btn
					:density="null"
					size="16"
					variant="plain"
					class="opacity-100"
				>
					<v-icon
						icon="mdi-lead-pencil"
						size="16"
						class="opacity-50"
					/>
				</v-btn>
			</div>

			<div class="d-flex align-center ga-2">
				<v-btn
					variant="flat"
					width="60"
					height="40"
					rounded="md"
					class="devices-section-action devices-section-action--paint text-background px-0"
					@click="detailsPanelOpen = true"
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
					variant="flat"
					color="red"
					width="40"
					height="40"
					rounded="md"
					class="devices-section-action bg-opacity-20 text-red"
				>
					<v-icon
						icon="mdi-delete-outline"
						size="16"
					/>
				</v-btn>

				<v-btn
					icon
					variant="flat"
					color="white"
					width="40"
					height="40"
					rounded="md"
					class="devices-section-action bg-white bg-opacity-5 text-white"
					@click="collapsed = !collapsed"
				>
					<v-icon
						:icon="collapsed ? 'mdi-chevron-up' : 'mdi-chevron-down'"
						size="20"
					/>
				</v-btn>
			</div>
		</div>

		<s-data-table
			v-if="!collapsed"
			v-model="selectedRows"
			:columns="columns"
			:rows="tableRows"
			:loading="loading"
			:tone="section.tone"
			selectable
			row-border
			hover-class="bg-background"
			row-hover-popup-delay="500"
			table-height="288"
			@row-contextmenu="openRowMenu"
		>
			<template #row-hover-popup="{ row }">
				<div
					v-if="row?.client"
					class="upcoming-bookings bg-surface bg-opacity-80 px-4 pt-2 pb-3 text-white font-weight-medium"
				>
					<div class="d-flex align-center ga-2 mb-2">
						<v-icon
							icon="mdi-clock-star-four-points-outline"
							size="20"
							class="text-white"
						/>
						<span>Ближ. бронирования</span>
					</div>

					<div class="d-flex align-center justify-space-between ga-4 text-no-wrap">
						<span class="opacity-70">{{ "01.03.26" }}</span>
						<v-row
							gap="2px"
							align="center"
						>
							<v-col>{{ row.start.split(":").slice(0, 2).join(":") }}</v-col>
							<v-col>
								<v-icon
									icon="mdi-arrow-right"
									size="18"
								/>
							</v-col>
							<v-col>{{ row.end.split(":").slice(0, 2).join(":") }}</v-col>
						</v-row>
						<span class="opacity-70">{{ row.client }}</span>
					</div>
				</div>
			</template>
		</s-data-table>

		<device-control
			v-if="!collapsed"
			v-model:visible="contextMenu.show"
			:x="contextMenu.x"
			:y="contextMenu.y"
			:menu-target="contextMenu.target"
			:row="contextMenu.row"
		/>

		<devices-details-panel
			v-model:modal-open="detailsPanelOpen"
			:device="detailsDevice"
		/>
	</div>
</template>

<script setup>
	const props = defineProps({
		section: {
			type: Object,
			required: true,
		},
	});

	const testStore = useTestStore();

	const selectedRows = $ref([]);
	let collapsed = $ref(false);
	let detailsPanelOpen = $ref(false);

	const contextMenu = $ref({
		show: false,
		x: 0,
		y: 0,
		target: null,
		row: null,
		rowIdx: null,
	});

	const loading = $computed(() => testStore.loading);

	const detailsDevice = $computed(() => selectedRows[0] || tableRows[0] || null);

	const getBookingDate = (start, end) => {
		const source = typeof start === "string" && start.includes(" ") ? start : end;
		if (!source || typeof source !== "string") return start || end || "—";

		const [datePart] = source.split(" ");
		return datePart || source;
	};

	const tableRows = $computed(() => {
		return props.section.rows.map((row) => ({
			...row,
			status: toBadge(row.status),
			booking: toBadge(row.booking),
		}));
	});

	const columns = [
		{ key: "id", label: "№", width: { maxChars: 4 }, align: "left", strong: true },
		{ key: "name", label: "Название", width: { maxChars: 14 }, strong: true },
		{ key: "status", label: "Статус", width: { maxChars: 10 } },
		{ key: "booking", label: "Бронь", width: { maxChars: 10 } },
		{ key: "client", label: "Клиент", width: { maxChars: 14 } },
		{ key: "tariff", label: "Тариф", width: { maxChars: 14 } },
		{ key: "start", label: "Начало", width: { maxChars: 12 } },
		{ key: "end", label: "Окончание", width: { maxChars: 12 } },
		{ key: "app", label: "Приложение", width: { maxChars: 14 } },
	];

	const openRowMenu = ({ event, row, rowIdx }) => {
		event?.preventDefault?.();
		contextMenu.show = true;
		contextMenu.x = event?.clientX || 0;
		contextMenu.y = event?.clientY || 0;
		contextMenu.target = event?.target || event?.currentTarget || null;
		contextMenu.row = row;
		contextMenu.rowIdx = rowIdx;
	};

	const toBadge = (value) => ({
		label: value.label,
		tone: value.tone || "primary",
	});
</script>

<style scoped lang="scss">
	.dashboard-panel {
		border-radius: 10px;
		padding-block: 10px;
		padding-inline: 20px;

		&--expanded {
			padding-bottom: 20px !important;
		}
	}

	.bootcamp-badge {
		padding-inline: 10px;
		padding-block: 0.5px;
		line-height: 18px;
	}

	.upcoming-bookings {
		font-size: 12px;
		border-radius: 10px;
		backdrop-filter: blur(8px);
	}

	.devices-section-action {
		min-width: 0 !important;

		&--paint {
			background: linear-gradient(
				135deg,
				rgb(var(--v-theme-red)) 0%,
				rgb(var(--v-theme-orange)) 52%,
				rgb(var(--v-theme-primary)) 100%
			) !important;
		}
	}
</style>
