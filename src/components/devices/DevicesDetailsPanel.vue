<template>
	<v-dialog
		v-model="modalOpen"
		class="devices-details-dialog"
		content-class="devices-details-dialog__content"
		width="340"
		max-width="340"
		scrim="transparent"
		scroll-strategy="none"
		transition="fade-transition"
	>
		<v-sheet
			width="340"
			height="550"
			rounded="lg"
			elevation="0"
			class="devices-details-panel bg-surface bg-opacity-80 text-white px-6 pb-6 pt-5 overflow-hidden"
		>
			<div class="d-flex align-center justify-space-between mb-5">
				<div class="devices-details-panel__title font-weight-medium text-truncate">
					{{ deviceDetails.name }}
				</div>

				<div class="d-flex align-center ga-1">
					<s-badge
						:label="deviceDetails.status.label"
						:tone="deviceDetails.status.tone"
						bg-opacity="25"
					/>

					<v-btn
						icon
						:density="null"
						variant="flat"
						color="white"
						width="29"
						height="29"
						rounded="sm"
						class="bg-opacity-10 text-white"
						@click="modalOpen = false"
					>
						<v-icon
							icon="mdi-close"
							size="18"
							class="opacity-70"
						/>
					</v-btn>
				</div>
			</div>

			<div class="devices-details-panel__content d-flex flex-column ga-3">
				<div
					v-for="item in specItems"
					:key="item.label"
				>
					<div class="devices-details-panel__label text-white opacity-60 mb-1">{{ item.label }}</div>
					<div class="devices-details-panel__value font-weight-medium text-white">{{ item.value }}</div>
				</div>

				<div>
					<div class="devices-details-panel__label text-white opacity-60 mb-1">Диски</div>

					<div
						v-for="disk in deviceDetails.disks"
						:key="disk.name"
						class="devices-details-panel__disk mb-2"
					>
						<div class="d-flex align-center ga-2 mb-1">
							<div class="devices-details-panel__disk-name font-weight-medium">{{ disk.name }}</div>
							<div class="devices-details-panel__disk-track flex-1-1 bg-white bg-opacity-5 rounded-sm overflow-hidden">
								<div
									class="devices-details-panel__disk-fill rounded-sm"
									:class="`bg-${disk.tone}`"
									:style="{ width: `${disk.usedPercent}%` }"
								/>
							</div>
						</div>
						<div class="devices-details-panel__disk-caption text-white opacity-50">
							{{ disk.caption }}
						</div>
					</div>
				</div>

				<div>
					<div class="devices-details-panel__label text-white opacity-60 mb-1">Активное приложение</div>
					<div class="devices-details-panel__value font-weight-medium">{{ deviceDetails.app }}</div>
				</div>

				<div>
					<div class="devices-details-panel__label text-white opacity-60 mb-1">Сеть</div>
					<div class="devices-details-panel__value font-weight-medium">{{ deviceDetails.network.ip }}</div>
					<div class="devices-details-panel__value font-weight-medium">{{ deviceDetails.network.mac }}</div>
				</div>
			</div>
		</v-sheet>
	</v-dialog>
</template>

<script setup>
	const modalOpen = defineModel("modalOpen", {
		type: Boolean,
		default: false,
	});

	const props = defineProps({
		device: {
			type: Object,
			default: null,
		},
	});

	const defaultDetails = {
		processor: "AMD Ryzen 5 7500F 6-Core Processor",
		memory: "32 GB",
		gpu: "NVIDIA GeForce RTX 5060 Ti",
		disks: [
			{
				name: "C:",
				caption: "8.1 ГБ свободно из 80.0 ГБ",
				usedPercent: 45,
				tone: "primary",
			},
			{
				name: "D:",
				caption: "1.3 ГБ свободно из 30.0 ГБ",
				usedPercent: 88,
				tone: "red",
			},
		],
		network: {
			ip: "192.168.155.1",
			mac: "D8:43:AE:C3:65:C9",
		},
	};

	const normalizeBadge = (badge) => {
		if (badge && typeof badge === "object") {
			return {
				label: badge.label || "Включен",
				tone: badge.tone || "primary",
			};
		}

		return {
			label: badge || "Включен",
			tone: "primary",
		};
	};

	const deviceDetails = $computed(() => ({
		name: props.device?.name || "Компьютер 1",
		status: normalizeBadge(props.device?.status),
		processor: props.device?.processor || defaultDetails.processor,
		memory: props.device?.memory || defaultDetails.memory,
		gpu: props.device?.gpu || defaultDetails.gpu,
		disks: props.device?.disks || defaultDetails.disks,
		app: props.device?.app || "Cascade [v.1.5.2]",
		network: props.device?.network || defaultDetails.network,
	}));

	const specItems = $computed(() => [
		{
			label: "Процессор",
			value: deviceDetails.processor,
		},
		{
			label: "Оперативная память",
			value: deviceDetails.memory,
		},
		{
			label: "Видеокарта",
			value: deviceDetails.gpu,
		},
	]);
</script>

<style scoped lang="scss">
	:global(.devices-details-dialog .v-overlay__content) {
		position: fixed !important;
		inset-block-start: 143px !important;
		inset-inline-end: 20px !important;
		inset-block-end: auto !important;
		inset-inline-start: auto !important;
		margin: 0 !important;
		width: 340px !important;
		max-width: calc(100vw - 40px) !important;
	}

	.devices-details-panel {
		backdrop-filter: blur(6px);
		border-radius: 10px !important;

		&__title {
			font-size: 16px;
			line-height: 20px;
		}

		&__content {
			font-size: 14px;
		}

		&__label {
			line-height: 17px;
		}

		&__value {
			font-size: 16px;
			line-height: 20px;
		}

		&__disk-name {
			width: 18px;
			font-size: 16px;
			line-height: 20px;
		}

		&__disk-track {
			height: 28px;
		}

		&__disk-fill {
			height: 100%;
		}

		&__disk-caption {
			margin-inline-start: 26px;
			font-size: 12px;
			line-height: 15px;
		}
	}
</style>
