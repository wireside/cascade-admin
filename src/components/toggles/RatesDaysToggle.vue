<template>
	<v-btn-toggle
		v-model="model"
		:density="null"
		mandatory
		class="rates-days-toggle d-inline-flex rounded-0"
	>
		<v-btn
			v-for="option in options"
			:key="option.value"
			:value="option.value"
			:color="option.value === model ? 'primary' : 'white'"
			:class="option.value === model ? 'text-black' : 'bg-opacity-5 text-white'"
			:ripple="false"
			variant="flat"
			class="rates-days-toggle__button px-4 py-3"
			rounded="md"
			height="40"
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
		{ value: "calendar", label: "Календарь дней", icon: "mdi-controller" },
		{ value: "rates", label: "Тарифы", icon: "mdi-controller" },
	];
</script>

<style scoped lang="scss">
	.rates-days-toggle {
		gap: 5px;

		&__button :deep(.v-btn__overlay) {
			opacity: 0;
		}
	}
</style>
