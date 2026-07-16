<template>
	<div class="d-flex flex-column ga-4">
		<devices-toolbar :sections="bootcampSections" />

		<section class="d-flex flex-column ga-3">
			<devices-section-panel
				v-for="section in bootcampSections"
				:key="section.title"
				:section="section"
				@selection-change="onSectionSelectionChange"
			/>
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

	const bootcampSections = [
		{
			badge: "1",
			title: "BOOTCAMP №1",
			tone: "blue",
			rows: [
				{
					id: "1",
					name: "Компьютер 1",
					status: { label: "Включен", tone: "primary" },
					booking: { label: "Есть бронь", tone: "blue" },
					client: "",
					tariff: "",
					start: "",
					end: "",
					app: "Cascade [v.1.5.2]",
				},
				{
					id: "2",
					name: "Компьютер 2",
					status: { label: "Включен", tone: "primary" },
					booking: { label: "Без брони", tone: "blue" },
					client: "",
					tariff: "",
					start: "",
					end: "",
					app: "Cascade [v.1.5.2]",
				},
				{
					id: "3",
					name: "Компьютер 3",
					status: { label: "Выключен", tone: "red" },
					booking: { label: "Без брони", tone: "blue" },
					client: "",
					tariff: "",
					start: "",
					end: "",
					app: "Cascade [v.1.5.2]",
				},
				{
					id: "4",
					name: "Компьютер 4",
					status: { label: "Включен", tone: "primary" },
					booking: { label: "Есть бронь", tone: "primary" },
					client: "",
					tariff: "",
					start: "",
					end: "",
					app: "Cascade [v.1.5.2]",
				},
				{
					id: "5",
					name: "Компьютер 90",
					status: { label: "Занят", tone: "deep-purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "",
					tariff: "",
					start: "",
					end: "",
					app: "Cascade [v.1.5.2]",
				},
			],
		},
		{
			badge: "2",
			title: "BOOTCAMP №2",
			tone: "deep-purple",
			rows: [
				{
					id: "1",
					name: "Компьютер 5",
					status: { label: "Занят", tone: "deep-purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "SEVA2001",
					tariff: "Буткемп 3 часа",
					start: "10:01:02",
					end: "13:01:02",
					app: "Counter Strike 2",
				},
				{
					id: "2",
					name: "Компьютер 6",
					status: { label: "Занят", tone: "deep-purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "79092223430",
					tariff: "Буткемп 3 часа",
					start: "10:00:30",
					end: "13:00:30",
					app: "Counter Strike 2",
				},
				{
					id: "3",
					name: "Компьютер 7",
					status: { label: "Занят", tone: "deep-purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "PAPPY",
					tariff: "Буткемп 3 часа",
					start: "09:58:11",
					end: "12:58:11",
					app: "Dota 2",
				},
				{
					id: "4",
					name: "Компьютер 8",
					status: { label: "Занят", tone: "deep-purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "",
					tariff: "",
					start: "",
					end: "",
					app: "Cascade [v.1.5.2]",
				},
				{
					id: "5",
					name: "Компьютер 90",
					status: { label: "Занят", tone: "deep-purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "",
					tariff: "",
					start: "",
					end: "",
					app: "Cascade [v.1.5.2]",
				},
			],
		},
		{
			badge: "3",
			title: "BOOTCAMP №3",
			tone: "purple",
			rows: [
				{
					id: "1",
					name: "Компьютер 5",
					status: { label: "Занят", tone: "purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "SEVA2001",
					tariff: "Буткемп 3 часа",
					start: "10:01:02",
					end: "13:01:02",
					app: "Counter Strike 2",
				},
				{
					id: "2",
					name: "Компьютер 6",
					status: { label: "Занят", tone: "purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "79092223430",
					tariff: "Буткемп 3 часа",
					start: "10:00:30",
					end: "13:00:30",
					app: "Counter Strike 2",
				},
				{
					id: "3",
					name: "Компьютер 7",
					status: { label: "Занят", tone: "purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "PAPPY",
					tariff: "Буткемп 3 часа",
					start: "09:58:11",
					end: "12:58:11",
					app: "Dota 2",
				},
				{
					id: "4",
					name: "Компьютер 8",
					status: { label: "Занят", tone: "purple" },
					booking: { label: "Без брони", tone: "secondary" },
					client: "",
					tariff: "",
					start: "",
					end: "",
					app: "Cascade [v.1.5.2]",
				},
			],
		},
	];
</script>
