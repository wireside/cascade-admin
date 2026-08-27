<template>
	<div class="payments-toolbar">
		<div class="payments-toolbar__main d-flex align-center ga-2 flex-wrap pb-4">
			<v-btn
				variant="flat"
				height="40"
				rounded="md"
				class="px-4 bg-white bg-opacity-5 text-white"
			>
				<v-icon
					icon="mdi-cash-multiple"
					size="16"
					class="mr-2"
				/>
				<span>Платежи</span>
				<s-badge
					:label="paymentsCount"
					tone="primary"
					bg-opacity="20"
					class="ml-2"
				/>
			</v-btn>

			<s-search-bar
				v-model="search"
				placeholder="Поиск платежей"
				width="233"
				height="40"
				class="payments-toolbar__search flex-grow-0"
			/>
		</div>

		<div
			:class="{ 'payments-toolbar__pagination--floating': floating }"
			class="payments-toolbar__pagination d-flex align-center rounded-md pa-1 mb-4"
		>
			<s-data-table-pagination
				:page="page"
				:total-pages="totalPages"
				@update:page="emit('update:page', $event)"
			/>
		</div>

		<v-btn
			icon="mdi-restore"
			variant="flat"
			size="40"
			rounded="md"
			class="payments-toolbar__refresh text-white bg-white bg-opacity-5 mb-4"
			aria-label="Сбросить фильтры платежей"
			@click="emit('refresh')"
		/>
	</div>
</template>

<script setup>
	import SDataTablePagination from "@/components/_s/tables/SDataTablePagination.vue";

	const search = defineModel("search", {
		type: String,
		default: "",
	});

	defineProps({
		paymentsCount: {
			type: Number,
			default: 0,
		},
		page: {
			type: Number,
			default: 1,
		},
		totalPages: {
			type: Number,
			default: 1,
		},
		floating: {
			type: Boolean,
			default: false,
		},
	});

	const emit = defineEmits(["update:page", "refresh"]);
</script>

<style scoped lang="scss">
	.payments-toolbar {
		display: contents;

		&__main {
			grid-column: 1;
			grid-row: 1;
			min-width: 0;
		}

		&__search {
			max-width: 233px;
		}

		&__pagination {
			position: sticky;
			top: 0;
			z-index: 6;
			grid-column: 2 / 4;
			grid-row: 1;
			justify-self: end;
			align-self: start;
			margin-inline-end: 48px;
			border: 0.5px solid transparent;
			transition:
				background-color 180ms ease,
				border-color 180ms ease;

			:deep(.s-data-table-pagination) {
				height: 36px;
			}

			&--floating {
				height: 56px;
				border-color: rgba(255, 255, 255, 0.1);
				background-color: #151515;
			}
		}

		&__refresh {
			grid-column: 3;
			grid-row: 1;
			justify-self: end;
		}
	}

	@media (max-width: 1019px) {
		.payments-toolbar {
			&__main {
				grid-column: 1 / -1;
				grid-row: 1;
			}

			&__pagination {
				grid-column: 1 / 4;
				grid-row: 2;
			}

			&__refresh {
				grid-column: 3;
				grid-row: 2;
			}
		}
	}
</style>
