<template>
	<div
		ref="pageRoot"
		:class="{ 'payments-page--with-details': selectedPayment }"
		class="payments-page position-relative"
	>
		<s-data-table
			v-model="selectedPayments"
			v-model:page="page"
			v-model:sort-by="sortBy"
			v-model:sort-direction="sortDirection"
			:columns="columns"
			:rows="payments"
			:search="searchQuery"
			:search-keys="searchKeys"
			:items-per-page="itemsPerPage"
			:show-selection-column="false"
			filter-key="number"
			table-height="auto"
			tone="primary"
			header-tone="white"
			header-opacity="5"
			hover-class="bg-primary-hover bg-opacity-10"
			selection-mode="single"
			pagination-location="toolbar"
			class="payments-page__table"
			selectable
			pagination
		>
			<template #toolbar="{ page: currentPage, totalPages, setPage }">
				<payments-toolbar
					v-model:search="searchQuery"
					:payments-count="payments.length"
					:page="currentPage"
					:total-pages="totalPages"
					:floating="isToolbarFloating"
					@update:page="setPage"
					@refresh="resetPaymentsView"
				/>
			</template>

			<template #cell-paymentMethod="{ value }">
				<s-badge
					:tone="value.tone"
					bg-opacity="20"
				>
					<span class="d-inline-flex align-center ga-1">
						<v-icon
							:icon="value.icon"
							size="14"
						/>
						<span>{{ value.label }}</span>
					</span>
				</s-badge>
			</template>
		</s-data-table>

		<v-slide-x-reverse-transition>
			<payment-details-panel
				v-if="selectedPayment"
				:payment="selectedPayment"
				class="payments-page__details"
				@cancel="cancelPayment"
			/>
		</v-slide-x-reverse-transition>
	</div>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Платежи
  icon: mdi-timelapse
  parentTitle: Детализация
</route>

<script setup>
	import PaymentDetailsPanel from "@/components/payments/PaymentDetailsPanel.vue";
	import PaymentsToolbar from "@/components/payments/PaymentsToolbar.vue";
	import SDataTable from "@/components/_s/tables/SDataTable.vue";

	const itemsPerPage = 16;
	const searchKeys = ["number", "dateTime", "status", "category", "guest", "paymentMethod", "amountLabel"];

	const columns = [
		{ key: "number", label: "Номер", width: "12%", align: "start", strong: true },
		{ key: "dateTime", label: "Дата и время", width: "19%", align: "start", sortKey: "timestamp" },
		{ key: "status", label: "Статус", width: "13%", align: "start" },
		{ key: "category", label: "Категория", width: "13%", align: "start" },
		{ key: "guest", label: "Гость", width: "12%", align: "start", strong: true },
		{ key: "paymentMethod", label: "Способ оплаты", width: "18%", align: "start" },
		{ key: "amountLabel", label: "Сумма", width: "13%", align: "end", sortKey: "amount" },
	];

	const cardMethod = {
		label: "Карта",
		tone: "blue",
		icon: "mdi-credit-card-outline",
	};
	const cashMethod = {
		label: "Наличные",
		tone: "primary",
		icon: "mdi-cash",
	};

	const receiptTemplates = [
		[
			{ name: "Lit Energy Citrus Punch", quantity: 1, price: 180 },
			{ name: "Ротти с курицей и грибами", quantity: 1, price: 270 },
		],
		[
			{ name: "Monster Rio Punch", quantity: 1, price: 125 },
			{ name: "Буткемп 3 часа", quantity: 1, price: 540 },
		],
		[
			{ name: "Adrenaline Extra 0,449", quantity: 2, price: 205 },
			{ name: "Салат Куриный BBQ", quantity: 1, price: 310 },
		],
	];

	const exactPayments = [
		{
			id: 1,
			number: "34341231",
			dateTime: "24.08.2026 11:37",
			timestamp: Date.UTC(2026, 7, 24, 11, 37),
			status: { label: "Получен", tone: "primary" },
			category: "Товары",
			guest: "mufin",
			paymentMethod: { ...cardMethod },
			amount: 120,
			amountLabel: "120 ₽",
			detailsDate: "24 августа 2026 18:38",
			positions: receiptTemplates[0].map((position) => ({ ...position })),
			total: 450,
		},
		{
			id: 2,
			number: "34341232",
			dateTime: "24.08.2026 11:37",
			timestamp: Date.UTC(2026, 7, 24, 11, 37),
			status: { label: "Получен", tone: "primary" },
			category: "Товары",
			guest: "mufin",
			paymentMethod: { ...cardMethod },
			amount: 120,
			amountLabel: "120 ₽",
			detailsDate: "24 августа 2026 11:37",
			positions: [{ name: "Lit Energy Citrus Punch", quantity: 1, price: 120 }],
			total: 120,
		},
	];

	const guests = ["mufin", "alexeytopor", "SEVA2001", "PAPPY", "Гость"];
	const categories = ["Товары", "Тарифы", "Услуги"];

	const formatMoney = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
	const padNumber = (value) => String(value).padStart(2, "0");

	const createMockPayment = (index) => {
		const receipt = receiptTemplates[index % receiptTemplates.length].map((position) => ({ ...position }));
		const total = receipt.reduce((sum, position) => sum + position.price * position.quantity, 0);
		const day = 23 - (index % 18);
		const hour = 9 + (index % 12);
		const minute = (index * 7) % 60;
		const isCancelled = index % 19 === 0;
		const isRefunded = !isCancelled && index % 13 === 0;

		return {
			id: index + 1,
			number: String(34341231 + index),
			dateTime: `${padNumber(day)}.08.2026 ${padNumber(hour)}:${padNumber(minute)}`,
			timestamp: Date.UTC(2026, 7, day, hour, minute),
			status: isCancelled
				? { label: "Отменён", tone: "red" }
				: isRefunded
					? { label: "Возвращён", tone: "orange" }
					: { label: "Получен", tone: "primary" },
			category: categories[index % categories.length],
			guest: guests[index % guests.length],
			paymentMethod: { ...(index % 3 === 0 ? cashMethod : cardMethod) },
			amount: total,
			amountLabel: formatMoney(total),
			detailsDate: `${day} августа 2026 ${padNumber(hour)}:${padNumber(minute)}`,
			positions: receipt,
			total,
		};
	};

	let payments = $ref([
		...exactPayments,
		...Array.from({ length: 2046 }, (_, index) => createMockPayment(index + exactPayments.length)),
	]);
	let selectedPayments = $ref([]);
	let searchQuery = $ref("");
	let page = $ref(1);
	let sortBy = $ref("");
	let sortDirection = $ref("asc");
	let pageRoot = $ref(null);
	let isToolbarFloating = $ref(false);
	let pageScrollContainer = null;

	const selectedPayment = $computed(() => selectedPayments[0] || null);

	const updateToolbarFloating = () => {
		isToolbarFloating = (pageScrollContainer?.scrollTop || 0) > 8;
	};

	const scrollPageToTop = () => {
		pageScrollContainer?.scrollTo?.({
			top: 0,
			behavior: "smooth",
		});
	};

	const resetPaymentsView = () => {
		searchQuery = "";
		page = 1;
		sortBy = "";
		sortDirection = "asc";
		selectedPayments = [];
		scrollPageToTop();
	};

	const cancelPayment = (selected) => {
		const payment = payments.find((item) => item.number === selected.number);
		if (!payment) return;

		payment.status = { label: "Отменён", tone: "red" };
		selectedPayments = [payment];
	};

	watch(
		() => [page, searchQuery],
		([nextPage], [previousPage]) => {
			selectedPayments = [];

			if (nextPage !== previousPage) {
				nextTick(scrollPageToTop);
			}
		}
	);

	onMounted(() => {
		pageScrollContainer = pageRoot?.closest?.(".default-layout__page") || null;
		pageScrollContainer?.addEventListener("scroll", updateToolbarFloating, { passive: true });
		updateToolbarFloating();
	});

	onBeforeUnmount(() => {
		pageScrollContainer?.removeEventListener("scroll", updateToolbarFloating);
	});
</script>

<style scoped lang="scss">
	.payments-page {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		column-gap: 8px;
		align-items: start;
		align-content: start;
		min-height: calc(100dvh - 124px);

		:deep(.payments-page__table) {
			display: contents;
		}

		:deep(.payments-page__table .s-data-table) {
			grid-column: 1 / -1;
			grid-row: 2;
			width: 100%;
		}

		&__details {
			grid-column: 3;
			grid-row: 2;
			justify-self: end;
			align-self: stretch;
			width: 430px !important;
			height: auto !important;
			box-shadow: 0 16px 48px rgba(0, 0, 0, 0.24);
		}

		&--with-details {
			grid-template-columns: minmax(0, 1fr) auto 438px;

			:deep(.payments-page__table .s-data-table) {
				grid-column: 1 / 3;
			}
		}
	}

	@media (max-width: 1019px) {
		.payments-page {
			:deep(.payments-page__table .s-data-table),
			&__details {
				grid-row: 3;
			}
		}
	}
</style>
