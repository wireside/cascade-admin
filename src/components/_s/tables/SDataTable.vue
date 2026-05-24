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
			class="bg-transparent s-data-table"
			hide-default-footer
			fixed-header
		>
			<thead class="bg-background">
				<tr :class="`bg-${tone} bg-opacity-20`">
					<th
						v-for="(col, idx) in columns"
						:key="col.key"
						class="text-white bg-transparent pa-0 pl-6"
						:style="getHeaderCellStyle(idx)"
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
				<tr
					v-for="(row, rowIdx) in rows"
					:key="rowIdx"
				>
					<td
						v-for="(col, colIdx) in columns"
						:key="col.key"
						:style="getBodyCellStyle(colIdx, col)"
						:class="{ 'font-weight-medium': colIdx === 0 || col.strong, 'pl-6': colIdx === 0 }"
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
								{{ row[col.key] }}
							</template>
						</slot>
					</td>
				</tr>
			</tbody>
		</v-data-table>
	</div>
</template>

<script setup>
	import { computed } from "vue";

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
	});

	const totalFlex = computed(() => {
		return props.columns.reduce((sum, col) => sum + (col.flex || 1), 0);
	});

	const getColumnAlign = (index) => {
		const col = props.columns[index];
		if (col.align) return col.align;

		if (index === 0) return "left";
		if (index === props.columns.length - 1) return "right";
		return "center";
	};

	const getColumnWidth = (index) => {
		const flex = props.columns[index].flex || 1;
		const percentage = (flex / totalFlex.value) * 100;
		return `${percentage}%`;
	};

	const getHeaderCellStyle = (colIndex) => {
		const align = getColumnAlign(colIndex);
		const width = getColumnWidth(colIndex);

		return {
			width,
			textAlign: align,
			paddingRight: colIndex === props.columns.length - 1 ? "1.5rem" : 0,
		};
	};

	const getBodyCellStyle = (colIndex, col) => {
		const align = getColumnAlign(colIndex);
		const width = getColumnWidth(colIndex);

		return {
			width,
			textAlign: align,
			paddingRight: colIndex === props.columns.length - 1 ? "1.5rem" : 0,
		};
	};

	const isBadgeValue = (value) => {
		return value && typeof value === "object" && "label" in value;
	};
</script>

<style scoped lang="scss">
	.s-data-table {
		border-radius: 10px !important;
		overflow: hidden;
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
