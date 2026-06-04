<template>
	<v-text-field
		v-model="model"
		:density="null"
		:variant="null"
		:rules="[rules.required()]"
		placeholder="Введите промокод"
		hide-details
		width="157"
		class="deposit-input font-weight-medium text-start"
	></v-text-field>
</template>

<script setup>
	import { useRules } from "vuetify/labs/rules";

	const model = defineModel();

	const rules = useRules();
</script>

<style scoped lang="scss">
	.deposit-input {
		& ::v-deep(input) {
			font-size: 12px;
		}

		& ::v-deep(.v-field__input) {
			padding: 10px 12px !important;
		}
	}
</style>
