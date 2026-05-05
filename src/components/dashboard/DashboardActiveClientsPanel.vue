<template>
	<article class="dashboard-card panel">
		<header class="panel__header">
			<div class="panel__title">
				<v-icon icon="mdi-lightning-bolt-outline" size="18" />
				<span>Активные клиенты</span>
			</div>
			<div class="panel__segmented">
				<button v-for="tab in ['Неделя', 'День']" :key="tab" type="button" class="panel__segment" :class="{ 'panel__segment--active': tab === 'День' }">
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
						<th v-for="column in clientColumns" :key="column">
							<span>{{ column }}</span>
							<v-icon icon="mdi-swap-vertical" size="12" />
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in clientRows" :key="`${row.nickname}-${row.lastVisit}`">
						<td class="dashboard-table__strong">{{ row.nickname }}</td>
						<td>{{ row.spent }}</td>
						<td>{{ row.hours }}</td>
						<td>{{ row.lastVisit }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</article>
</template>

<script setup>
	const clientColumns = ["Никнейм", "Траты", "Всего часов", "Посл. посещение"];
	const clientRows = [
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
		{ nickname: "hatekilla", spent: "1 372 ₽", hours: "> 1 ч.", lastVisit: "22 февр. 2026" },
	];

	let loading = $ref(true);
</script>
