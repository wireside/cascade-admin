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
					v-for="(row, rowIdx) in rows"
					:key="rowIdx"
				>
					<template v-slot="{ isHovering, props }">
						<tr
							v-bind="props"
							:class="{
								[hoverClass]: isHovering,
								[`bg-${tone} bg-opacity-10`]: isSelected(row),
							}"
							class="cursor-pointer"
							@click.left="toggleRowSelection(row)"
							@contextmenu.prevent="onRowRightClick($event, row, rowIdx)"
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
										<v-chip
											:color="row[col.key].color"
											:variant="row[col.key].variant || 'tonal'"
											:class="`bg-${row[col.key].color}`"
											size="small"
											class="rounded-md bg-opacity-20 pa-0"
										>
											{{ row[col.key].label }}
										</v-chip>
									</template>
									<template v-else>
										{{ row[col.key] || "—" }}
									</template>
								</slot>
							</td>
						</tr>
					</template>
				</v-hover>
			</tbody>
		</v-data-table>
	</div>
</template>

<script setup>
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
		selectKey: {
			type: [Function, String],
			default: () =>
				function (row) {
					return Object.keys(row)[0];
				},
		},
	});

	const emit = defineEmits(["row-select", "row-unselect", "row-contextmenu"]);

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

	const getRowKey = (row) => (typeof props.selectKey === "function" ? props.selectKey(row) : props.selectKey);

	const isSelected = (row) => {
		return selectedRows.value.map((s) => s[getRowKey(row)]).includes(row[getRowKey(row)]);
	};

	const toggleRowSelection = (row) => {
		const { select } = props;
		if (!select) return;

		if (isSelected(row)) {
			selectedRows.value = selectedRows.value.filter((s) => s[getRowKey(s)] !== row[getRowKey(row)]);
			emit("row-unselect", row);
		} else {
			selectedRows.value = [...selectedRows.value, row];
			emit("row-select", row);
		}
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

	:deep(.s-data-table .v-chip) {
		line-height: 100%;
		font-size: 12px;
		padding: 7px 10px !important;
	}
</style>
