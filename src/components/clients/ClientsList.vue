<template>
	<div class="clients-list d-flex flex-column ga-4">
		<clients-toolbar
			v-model:search="searchQuery"
			:clients-count="clients.length"
			:blocked-clients-count="blockedClientsCount"
			:has-selected-clients="selectedClients.length > 0"
		/>

		<s-data-table
			v-model="selectedClients"
			v-model:page="page"
			v-model:sort-by="sortBy"
			v-model:sort-direction="sortDirection"
			:loading="loading"
			:columns="columns"
			:rows="clients"
			:search="searchQuery"
			:search-keys="['nickname']"
			:items-per-page="itemsPerPage"
			:row-border="false"
			table-height="calc(100vh - 260px)"
			tone="primary"
			header-tone="white"
			header-opacity="5"
			hover-class="bg-primary-hover bg-opacity-10"
			selectable
			pagination
		>
			<template #footer="{ page: currentPage, totalPages, setPage, previousPage, nextPage }">
				<div class="d-flex align-center justify-space-between ga-4 mt-3 flex-wrap">
					<div class="text-white opacity-50">
						Общая сумма депозитов:
						<span class="text-white opacity-100 font-weight-bold">{{ formattedTotalDeposit }}</span>
					</div>

					<div class="d-flex align-center ga-1">
						<v-btn
							icon="mdi-chevron-left"
							variant="text"
							color="white"
							size="32"
							:disabled="currentPage <= 1"
							@click="previousPage"
						/>

						<template
							v-for="(item, itemIdx) in getPaginationItems(currentPage, totalPages)"
							:key="`${item}-${itemIdx}`"
						>
							<div
								v-if="item === paginationDivider"
								class="px-2 text-white opacity-50"
							>
								...
							</div>
							<v-btn
								v-else
								:variant="item === currentPage ? 'flat' : 'text'"
								:color="item === currentPage ? 'primary' : 'white'"
								rounded="md"
								size="32"
								:class="item === currentPage ? 'text-background' : 'text-white opacity-50'"
								@click="setPage(item)"
							>
								{{ item }}
							</v-btn>
						</template>

						<v-btn
							icon="mdi-chevron-right"
							variant="text"
							color="white"
							size="32"
							:disabled="currentPage >= totalPages"
							@click="nextPage"
						/>
					</div>
				</div>
			</template>
		</s-data-table>
	</div>
</template>

<script setup>
	const testStore = useTestStore();

	const selectedClients = ref([]);
	const searchQuery = ref("");
	const page = ref(1);
	const sortBy = ref("");
	const sortDirection = ref("asc");

	const loading = $computed(() => testStore.loading);

	const itemsPerPage = 16;
	const paginationDivider = "divider";

	const columns = [
		{ key: "nickname", label: "Никнейм", width: "12%", strong: true },
		{ key: "status", label: "Статус", width: "11%" },
		{ key: "phone", label: "Телефон", width: "15%", strong: true },
		{ key: "discount", label: "Скидка", width: "8%" },
		{ key: "deposit", label: "Депозит", width: "10%", sortKey: "depositAmount" },
		{ key: "group", label: "Группа", width: "10%" },
		{ key: "lastVisit", label: "Посл. визит", width: "12%", strong: true },
		{ key: "registration", label: "Регистрация", width: "16%" },
	];

	const clients = Array.from({ length: 128 }, (_, index) => {
		const isBlocked = index === 1;
		const depositAmount = index === 0 ? 1024.78 : 836.29;

		return {
			id: index + 1,
			nickname: "alexeytopor" + index,
			status: {
				label: isBlocked ? "Заблокирован" : "Активен",
				tone: isBlocked ? "red" : "primary",
			},
			phone: "+7 (999) 999-99-99",
			discount: {
				label: "0%",
				tone: "blue",
			},
			deposit: {
				label: formatMoney(depositAmount, false),
				tone: "purple",
			},
			depositAmount,
			group: "—",
			lastVisit: "15 июня 2026",
			registration: index % 7 === 0 ? "24 янв. 2025" : "24 янв. 2026",
			isBlocked,
		};
	});

	const blockedClientsCount = computed(() => clients.filter((client) => client.isBlocked).length);

	const totalDeposit = computed(() => {
		return clients.reduce((sum, client) => sum + client.depositAmount, 0);
	});

	const formattedTotalDeposit = computed(() => formatMoney(totalDeposit.value));

	function formatMoney(value, withCurrency = true) {
		return (
			new Intl.NumberFormat("ru-RU", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(value) + (withCurrency ? "₽" : "")
		);
	}

	function getPaginationItems(currentPage, totalPages) {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, index) => index + 1);
		}

		if (currentPage <= 4) {
			return [1, 2, 3, 4, 5, paginationDivider, totalPages];
		}

		if (currentPage >= totalPages - 3) {
			return [1, paginationDivider, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
		}

		return [1, paginationDivider, currentPage - 1, currentPage, currentPage + 1, paginationDivider, totalPages];
	}
</script>

<style scoped lang="scss">
	.clients-list {
		min-height: calc(100vh - 128px);
	}
</style>
