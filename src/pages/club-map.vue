<template>
	<div class="d-flex flex-column ga-4">
		<club-layout @device-click="openDeviceDetails" />

		<devices-details-panel
			v-model:modal-open="detailsPanelOpen"
			:device="selectedDevice"
			@click-outside="detailsPanelOpen = false"
		/>
	</div>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Карта клуба
  icon: mdi-map-outline
</route>

<script setup>
	const devicesStore = useDevicesStore();

	let detailsPanelOpen = $ref(false);
	let selectedDevice = $ref(null);

	const openDeviceDetails = (deviceId) => {
		selectedDevice = devicesStore.getDeviceById(deviceId) || null;
		detailsPanelOpen = Boolean(selectedDevice);
	};
</script>
