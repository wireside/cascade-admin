<template>
	<div class="dashboard-page d-flex flex-column ga-3 pa-0">
		<section>
			<v-row gap="12px">
				<v-col cols="12" lg="6">
					<dashboard-summary-metrics />
				</v-col>
				<v-col>
					<dashboard-cash-metrics />
				</v-col>
			</v-row>
			<v-row gap="12px">
				<v-col cols="12" lg="8">
					<dashboard-category-metrics />
				</v-col>
				<v-col cols="4" class="flex-grow-1">
					<dashboard-profile-card />
				</v-col>
			</v-row>
		</section>

		<section class="dashboard-grid dashboard-grid--middle">
			<dashboard-analytics-panel />
			<dashboard-status-panel />
			<dashboard-bookings-panel />
		</section>

		<section class="dashboard-grid dashboard-grid--bottom">
			<dashboard-active-clients-panel />
			<dashboard-sales-panel />
		</section>
	</div>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Дашборд
</route>

<style src="@/assets/styles/admin-panels.scss" lang="scss"></style>