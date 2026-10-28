<template>
	<div
		v-if="!sections.length"
		class="pa-8 text-center text-secondary"
	>
		Устройств по выбранному фильтру нет
	</div>
	<div
		v-for="section in sections"
		:key="section.id"
		class="devices-section bg-sidebar"
	>
		<div class="d-flex align-center justify-space-between ga-3 devices-section__header">
			<div class="d-flex align-center ga-3 overflow-hidden">
				<v-btn
					:icon="isCollapsed(section.id) ? 'right' : 'down'"
					:aria-expanded="!isCollapsed(section.id)"
					size="32"
					aria-label="Свернуть или раскрыть группу"
					@click="toggleCollapsed(section.id)"
				/>
				<span class="devices-section__title text-white font-weight-semibold text-no-wrap">{{ section.title }}</span>
				<span class="devices-section__summary text-secondary text-no-wrap">
					{{ section.rows.length }} шт · {{ section.activeCount }} в работе
				</span>
				<v-btn
					icon="pencil"
					variant="text"
					color="secondary"
					size="28"
					aria-label="Переименовать группу"
				/>
			</div>
			<div class="d-flex align-center ga-3">
				<v-menu>
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							prepend-icon="power"
							append-icon="down"
							height="32"
							class="px-3"
						>
							Питание
						</v-btn>
					</template>
					<v-list
						class="pa-2"
						min-width="208"
					>
						<v-list-item
							title="Включить"
							prepend-icon="lightning"
							@click="emit('group-action', { groupId: section.id, action: 'power-on' })"
						/>
						<v-list-item
							title="Выключить"
							prepend-icon="stop"
							class="text-red"
							@click="emit('group-action', { groupId: section.id, action: 'power-off' })"
						/>
					</v-list>
				</v-menu>
				<v-btn
					icon="trash"
					color="red"
					variant="tonal"
					size="32"
					aria-label="Удалить группу"
				/>
			</div>
		</div>

		<s-collapse :expanded="!isCollapsed(section.id)">
			<div class="devices-section-content px-2 pb-2">
				<s-data-table
					v-model="selectedRowsByBootcamp[section.id]"
					:columns="columns"
					:rows="section.rows"
					:active-row-id="contextMenu.show && contextMenu.bootcampId === section.id ? contextMenu.row?.id : null"
					:loading="loading"
					tone="primary"
					selectable
					hover-class="s-data-table__row--hover"
					cell-hover-popup-delay="500"
					:table-height="Math.min(section.rows.length, 5) * 54 + 48"
					@update:model-value="onSelectionChange(section.id, $event)"
					@row-contextmenu="openRowMenu(section.id, $event)"
				>
					<template #cell-name="{ row }">
						<span class="devices-section__name font-weight-semibold">{{ row.name }}</span>
					</template>
					<template #cell-status="{ row }">
						<s-status
							:label="row.status.label"
							:tone="deviceStatusTone(row)"
						/>
					</template>
					<template #cell-booking="{ row }">
						<s-badge
							v-if="row.nextBookingTime"
							tone="info"
							bg-opacity="15"
							class="devices-section__booking"
						>
							<v-icon
								icon="calendar"
								size="12"
							/>
							Сегодня {{ row.nextBookingTime }}
						</s-badge>
						<span
							v-else
							class="text-secondary"
						>
							—
						</span>
					</template>
					<template #cell-client="{ row }">
						<span :class="row.client ? 'font-weight-semibold' : 'text-secondary'">{{ row.client || "—" }}</span>
					</template>
					<template #cell-tariff="{ row }">
						<span class="text-content-secondary">{{ row.tariff || "—" }}</span>
					</template>
					<template #cell-app="{ row }">
						<span class="text-content-secondary">{{ row.app || "—" }}</span>
					</template>
					<template #cell-actions="{ row }">
						<v-btn
							icon="dots"
							variant="text"
							color="secondary"
							size="32"
							aria-label="Действия с устройством"
							@click.stop="openRowMenu(section.id, { event: $event, row })"
						/>
					</template>
					<template #cell-booking-hover-popup="{ row }">
						<div
							v-if="row?.client"
							class="upcoming-bookings bg-surface bg-opacity-80 px-4 pt-2 pb-3 text-white font-weight-medium"
						>
							<div class="d-flex align-center ga-2 mb-2">
								<v-icon
									icon="clock"
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
											icon="arrow-right"
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
			@show-details="emit('show-details', contextMenu.row)"
		/>
	</div>
</template>

<script setup>
	import { deviceStatusTone, matchesDeviceFilter } from "@/utils/device";
	const props = defineProps({ filter: { type: String, default: "all" } });
	const emit = defineEmits(["selection-change", "show-details", "group-action"]);

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
		devicesStore.bootcamps
			.map((bootcamp) => ({
				...bootcamp,
				title: bootcamp.title || `BOOTCAMP №${bootcamp.id}`,
				activeCount: bootcamp.devices.filter((device) => deviceStatusTone(device) === "success").length,
				rows: bootcamp.devices
					.filter((device) => matchesDeviceFilter(device, props.filter))
					.map((device) => ({
						...device,
						status: toBadge(device.status),
						booking: toBadge(device.booking),
					})),
			}))
			.filter((section) => section.rows.length > 0)
	);

	const columns = [
		{ key: "name", label: "Устройство", strong: true, align: "start", sortable: false },
		{ key: "status", label: "Статус", width: 144, align: "start" },
		{ key: "booking", label: "Бронь", width: 144, align: "start", sortable: false },
		{ key: "client", label: "Клиент", align: "start", sortable: false },
		{ key: "tariff", label: "Тариф", align: "start", sortable: false },
		{ key: "start", label: "Начало", width: 104, align: "end" },
		{ key: "end", label: "Окончание", width: 104, align: "end", sortable: false },
		{ key: "app", label: "Приложение", align: "start", sortable: false },
		{ key: "actions", label: "", width: 48, align: "end", sortable: false },
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
	.devices-section {
		border-radius: 14px;
		min-width: 0;
		&__header {
			min-height: 56px;
			padding-inline: 10px 12px;
		}
		&__title {
			font-size: 16px;
			line-height: 24px;
			font-weight: 700 !important;
		}
		&__name {
			font-size: 16px;
			line-height: 24px;
			letter-spacing: -0.4px;
		}
		&__summary {
			font-size: 12px;
			line-height: 16px;
		}
		&__booking {
			font-weight: 700;
			:deep(.s-badge__content) {
				display: flex;
				align-items: center;
				gap: 6px;
			}
			:deep(.s-badge__underlay) {
				background: rgb(var(--v-theme-blue)) !important;
			}
		}
		:deep(.s-data-table__row--selected .devices-section__name) {
			color: rgb(var(--v-theme-primary));
		}
		:deep(.s-data-table table) {
			min-width: 1100px;
		}
		:deep(.s-data-table .v-table__wrapper) {
			overflow-x: auto;
		}
		@media (max-width: 767px) {
			&__header {
				flex-wrap: wrap;
				padding-block: 12px;
			}
		}
	}
	.upcoming-bookings {
		font-size: 12px;
		border-radius: 10px;
		backdrop-filter: blur(8px);
	}
</style>
