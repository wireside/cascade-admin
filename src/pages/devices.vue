<template>
	<div class="d-flex flex-column ga-4">
		<devices-toolbar />

		<section class="d-flex flex-column ga-3">
			<devices-section-panel @selection-change="onSectionSelectionChange" />
		</section>

		<devices-details-panel
			v-model:modal-open="detailsPanelOpen"
			:device="detailsDevice"
			:loading="detailsLoading"
			@click-outside="onDetailsPanelClickOutside"
		/>
	</div>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Устройства
  icon: mdi-desktop-tower-monitor
</route>

<script setup>
	let detailsPanelOpen = $ref(false);
	let detailsLoading = $ref(false);
	let detailsDevice = $ref(null);
	let detailsRequestId = 0;

	const fetchDeviceDetails = async (device) => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return device;
	};

	const closeDetailsPanel = () => {
		detailsPanelOpen = false;
	};

	const onDetailsPanelClickOutside = (event) => {
		const selectionTarget = event.target?.closest?.(".s-data-table tbody tr, .s-data-table__selection-cell");
		if (selectionTarget) return;

		closeDetailsPanel();
	};

	const loadDeviceDetails = async (device) => {
		const requestId = ++detailsRequestId;

		detailsLoading = true;
		detailsPanelOpen = true;

		const loadedDevice = await fetchDeviceDetails(device);

		if (requestId !== detailsRequestId || !detailsPanelOpen) return;

		detailsDevice = loadedDevice;
		detailsLoading = false;
	};

	const onSectionSelectionChange = (selectedRows) => {
		if (selectedRows.length !== 1) {
			closeDetailsPanel();
			return;
		}

		loadDeviceDetails(selectedRows[0]);
	};

	watch(
		() => detailsPanelOpen,
		(isOpen) => {
			if (isOpen) return;

			detailsRequestId += 1;
			detailsLoading = false;
		}
	);

	onBeforeUnmount(() => {
		detailsRequestId += 1;
	});
</script>
