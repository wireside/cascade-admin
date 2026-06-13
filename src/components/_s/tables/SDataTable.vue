<template>
	<div>
		<div v-if="loading">
			<v-skeleton-loader
				type="table"
				class="s-data-table"
				:height="tableHeight"
			/>
		</div>

		<v-data-table
			v-else
			:height="tableHeight"
			class="s-data-table overflow-hidden bg-transparent"
			hide-default-footer
			fixed-header
		>
			<thead class="bg-background">
				<tr :class="`bg-${tone} bg-opacity-20`">
					<th
						v-for="(col, idx) in columns"
						:key="col.key"
						:class="{
							'pl-6 text-start': idx === 0,
							'pr-6 text-end': idx === columns.length - 1,
							'text-center': idx > 0 && idx < columns.length - 1,
						}"
						:style="getColumnSizeStyle(idx)"
						class="text-white bg-transparent pa-0 px-6"
					>
						<span class="d-inline-flex align-center ga-1 opacity-60">
							<span>{{ col.label }}</span>
							<v-icon
								icon="mdi-unfold-more-horizontal"
								size="14"
							/>
						</span>
					</th>
				</tr>
			</thead>

			<tbody>
				<v-hover
					v-for="({ row, rowId }, rowIdx) in tableRows"
					:key="rowId"
				>
					<template v-slot="{ isHovering, props }">
						<v-menu
							:open-on-hover="hasRowHoverPopup"
							:open-delay="rowHoverPopupDelay"
							:close-delay="rowHoverPopupCloseDelay"
							:close-on-content-click="false"
							:target="hoverPopupTarget"
							location="end"
							:offset="rowHoverPopupOffset"
							transition="fade-transition"
							content-class="s-data-table__hover-popup-overlay"
						>
							<template #activator="{ props: menuProps }">
								<tr
									v-bind="mergeProps(props, menuProps)"
									:class="{
										[hoverClass]: isHovering && !isSelected(rowId),
										[`bg-${tone} bg-opacity-10`]: isSelected(rowId),
									}"
									class="cursor-pointer"
									@click.left="toggleRowSelection(row, rowId)"
									@contextmenu.prevent="onRowRightClick($event, row, rowIdx)"
									@mouseenter="onRowMouseEnter"
								>
									<td
										v-for="(col, colIdx) in columns"
										:key="col.key"
										:style="getColumnSizeStyle(colIdx)"
										:class="{
											'font-weight-medium': col.strong,
											'pl-6 text-start': colIdx === 0,
											'pr-6 text-end': colIdx === columns.length - 1,
											'text-center': colIdx > 0 && colIdx < columns.length - 1,
										}"
									>
										<slot
											:name="`cell-${col.key}`"
											:row="row"
											:value="row[col.key]"
										>
											<template v-if="isBadgeValue(row[col.key])">
												<s-badge
													:label="row[col.key].label"
													:tone="row[col.key].tone"
												/>
											</template>
											<template v-else>
												{{ row[col.key] || "—" }}
											</template>
										</slot>
									</td>
								</tr>
							</template>

							<slot
								name="row-hover-popup"
								:row="row"
								:row-idx="rowIdx"
								:row-id="rowId"
								:is-hovering="isHovering"
								:is-selected="isSelected(rowId)"
							/>
						</v-menu>
					</template>
				</v-hover>
			</tbody>
		</v-data-table>

		<div
			v-if="hasRowHoverPopup"
			ref="hoverPopupTarget"
			:style="hoverPopupTargetStyle"
		/>
	</div>
</template>

<script setup>
	import { mergeProps, useSlots } from "vue";

	const selectedRows = defineModel({
		type: Array,
		default: [],
	});

	const props = defineProps({
		columns: {
			type: Array,
			required: true,
		},
		rows: {
			type: Array,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		tableHeight: {
			type: [String, Number],
			default: "312",
		},
		tone: {
			type: String,
			default: "primary",
		},
		hoverClass: {
			type: String,
			default: "bg-background",
		},
		select: {
			type: Boolean,
			default: false,
		},
		rowHoverPopupDelay: {
			type: [Number, String],
			default: 250,
		},
		rowHoverPopupCloseDelay: {
			type: [Number, String],
			default: 120,
		},
		rowHoverPopupOffset: {
			type: [Array, Number],
			default: () => [12, 0],
		},
	});

	const emit = defineEmits(["row-select", "row-unselect", "row-contextmenu"]);
	const slots = useSlots();

	const selectedRowIds = ref([]);

	const hoverPopupTarget = ref(null);

	const hoverPopupPosition = ref({
		x: 0,
		y: 0,
	});

	const tableRows = computed(() =>
		props.rows.map((row, rowId) => ({
			row,
			rowId,
		}))
	);

	const hasRowHoverPopup = computed(() => !!slots["row-hover-popup"]);

	const hoverPopupTargetStyle = computed(() => ({
		position: "fixed",
		left: `${hoverPopupPosition.value.x}px`,
		top: `${hoverPopupPosition.value.y}px`,
		width: "1px",
		height: "1px",
		pointerEvents: "none",
		opacity: 0,
	}));

	const resolveColumnWidth = (index) => {
		const col = props.columns[index] || {};

		if (col.width !== undefined && col.width !== null) {
			if (typeof col.width === "number") return `${col.width}px`;
			if (typeof col.width === "string") return col.width;
			if (typeof col.width === "object") {
				const chars = col.width.chars || col.width.maxChars;
				if (chars) return `${chars}ch`;
				return undefined;
			}
		}

		if (col.maxChars) return `${col.maxChars}ch`;

		return undefined;
	};

	const getColumnSizeStyle = (index) => {
		const resolved = resolveColumnWidth(index);
		if (!resolved) return {};
		return { width: resolved, maxWidth: resolved };
	};

	const isBadgeValue = (value) => {
		return value && typeof value === "object" && "label" in value;
	};

	const syncSelectedRows = () => {
		selectedRows.value = tableRows.value
			.filter(({ rowId }) => selectedRowIds.value.includes(rowId))
			.map(({ row }) => row);
	};

	const isSelected = (rowId) => {
		return selectedRowIds.value.includes(rowId);
	};

	const toggleRowSelection = (row, rowId) => {
		const { select } = props;
		if (!select) return;

		if (isSelected(rowId)) {
			selectedRowIds.value = selectedRowIds.value.filter((selectedRowId) => selectedRowId !== rowId);
			syncSelectedRows();
			emit("row-unselect", row);
		} else {
			selectedRowIds.value = [...selectedRowIds.value, rowId];
			syncSelectedRows();
			emit("row-select", row);
		}
	};

	const onRowMouseEnter = (event) => {
		hoverPopupPosition.value.x = event.clientX;
		hoverPopupPosition.value.y = event.clientY;
	};

	const onRowRightClick = (event, row, rowIdx) => {
		emit("row-contextmenu", { event, row, rowIdx });
	};
</script>

<style scoped lang="scss">
	.s-data-table {
		border-radius: 10px !important;
	}

	:deep(.s-data-table > .v-data-table__wrapper),
	:deep(.s-data-table .v-data-table__wrapper) {
		border-radius: inherit;
		overflow: hidden;
	}

	:deep(.s-data-table table) {
		table-layout: fixed;
		width: 100%;
	}

	:deep(.s-data-table th),
	:deep(.s-data-table td) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.s-data-table__hover-popup-overlay) {
		pointer-events: none;
	}
</style>
