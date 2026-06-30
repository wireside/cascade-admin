<template>
	<div>
		<div v-if="loading">
			<v-skeleton-loader
				type="table"
				:height="tableHeight"
				:min-height="tableHeight"
				:max-height="tableHeight"
				class="overflow-hidden"
			/>
		</div>

		<v-data-table
			v-else
			ref="tableRef"
			:height="tableHeight"
			class="s-data-table overflow-hidden bg-transparent"
			:class="{ 's-data-table--scrollable': tableBodyScrollable }"
			hide-default-footer
			fixed-header
			@wheel="onTableWheel"
		>
			<thead class="bg-background">
				<tr :class="`bg-${resolvedHeaderTone} bg-opacity-${headerOpacity}`">
					<th
						v-if="selectable"
						:style="selectionColumnStyle"
						class="s-data-table__selection-cell text-center bg-transparent pa-0"
					>
						<v-btn
							icon
							variant="outlined"
							color="white"
							rounded="md"
							size="18"
							class="text-white opacity-50"
							:aria-label="allRowsSelected ? 'Снять выделение со всех строк' : 'Выделить все строки'"
							@click.stop="toggleAllSelection"
						>
							<v-icon
								:icon="selectionHeaderIcon"
								size="12.6"
							/>
						</v-btn>
					</th>
					<th
						v-for="(col, idx) in columns"
						:key="col.key"
						:aria-sort="getColumnAriaSort(col)"
						:class="{
							'pl-6 text-start': idx === 0 && !selectable,
							'pr-6 text-end': idx === columns.length - 1,
							'text-center': idx > 0 && idx < columns.length - 1,
							'cursor-pointer': isColumnSortable(col),
						}"
						:style="getColumnSizeStyle(idx)"
						class="text-white bg-transparent pa-0 px-6"
						@click="toggleColumnSort(col)"
					>
						<span class="d-inline-flex align-center ga-1 opacity-50">
							<span>{{ col.label }}</span>
							<v-icon
								:icon="getColumnSortIcon(col)"
								size="16"
							/>
						</span>
					</th>
				</tr>
			</thead>

			<tbody>
				<v-hover
					v-for="({ row, rowId }, rowIdx) in displayedTableRows"
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
										v-if="selectable"
										:style="selectionColumnStyle"
										:class="{ 's-data-table__cell--bordered': rowBorder }"
										class="s-data-table__selection-cell"
									>
										<v-btn
											icon
											:variant="isSelected(rowId) ? 'flat' : 'outlined'"
											:color="isSelected(rowId) ? tone : 'white'"
											rounded="lg"
											size="18"
											:class="isSelected(rowId) ? selectedButtonTextClass : 'text-white opacity-50'"
											:aria-label="isSelected(rowId) ? 'Снять выделение со строки' : 'Выделить строку'"
											@click.stop="toggleRowSelection(row, rowId)"
										>
											<v-icon
												v-if="isSelected(rowId)"
												icon="mdi-check"
												size="12.6"
											/>
										</v-btn>
									</td>
									<td
										v-for="(col, colIdx) in columns"
										:key="col.key"
										:style="getColumnSizeStyle(colIdx)"
										:class="{
											'font-weight-medium': col.strong,
											'pl-6 text-start': colIdx === 0 && !selectable,
											'pr-6 text-end': colIdx === columns.length - 1,
											'text-center': colIdx > 0 && colIdx < columns.length - 1,
											's-data-table__cell--bordered': rowBorder,
										}"
										class="text-white"
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

		<slot
			v-if="showFooter"
			name="footer"
			:page="page"
			:items-per-page="itemsPerPage"
			:total-items="totalItems"
			:total-pages="totalPages"
			:first-item-index="firstItemIndex"
			:last-item-index="lastItemIndex"
			:visible-rows="displayedRows"
			:set-page="setPage"
			:previous-page="previousPage"
			:next-page="nextPage"
		>
			<div
				v-if="pagination"
				class="d-flex align-center justify-end ga-1 mt-4"
			>
				<v-btn
					icon="mdi-chevron-left"
					variant="text"
					color="white"
					size="32"
					:disabled="page <= 1"
					@click="previousPage"
				/>
				<v-btn
					v-for="pageNumber in paginationPages"
					:key="pageNumber"
					:variant="pageNumber === page ? 'flat' : 'text'"
					:color="pageNumber === page ? tone : 'white'"
					size="32"
					@click="setPage(pageNumber)"
				>
					{{ pageNumber }}
				</v-btn>
				<v-btn
					icon="mdi-chevron-right"
					variant="text"
					color="white"
					size="32"
					:disabled="page >= totalPages"
					@click="nextPage"
				/>
			</div>
		</slot>
	</div>
</template>

<script setup>
	import { mergeProps, useSlots } from "vue";

	const selectedRows = defineModel({
		type: Array,
		default: [],
	});
	const page = defineModel("page", {
		type: Number,
		default: 1,
	});
	const sortBy = defineModel("sortBy", {
		type: String,
		default: "",
	});
	const sortDirection = defineModel("sortDirection", {
		type: String,
		default: "asc",
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
		filterKey: {
			type: String,
			default: "id",
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
		headerTone: {
			type: String,
			default: null,
		},
		headerOpacity: {
			type: [String, Number],
			default: 20,
		},
		hoverClass: {
			type: String,
			default: "bg-background",
		},
		selectable: {
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
		rowHeight: {
			type: [String, Number],
			default: 50,
		},
		rowBorder: {
			type: Boolean,
			default: false,
		},
		search: {
			type: String,
			default: "",
		},
		searchKeys: {
			type: Array,
			default: () => [],
		},
		pagination: {
			type: Boolean,
			default: false,
		},
		itemsPerPage: {
			type: Number,
			default: 10,
		},
	});

	const emit = defineEmits(["row-select", "row-unselect", "row-contextmenu"]);
	const slots = useSlots();

	const selectedRowIds = ref([]);
	const tableRef = ref(null);

	const hoverPopupTarget = ref(null);

	const hoverPopupPosition = ref({
		x: 0,
		y: 0,
	});

	const resolveRowId = (row, rowIdx) => {
		if (!props.filterKey) {
			return rowIdx;
		}

		const rowKeyValue = row?.[props.filterKey];

		if (rowKeyValue === undefined || rowKeyValue === null || rowKeyValue === "") {
			return rowIdx;
		}

		return rowKeyValue;
	};

	const resolveSelectedRowId = (row) => {
		if (props.filterKey) {
			const rowKeyValue = row?.[props.filterKey];

			if (rowKeyValue !== undefined && rowKeyValue !== null && rowKeyValue !== "") {
				return rowKeyValue;
			}
		}

		return props.rows.indexOf(row);
	};

	const sourceTableRows = computed(() =>
		props.rows.map((row, rowIdx) => ({
			row,
			rowId: resolveRowId(row, rowIdx),
		}))
	);

	const hasRowHoverPopup = computed(() => !!slots["row-hover-popup"]);
	const showFooter = computed(() => props.pagination || !!slots.footer);
	const resolvedHeaderTone = computed(() => props.headerTone || props.tone);
	const selectedButtonTextClass = computed(() => `text-on-${props.tone}`);

	const hoverPopupTargetStyle = computed(() => ({
		position: "fixed",
		left: `${hoverPopupPosition.value.x}px`,
		top: `${hoverPopupPosition.value.y}px`,
		width: "1px",
		height: "1px",
		pointerEvents: "none",
		opacity: 0,
	}));

	const tableHeaderHeight = 38;

	const toSizeNumber = (value) => {
		if (typeof value === "number") {
			return value;
		}

		const parsed = Number.parseFloat(value);
		return Number.isFinite(parsed) ? parsed : null;
	};

	const resolvedRowHeight = computed(() => toSizeNumber(props.rowHeight) || 50);
	const resolvedRowHeightStyle = computed(() => `${resolvedRowHeight.value}px`);

	const columnHorizontalPadding = 48;
	const selectionColumnWidth = 58;

	const selectionColumnStyle = computed(() => ({
		width: `${selectionColumnWidth}px`,
		minWidth: `${selectionColumnWidth}px`,
		maxWidth: `${selectionColumnWidth}px`,
	}));

	const resolveColumnWidth = (index) => {
		const col = props.columns[index] || {};

		if (col.width !== undefined && col.width !== null) {
			if (typeof col.width === "number") return `${col.width}px`;
			if (typeof col.width === "string") return col.width;
			if (typeof col.width === "object") {
				const chars = col.width.chars || col.width.maxChars;
				if (chars) return `calc(${chars}ch + ${columnHorizontalPadding}px)`;
				return undefined;
			}
		}

		if (col.maxChars) return `calc(${col.maxChars}ch + ${columnHorizontalPadding}px)`;

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

	const getCellValue = (row, key) => {
		const value = row?.[key];
		return isBadgeValue(value) ? value.label : value;
	};

	const normalizeValue = (value) => {
		return String(value ?? "")
			.trim()
			.toLocaleLowerCase("ru-RU");
	};

	const searchableKeys = computed(() => {
		if (props.searchKeys.length > 0) {
			return props.searchKeys;
		}

		return props.columns.map((col) => col.key);
	});

	const filteredTableRows = computed(() => {
		const query = normalizeValue(props.search);

		if (!query) {
			return sourceTableRows.value;
		}

		return sourceTableRows.value.filter(({ row }) => {
			return searchableKeys.value.some((key) => normalizeValue(getCellValue(row, key)).includes(query));
		});
	});

	const activeSortColumn = computed(() => {
		if (!sortBy.value) {
			return null;
		}

		return props.columns.find((col) => (col.sortKey || col.key) === sortBy.value) || null;
	});

	const sortedTableRows = computed(() => {
		const sortColumn = activeSortColumn.value;

		if (!sortColumn) {
			return filteredTableRows.value;
		}

		const direction = sortDirection.value === "desc" ? -1 : 1;
		const key = sortColumn.sortKey || sortColumn.key;

		return [...filteredTableRows.value].sort((first, second) => {
			const firstValue = normalizeValue(getCellValue(first.row, key));
			const secondValue = normalizeValue(getCellValue(second.row, key));

			return firstValue.localeCompare(secondValue, "ru-RU", { numeric: true }) * direction;
		});
	});

	const totalItems = computed(() => sortedTableRows.value.length);

	const totalPages = computed(() => {
		if (!props.pagination) {
			return 1;
		}

		return Math.max(1, Math.ceil(totalItems.value / props.itemsPerPage));
	});

	const firstItemIndex = computed(() => {
		if (totalItems.value === 0) {
			return 0;
		}

		return props.pagination ? (page.value - 1) * props.itemsPerPage + 1 : 1;
	});

	const lastItemIndex = computed(() => {
		if (!props.pagination) {
			return totalItems.value;
		}

		return Math.min(page.value * props.itemsPerPage, totalItems.value);
	});

	const displayedTableRows = computed(() => {
		if (!props.pagination) {
			return sortedTableRows.value;
		}

		return sortedTableRows.value.slice(firstItemIndex.value - 1, lastItemIndex.value);
	});

	const displayedRows = computed(() => displayedTableRows.value.map(({ row }) => row));

	const tableBodyScrollable = computed(() => {
		const resolvedTableHeight = toSizeNumber(props.tableHeight);

		if (!resolvedTableHeight) {
			return true;
		}

		const availableBodyHeight = resolvedTableHeight - tableHeaderHeight;
		return resolvedRowHeight.value * displayedTableRows.value.length > availableBodyHeight;
	});

	const paginationPages = computed(() => {
		return Array.from({ length: totalPages.value }, (_, idx) => idx + 1);
	});

	const selectableRowIds = computed(() => displayedTableRows.value.map(({ rowId }) => rowId));

	const selectedVisibleRowCount = computed(() => {
		return selectedRowIds.value.filter((rowId) => selectableRowIds.value.includes(rowId)).length;
	});

	const selectedRowCount = computed(() => selectedVisibleRowCount.value);

	const allRowsSelected = computed(() => {
		return selectableRowIds.value.length > 0 && selectedRowCount.value === selectableRowIds.value.length;
	});

	const selectionHeaderIcon = computed(() => {
		return selectedRowCount.value > 0 ? "mdi-minus" : "mdi-plus";
	});

	const syncSelectedRows = () => {
		selectedRows.value = sourceTableRows.value
			.filter(({ rowId }) => selectedRowIds.value.includes(rowId))
			.map(({ row }) => row);
	};

	const syncSelectedRowIds = () => {
		selectedRowIds.value = selectedRows.value
			.map((row) => resolveSelectedRowId(row))
			.filter((rowId) => sourceTableRows.value.some((tableRow) => tableRow.rowId === rowId));
	};

	const isSelected = (rowId) => {
		return selectedRowIds.value.includes(rowId);
	};

	const toggleRowSelection = (row, rowId) => {
		const { selectable } = props;
		if (!selectable) return;

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

	const toggleAllSelection = () => {
		if (!props.selectable) return;

		if (selectedRowCount.value > 0) {
			selectedRowIds.value = selectedRowIds.value.filter((rowId) => !selectableRowIds.value.includes(rowId));
			syncSelectedRows();
			return;
		}

		selectedRowIds.value = [...new Set([...selectedRowIds.value, ...selectableRowIds.value])];
		syncSelectedRows();
	};

	const isColumnSortable = (col) => {
		return col.sortable !== false;
	};

	const toggleColumnSort = (col) => {
		if (!isColumnSortable(col)) return;

		const key = col.sortKey || col.key;

		if (sortBy.value !== key) {
			sortBy.value = key;
			sortDirection.value = "asc";
			page.value = 1;
			return;
		}

		sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
		page.value = 1;
	};

	const getColumnSortIcon = (col) => {
		const key = col.sortKey || col.key;

		if (sortBy.value !== key) {
			return "mdi-arrow-down";
		}

		return sortDirection.value === "asc" ? "mdi-arrow-up" : "mdi-arrow-down";
	};

	const getColumnAriaSort = (col) => {
		const key = col.sortKey || col.key;

		if (sortBy.value !== key) {
			return "none";
		}

		return sortDirection.value === "asc" ? "ascending" : "descending";
	};

	const getTableWrapper = () => {
		const tableElement = tableRef.value?.$el;
		return (
			tableElement?.querySelector?.(".v-table__wrapper") || tableElement?.querySelector?.(".v-data-table__wrapper")
		);
	};

	const scrollToTableTop = () => {
		nextTick(() => {
			const tableWrapper = getTableWrapper();
			tableWrapper?.scrollTo?.({
				top: 0,
				behavior: "smooth",
			});
		});
	};

	const onTableWheel = (event) => {
		if (!tableBodyScrollable.value || !event.deltaY) return;

		const tableWrapper = getTableWrapper();
		if (!tableWrapper) return;

		const maxScrollTop = tableWrapper.scrollHeight - tableWrapper.clientHeight;
		const isAtTop = tableWrapper.scrollTop <= 0;
		const isAtBottom = tableWrapper.scrollTop >= maxScrollTop - 1;
		const isScrollingPastTop = event.deltaY < 0 && isAtTop;
		const isScrollingPastBottom = event.deltaY > 0 && isAtBottom;

		if (isScrollingPastTop || isScrollingPastBottom) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	const setPage = (pageNumber) => {
		const nextPage = Math.min(Math.max(pageNumber, 1), totalPages.value);

		if (nextPage === page.value) {
			return;
		}

		page.value = nextPage;
		scrollToTableTop();
	};

	const previousPage = () => {
		setPage(page.value - 1);
	};

	const nextPage = () => {
		setPage(page.value + 1);
	};

	const onRowMouseEnter = (event) => {
		hoverPopupPosition.value.x = event.clientX;
		hoverPopupPosition.value.y = event.clientY;
	};

	const onRowRightClick = (event, row, rowIdx) => {
		emit("row-contextmenu", { event, row, rowIdx });
	};

	watch(
		() => [props.rows, props.filterKey],
		() => {
			syncSelectedRowIds();
			syncSelectedRows();
		},
		{
			deep: true,
			immediate: true,
		}
	);

	watch(
		selectedRows,
		() => {
			syncSelectedRowIds();
		},
		{
			deep: true,
		}
	);

	watch(
		() => [props.search, props.itemsPerPage],
		() => {
			page.value = 1;
		}
	);

	watch(
		() => totalPages.value,
		() => {
			setPage(page.value);
		}
	);
</script>

<style scoped lang="scss">
	.s-data-table {
		border-radius: 10px !important;

		&__selection-cell {
			padding-inline: 20px 12px;
			text-align: center;

			:deep(.v-btn) {
				border-radius: 5.4px;
			}
		}
	}

	:deep(.s-data-table > .v-data-table__wrapper),
	:deep(.s-data-table .v-data-table__wrapper),
	:deep(.s-data-table > .v-table__wrapper),
	:deep(.s-data-table .v-table__wrapper) {
		border-radius: inherit;
		overflow-x: hidden;
		overflow-y: hidden;
	}

	:deep(.s-data-table--scrollable > .v-data-table__wrapper),
	:deep(.s-data-table--scrollable .v-data-table__wrapper),
	:deep(.s-data-table--scrollable > .v-table__wrapper),
	:deep(.s-data-table--scrollable .v-table__wrapper) {
		overflow-y: auto;
		overscroll-behavior: none;
		overscroll-behavior-y: none;
	}

	:deep(.s-data-table table) {
		table-layout: fixed;
		width: 100%;
	}

	:deep(.s-data-table th),
	:deep(.s-data-table td) {
		border-bottom: 0 !important;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:deep(.s-data-table td) {
		height: v-bind(resolvedRowHeightStyle);
	}

	:deep(.s-data-table td.s-data-table__cell--bordered) {
		border-bottom: 1px solid rgba(var(--v-theme-white), 0.05) !important;
	}

	:global(.s-data-table__hover-popup-overlay) {
		pointer-events: none;
	}
</style>
