<template>
	<v-btn-toggle
		v-model="model"
		:density="null"
		mandatory
		class="rates-days-toggle d-inline-flex bg-filter pa-1"
	>
		<v-btn
			v-for="option in options"
			:key="option.value"
			:value="option.value"
			:color="option.value === model ? 'primary' : 'transparent'"
			:class="option.value === model ? 'text-on-primary' : 'text-secondary'"
			:ripple="false"
			variant="flat"
			class="rates-days-toggle__button px-4"
			rounded="md"
			height="36"
		>
			<v-icon
				:icon="option.icon"
				size="16"
				class="mr-2"
			/>
			{{ option.label }}
		</v-btn>
	</v-btn-toggle>
</template>

<script setup>
	const model = defineModel({ type: String, default: "calendar" });

	const options = [
		{ value: "calendar", label: "Календарь дней", icon: "calendar-blank" },
		{ value: "rates", label: "Тарифы", icon: "clock" },
	];
</script>

<style scoped lang="scss">
	.rates-days-toggle {
		gap: 2px;
		height: 44px;
		border-radius: 10px;

		&__button :deep(.v-btn__overlay) {
			opacity: 0;
		}
	}
</style>
