<template>
	<div>
		<slot
			v-if="showToolbar"
			name="toolbar"
			v-bind="paginationSlotProps"
		>
			<div
				v-if="pagination"
				class="d-flex align-center justify-end mb-4"
			>
				<s-data-table-pagination
					:page="page"
					:total-pages="totalPages"
					:tone="tone"
					@update:page="setPage"
				/>
			</div>
		</slot>

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
						v-if="selectable && showSelectionColumn"
						:style="selectionColumnStyle"
						class="s-data-table__selection-cell text-center bg-transparent pa-0"
					>
						<v-btn
							v-if="selectionMode === 'multiple'"
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
						:class="[
							getColumnAlignmentClass(col, idx),
							{
								'pl-5': idx === 0,
								'pr-5': idx === columns.length - 1,
								'pr-1 pr-lg-2 pr-xl-6': idx < columns.length - 1,
								'cursor-pointer': isColumnSortable(col),
							},
						]"
						:style="getColumnSizeStyle(idx)"
						class="text-white bg-transparent pa-0"
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
					<template v-slot="{ isHovering, props: hoverProps }">
						<tr
							v-bind="hoverProps"
							:tabindex="selectable ? 0 : undefined"
							:aria-selected="selectable ? isSelected(rowId) : undefined"
							:class="{
								[hoverClass]: isHovering && !isSelected(rowId),
								[`bg-${tone} bg-opacity-10`]: isSelected(rowId),
							}"
							class="cursor-pointer"
							@click.left="onRowClick($event, row, rowId)"
							@keydown.enter.self.prevent="toggleRowSelection(row, rowId)"
							@keydown.space.self.prevent="toggleRowSelection(row, rowId)"
							@contextmenu.prevent="onRowRightClick($event, row, rowIdx)"
						>
							<td
								v-if="selectable && showSelectionColumn"
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
								:class="[
									getColumnAlignmentClass(col, colIdx),
									{
										'pl-5': colIdx === 0,
										'pr-5': colIdx === columns.length - 1,
										'pr-1 pr-lg-2 pr-xl-6': colIdx < columns.length - 1,
										'font-weight-medium': col.strong,
										's-data-table__cell--bordered': rowBorder,
									},
								]"
								class="text-white"
							>
								<span class="d-inline-flex align-center">
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

									<v-menu
										v-if="hasCellHoverPopup(col)"
										:open-delay="cellHoverPopupDelay"
										:close-delay="cellHoverPopupCloseDelay"
										:close-on-content-click="false"
										:offset="cellHoverPopupOffset"
										activator="parent"
										open-on-hover
										location="end"
										transition="fade-transition"
										content-class="s-data-table__hover-popup-overlay"
									>
										<slot
											:name="getCellHoverPopupSlotName(col)"
											:row="row"
											:row-idx="rowIdx"
											:row-id="rowId"
											:value="row[col.key]"
											:is-selected="isSelected(rowId)"
										/>
									</v-menu>
								</span>
							</td>
						</tr>
					</template>
				</v-hover>
			</tbody>
		</v-data-table>

		<slot
			v-if="showFooter"
			name="footer"
			v-bind="paginationSlotProps"
		>
			<div
				v-if="pagination"
				class="d-flex align-center justify-end mt-4"
			>
				<s-data-table-pagination
					:page="page"
					:total-pages="totalPages"
					:tone="tone"
					@update:page="setPage"
				/>
			</div>
		</slot>
	</div>
</template>

<script setup>
	import { useSlots } from "vue";
	import { useDisplay } from "vuetify";
	import SDataTablePagination from "./SDataTablePagination.vue";

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
		showSelectionColumn: {
			type: Boolean,
			default: true,
		},
		selectionMode: {
			type: String,
			default: "multiple",
			validator: (value) => ["multiple", "single"].includes(value),
		},
		cellHoverPopupDelay: {
			type: [Number, String],
			default: 250,
		},
		cellHoverPopupCloseDelay: {
			type: [Number, String],
			default: 120,
		},
		cellHoverPopupOffset: {
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
		paginationLocation: {
			type: String,
			default: "footer",
			validator: (value) => ["footer", "toolbar"].includes(value),
		},
		itemsPerPage: {
			type: Number,
			default: 10,
		},
	});

	const emit = defineEmits(["row-select", "row-unselect", "row-contextmenu"]);
	const slots = useSlots();
	const { lgAndUp, xlAndUp } = useDisplay();

	const selectedRowIds = ref([]);
	const tableRef = ref(null);

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

	const showToolbar = computed(() => !!slots.toolbar || (props.pagination && props.paginationLocation === "toolbar"));
	const showFooter = computed(() => !!slots.footer || (props.pagination && props.paginationLocation === "footer"));
	const resolvedHeaderTone = computed(() => props.headerTone || props.tone);
	const selectedButtonTextClass = computed(() => `text-on-${props.tone}`);

	const getCellHoverPopupSlotName = (col) => `cell-${col.key}-hover-popup`;
	const hasCellHoverPopup = (col) => !!slots[getCellHoverPopupSlotName(col)];

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

	const selectionColumnWidth = $computed(() => (xlAndUp.value ? 58 : 42));
	const columnRightPadding = $computed(() => (xlAndUp.value ? 24 : lgAndUp.value ? 8 : 4));

	const selectionColumnStyle = computed(() => ({
		width: `${selectionColumnWidth}px`,
		minWidth: `${selectionColumnWidth}px`,
		maxWidth: `${selectionColumnWidth}px`,
		paddingInline: xlAndUp.value ? "20px 12px" : "8px",
	}));

	const resolveColumnWidth = (index) => {
		const col = props.columns[index] || {};
		const leftPadding = index === 0 ? 20 : 0;
		const rightPadding = index === props.columns.length - 1 ? 20 : columnRightPadding;
		const horizontalPadding = leftPadding + rightPadding;

		if (col.width !== undefined && col.width !== null) {
			if (typeof col.width === "number") return `${col.width}px`;
			if (typeof col.width === "string") return col.width;
			if (typeof col.width === "object") {
				const chars = col.width.chars || col.width.maxChars;
				if (chars) return `calc(${chars}ch + ${horizontalPadding}px)`;
				return undefined;
			}
		}

		if (col.maxChars) return `calc(${col.maxChars}ch + ${horizontalPadding}px)`;

		return undefined;
	};

	const getColumnSizeStyle = (index) => {
		const resolved = resolveColumnWidth(index);
		if (!resolved) return {};
		return { width: resolved, maxWidth: resolved };
	};

	const getColumnAlignmentClass = (col, index) => {
		if (["start", "center", "end"].includes(col.align)) {
			return `text-${col.align}`;
		}

		if (index === 0) return "text-start";
		if (index === props.columns.length - 1) return "text-end";
		return "text-center";
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
		if (typeof props.tableHeight === "string" && props.tableHeight.trim().toLowerCase() === "auto") {
			return false;
		}

		const resolvedTableHeight = toSizeNumber(props.tableHeight);

		if (!resolvedTableHeight) {
			return true;
		}

		const availableBodyHeight = resolvedTableHeight - tableHeaderHeight;
		return resolvedRowHeight.value * displayedTableRows.value.length > availableBodyHeight;
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
		const nextSelectedRowIds = selectedRows.value
			.map((row) => resolveSelectedRowId(row))
			.filter((rowId) => sourceTableRows.value.some((tableRow) => tableRow.rowId === rowId));

		selectedRowIds.value = props.selectionMode === "single" ? nextSelectedRowIds.slice(0, 1) : nextSelectedRowIds;

		if (props.selectionMode === "single" && selectedRows.value.length !== selectedRowIds.value.length) {
			syncSelectedRows();
		}
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
		} else if (props.selectionMode === "single") {
			selectOnlyRow(row, rowId);
		} else {
			selectedRowIds.value = [...selectedRowIds.value, rowId];
			syncSelectedRows();
			emit("row-select", row);
		}
	};

	const selectOnlyRow = (row, rowId) => {
		const previouslySelectedRows = sourceTableRows.value
			.filter(({ rowId: selectedRowId }) => selectedRowIds.value.includes(selectedRowId) && selectedRowId !== rowId)
			.map(({ row: selectedRow }) => selectedRow);
		const rowWasSelected = isSelected(rowId);

		selectedRowIds.value = [rowId];
		syncSelectedRows();

		previouslySelectedRows.forEach((selectedRow) => emit("row-unselect", selectedRow));
		if (!rowWasSelected) emit("row-select", row);
	};

	const onRowClick = (event, row, rowId) => {
		if (!props.selectable) return;

		if (props.selectionMode === "multiple" && (event.ctrlKey || event.metaKey)) {
			toggleRowSelection(row, rowId);
			return;
		}

		if (isSelected(rowId) && selectedRowIds.value.length === 1) {
			toggleRowSelection(row, rowId);
			return;
		}

		selectOnlyRow(row, rowId);
	};

	const toggleAllSelection = () => {
		if (!props.selectable || props.selectionMode === "single") return;

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

	const paginationSlotProps = computed(() => ({
		page: page.value,
		itemsPerPage: props.itemsPerPage,
		totalItems: totalItems.value,
		totalPages: totalPages.value,
		firstItemIndex: firstItemIndex.value,
		lastItemIndex: lastItemIndex.value,
		visibleRows: displayedRows.value,
		setPage,
		previousPage,
		nextPage,
	}));

	const onRowRightClick = (event, row, rowIdx) => {
		emit("row-contextmenu", { event, row, rowIdx });
	};

	watch(
		() => [props.rows, props.filterKey, props.selectionMode],
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

	:deep(.s-data-table tbody tr:focus-visible) {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: -2px;
	}

	:deep(.s-data-table th),
	:deep(.s-data-table td) {
		border-bottom: 0 !important;
		overflow: hidden;
		text-overflow: clip !important;
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
