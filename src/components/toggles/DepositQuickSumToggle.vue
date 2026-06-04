<template>
	<v-btn-toggle
		v-model.number="model"
		:density="null"
		mandatory
		class="d-flex ga-3 flex-wrap rounded-0"
	>
		<v-row gap="6px">
			<v-col
				v-for="amount in quickAmounts"
				:key="amount"
				cols="3"
			>
				<v-btn
					:value="amount"
					:class="{
						'bg-primary bg-opacity-10': amount === model,
						'bg-white bg-opacity-3 text-white': amount !== model,
					}"
					:ripple="false"
					:variant="null"
					class="deposit-modal__quick-amounts-btn font-weight-medium w-100"
					rounded="sm"
					height="34"
				>
					<span
						class="opacity-70"
						:class="{ 'text-primary': amount === model }"
					>
						{{ $formatter.asAmount(amount, " ₽") }}
					</span>
				</v-btn>
			</v-col>
		</v-row>
	</v-btn-toggle>
</template>

<script setup>
	const model = defineModel({ type: [Number, String], required: true });

	const props = defineProps({
		quickAmounts: {
			type: Array,
			default: () => [250, 500, 1000, 1500],
		},
	});
</script>

<style scoped lang="scss">
	.deposit-modal__quick-amounts-btn {
		& ::v-deep(.v-btn__overlay) {
			opacity: 0;
		}
	}
</style>
