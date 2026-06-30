<template>
	<div class="dashboard-page d-flex flex-column ga-3 pa-0">
		<section class="d-flex flex-wrap flex-xl-nowrap ga-4 align-stretch justify-items-stretch">
			<div class="d-flex ga-4 w-100">
				<div class="flex-grow-1">
					<dashboard-summary-metrics />
				</div>
				<div class="flex-grow-1">
					<dashboard-cash-metrics />
				</div>
			</div>
			<div class="d-flex ga-4 w-100">
				<div class="flex-grow-1">
					<dashboard-category-metrics class="w-100" />
				</div>
				<div>
					<dashboard-profile-card class="h-100" />
				</div>
			</div>
		</section>

		<section class="d-flex ga-4 align-stretch flex-wrap flex-xl-nowrap">
			<div><dashboard-analytics-panel class="h-100" /></div>
			<div class="flex-grow-1"><dashboard-status-panel class="h-100" /></div>
			<div class="flex-xl-grow-0 flex-grow-1"><dashboard-bookings-panel class="h-100" /></div>
		</section>

		<section class="d-flex ga-4 flex-wrap flex-xl-nowrap">
			<dashboard-active-clients-panel class="w-100" />
			<dashboard-sales-panel class="w-100" />
		</section>
	</div>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Дашборд
  icon: mdi-chart-pie-outline
</route>
