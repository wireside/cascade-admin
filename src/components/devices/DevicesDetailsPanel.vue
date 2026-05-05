<template>
	<article class="dashboard-card panel devices-details">
		<header class="panel__header">
			<div class="devices-details__title-wrap">
				<div class="devices-details__eyebrow">Детали устройства</div>
				<div class="panel__title">Компьютер 5</div>
			</div>

			<div class="devices-details__actions">
				<span class="devices-chip devices-chip--busy">Занят</span>
				<button type="button" class="panel__action"><v-icon icon="mdi-dots-horizontal" size="18" /></button>
			</div>
		</header>

		<div
			v-if="loading"
			class="devices-details__skeleton"
		>
			<div class="dashboard-skeleton-grid dashboard-skeleton-grid--3">
				<div
					v-for="item in 3"
					:key="item"
					class="dashboard-skeleton-tile dashboard-skeleton-tile--metric"
				>
					<v-skeleton-loader type="heading, text" />
				</div>
			</div>
			<div class="dashboard-skeleton-grid dashboard-skeleton-grid--2">
				<div
					v-for="item in 4"
					:key="`spec-${item}`"
					class="dashboard-skeleton-tile dashboard-skeleton-tile--metric"
				>
					<v-skeleton-loader type="article" />
				</div>
			</div>
			<div class="dashboard-skeleton-tile dashboard-skeleton-tile--metric">
				<v-skeleton-loader type="paragraph" />
			</div>
		</div>

		<template v-else>
			<section class="devices-details__top">
				<article
					v-for="item in summaryCards"
					:key="item.label"
					class="devices-details__card"
				>
					<div class="devices-details__label">{{ item.label }}</div>
					<div class="devices-details__value">{{ item.value }}</div>
				</article>
			</section>

			<section class="devices-details__grid">
				<article
					v-for="item in specCards"
					:key="item.label"
					class="devices-details__card"
				>
					<div class="devices-details__label">{{ item.label }}</div>
					<div class="devices-details__value">{{ item.value }}</div>
				</article>
			</section>

			<section class="devices-details__grid">
				<article class="devices-details__card">
					<div class="devices-details__label">Активное приложение</div>
					<div class="devices-details__value">Cascade [v.1.5.2]</div>
				</article>

				<article class="devices-details__card">
					<div class="devices-details__label">Сеть</div>
					<div class="devices-details__network">
						<div>192.168.155.1</div>
						<div>D8:43:AE:C3:65:C9</div>
					</div>
				</article>
			</section>

			<section class="devices-details__card">
				<div class="devices-details__label">Диски</div>
				<div class="devices-details__disks">
					<div
						v-for="disk in disks"
						:key="disk.name"
						class="devices-details__disk"
					>
						<div class="devices-details__disk-row">
							<div class="devices-details__disk-name">{{ disk.name }}</div>
							<div class="devices-details__disk-meta">{{ disk.caption }}</div>
						</div>
						<div class="devices-details__disk-bar">
							<div class="devices-details__disk-fill" :style="{ width: `${disk.usedPercent}%` }" />
						</div>
					</div>
				</div>
			</section>
		</template>
	</article>
</template>

<script setup>
	const summaryCards = [
		{ label: "Клиент", value: "SEVA2001" },
		{ label: "Тариф", value: "Буткемп 3 часа" },
		{ label: "Сеанс", value: "10:01:02 - 13:01:02" },
	];

	const specCards = [
		{ label: "Процессор", value: "AMD Ryzen 5 7500F 6-Core Processor" },
		{ label: "Оперативная память", value: "32 GB" },
		{ label: "Видеокарта", value: "NVIDIA GeForce RTX 5060 Ti" },
	];

	const disks = [
		{ name: "C:", caption: "8.1 ГБ свободно из 80.0 ГБ", usedPercent: 78 },
		{ name: "D:", caption: "1.3 ГБ свободно из 30.0 ГБ", usedPercent: 88 },
	];

	let loading = $ref(true);
</script>
