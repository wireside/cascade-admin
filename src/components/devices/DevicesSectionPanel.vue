<template>
	<div
		v-for="section in sections"
		:key="section.id"
		class="dashboard-panel bg-white bg-opacity-3"
	>
		<div class="d-flex align-center justify-space-between">
			<div class="d-flex align-center ga-2 flex-wrap">
				<v-chip
					:size="null"
					:color="section.tone || 'primary'"
					variant="flat"
					class="bootcamp-badge bg-opacity-20 font-weight-medium rounded-md px-3 py-1"
					:class="`text-${section.tone}`"
				>
					{{ section.id }}
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
					@click="toggleCollapsed(section.id)"
				>
					<v-icon
						:icon="isCollapsed(section.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
						size="20"
					/>
				</v-btn>
			</div>
		</div>

		<s-collapse :expanded="!isCollapsed(section.id)">
			<div class="devices-section-content pt-4">
				<s-data-table
					v-model="selectedRowsByBootcamp[section.id]"
					:columns="columns"
					:rows="section.rows"
					:loading="loading"
					:tone="section.tone"
					selectable
					row-border
					hover-class="bg-background"
					cell-hover-popup-delay="500"
					table-height="288"
					@update:model-value="onSelectionChange(section.id, $event)"
					@row-contextmenu="openRowMenu(section.id, $event)"
				>
					<template #cell-booking-hover-popup="{ row }">
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
			</div>
		</s-collapse>

		<device-control
			v-if="!isCollapsed(section.id) && contextMenu.bootcampId === section.id"
			v-model:visible="contextMenu.show"
			:x="contextMenu.x"
			:y="contextMenu.y"
			:menu-target="contextMenu.target"
			:row="contextMenu.row"
		/>
	</div>
</template>

<script setup>
	const emit = defineEmits(["selection-change"]);

	const devicesStore = useDevicesStore();
	const testStore = useTestStore();

	const selectedRowsByBootcamp = $ref({});
	const collapsedByBootcamp = $ref({});

	const contextMenu = $ref({
		show: false,
		bootcampId: null,
		x: 0,
		y: 0,
		target: null,
		row: null,
		rowIdx: null,
	});

	const toBadge = (value) => ({
		label: value?.label || value || "—",
		tone: value?.tone || "primary",
	});

	const loading = $computed(() => testStore.loading);
	const sections = $computed(() =>
		devicesStore.bootcamps.map((bootcamp) => ({
			...bootcamp,
			title: `Буткемп №${bootcamp.id}`,
			rows: bootcamp.devices.map((device) => ({
				...device,
				status: toBadge(device.status),
				booking: toBadge(device.booking),
			})),
		}))
	);

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

	const onSelectionChange = (bootcampId, rows) => {
		selectedRowsByBootcamp[bootcampId] = rows;
		emit("selection-change", rows);
	};

	const isCollapsed = (bootcampId) => Boolean(collapsedByBootcamp[bootcampId]);

	const toggleCollapsed = (bootcampId) => {
		collapsedByBootcamp[bootcampId] = !isCollapsed(bootcampId);
	};

	const openRowMenu = (bootcampId, { event, row, rowIdx }) => {
		event?.preventDefault?.();
		contextMenu.show = true;
		contextMenu.bootcampId = bootcampId;
		contextMenu.x = event?.clientX || 0;
		contextMenu.y = event?.clientY || 0;
		contextMenu.target = event?.target || event?.currentTarget || null;
		contextMenu.row = row;
		contextMenu.rowIdx = rowIdx;
	};
</script>

<style scoped lang="scss">
	.dashboard-panel {
		border-radius: 10px;
		padding-block: 10px;
		padding-inline: 20px;
	}

	.devices-section-content {
		padding-bottom: 10px;
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
