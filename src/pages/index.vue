<template>
	<div class="dashboard-page">
		<section class="dashboard-grid dashboard-grid--overview">
			<dashboard-summary-metrics />
			<dashboard-cash-metrics />

			<div class="dashboard-grid dashboard-grid--top-right">
				<dashboard-category-metrics />
				<dashboard-profile-card />
			</div>
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

<style src="@/assets/styles/admin-panels.scss" lang="scss"></style>
