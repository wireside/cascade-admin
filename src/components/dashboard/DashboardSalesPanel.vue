<template>
	<article class="dashboard-card panel">
		<header class="panel__header">
			<div class="panel__title">
				<v-icon icon="mdi-history" size="18" />
				<span>Продажи</span>
			</div>
			<div class="panel__segmented">
				<button v-for="tab in salesTabs" :key="tab" type="button" class="panel__segment" :class="{ 'panel__segment--active': tab === activeSalesTab }">
					{{ tab }}
				</button>
			</div>
		</header>

		<div
			v-if="loading"
			class="dashboard-skeleton-table"
		>
			<v-skeleton-loader type="table" />
		</div>

		<div
			v-else
			class="table-shell"
		>
			<table class="dashboard-table">
				<thead>
					<tr>
						<th v-for="column in salesColumns" :key="column">
							<span>{{ column }}</span>
							<v-icon icon="mdi-swap-vertical" size="12" />
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in salesRows" :key="row.name">
						<td class="dashboard-table__strong">{{ row.name }}</td>
						<td>{{ row.quantity }}</td>
						<td>{{ row.amount }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</article>
</template>

<script setup>
	const salesTabs = ["Товары", "Тарифы", "Услуги"];
	const activeSalesTab = "Товары";
	const salesColumns = ["Никнейм", "Количество", "Стоимость"];
	const salesRows = [
		{ name: "Monster Rio Punch", quantity: "3", amount: "375 ₽" },
		{ name: "Adrenaline Extra 0,449", quantity: "2", amount: "205 ₽" },
		{ name: "Салат Куриный BBQ", quantity: "1", amount: "310 ₽" },
		{ name: "Рис с курицей и овощами", quantity: "1", amount: "380 ₽" },
		{ name: "Рис с курицей и овощами", quantity: "1", amount: "380 ₽" },
	];

	let loading = $ref(true);
</script>
