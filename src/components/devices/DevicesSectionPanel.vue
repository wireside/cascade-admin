<template>
	<s-dashboard-panel>
		<div class="d-flex align-center justify-space-between mb-4">
			<div class="d-flex align-center ga-2 flex-wrap">
				<v-chip
					size="small"
					variant="flat"
					class="font-weight-medium rounded-md px-3 py-1"
					:color="section.tone || 'primary'"
				>
					{{ section.badge }}
				</v-chip>
				<span class="text-white text-subtitle-1 font-weight-semibold">{{ section.title }}</span>
			</div>

			<div class="d-flex align-center flex-wrap ga-3">
				<div class="d-flex align-center ga-2 text-medium-emphasis">
					<v-checkbox-btn
						:model-value="false"
						density="compact"
					/>
					<span class="text-body-2">Выбрать все</span>
				</div>

				<div class="d-flex align-center ga-2">
					<s-btn-icon
						width="42px"
						height="42px"
						icon="mdi:cog-outline"
						variant="plain"
						class="bg-surface bg-opacity-60 border"
						title="Настройки устройства"
					/>
					<s-btn-icon
						icon="mdi:delete"
						rounded="md"
						variant="tonal"
						height="42px"
						width="42px"
						bg-color="red"
						color="red"
					/>
				</div>
			</div>
		</div>

		<s-data-table
			v-model="selectedRows"
			:columns="columns"
			:rows="tableRows"
			:loading="loading"
			:tone="section.tone"
			select
			hover-class="bg-background"
			table-height="257"
			@row-contextmenu="openRowMenu"
		/>

		<device-control
			v-model:visible="contextMenu.show"
			:x="contextMenu.x"
			:y="contextMenu.y"
			:menu-target="contextMenu.target"
			:row="contextMenu.row"
			@deposit-up="(row) => depositModalRow = row"
		/>

		<deposit-modal
			v-if="depositModalOpen"
			v-model:modal-open="depositModalOpen"
			:client-name="'Алексей'"
			:username="depositModalRow.client"
			:start-date="depositModalRow.start"
			:end-date="depositModalRow.end"
		/>
	</s-dashboard-panel>
</template>

<script setup>
	const props = defineProps({
		section: {
			type: Object,
			required: true,
		},
	});

	const testStore = useTestStore();

	let depositModalRow = $ref(null);

	const selectedRows = $ref([]);

	const contextMenu = $ref({
		show: false,
		x: 0,
		y: 0,
		target: null,
		row: null,
		rowIdx: null,
	});

	let depositModalOpen = $computed({
		get() {
			return !!depositModalRow
		},
		set(value) {
			if (!value) {
				depositModalRow = null;
			}
		}
	})

	const loading = $computed(() => testStore.loading);

	const tableRows = $computed(() => {
		return props.section.rows.map((row) => ({
			...row,
			status: toBadge(row.status),
			booking: toBadge(row.booking),
		}));
	});

	const columns = [
		{ key: "index", label: "№", width: { maxChars: 4 }, align: "left", strong: true },
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
	.s-dashboard-panel {
		padding-bottom: 0;
		padding-top: 18px;
	}
</style>
