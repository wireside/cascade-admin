<template>
	<article class="dashboard-card panel devices-section">
		<header class="panel__header devices-section__header">
			<div class="devices-section__heading">
				<div class="devices-section__badge">{{ section.badge }}</div>
				<div class="panel__title">{{ section.title }}</div>
			</div>

			<div class="devices-section__actions">
				<label class="devices-section__select-all">
					<v-checkbox-btn :model-value="false" />
					<span>Выбрать все</span>
				</label>

				<div class="devices-section__buttons">
					<button type="button" class="panel__action"><v-icon icon="mdi-cog-outline" size="18" /></button>
					<button type="button" class="panel__action"><v-icon icon="mdi-delete-outline" size="18" /></button>
				</div>
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
			<table class="dashboard-table devices-table">
				<thead>
					<tr>
						<th v-for="column in columns" :key="column">
							<span>{{ column }}</span>
							<v-icon icon="mdi-swap-vertical" size="12" />
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in section.rows" :key="`${section.badge}-${row.index}`">
						<td class="dashboard-table__strong devices-table__index">{{ row.index }}</td>
						<td class="dashboard-table__strong">{{ row.name }}</td>
						<td>
							<span class="devices-chip" :class="`devices-chip--${row.status.tone}`">{{ row.status.label }}</span>
						</td>
						<td>
							<span class="devices-chip" :class="`devices-chip--${row.booking.tone}`">{{ row.booking.label }}</span>
						</td>
						<td>{{ row.client }}</td>
						<td>{{ row.tariff }}</td>
						<td>{{ row.start }}</td>
						<td>{{ row.end }}</td>
						<td>{{ row.app }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</article>
</template>

<script setup>
	defineProps({
		section: {
			type: Object,
			required: true,
		},
	});

	const columns = ["№", "Название", "Статус", "Бронь", "Клиент", "Тариф", "Начало", "Окончание", "Приложение"];

	let loading = $ref(true);
</script>
