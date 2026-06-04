<template>
	<v-text-field
		v-model="model"
		:density="null"
		:variant="null"
		:rules="[rules.required(), rules.integer()]"
		:placeholder="placeholder"
		hide-details
		class="deposit-input font-weight-medium text-start w-100"
		@keydown="$utils.filterKeysOnlyNumbers($event)"
		@beforeinput="onBeforeInput"
	>
		<template v-slot:append-inner>
			<span class="deposit-input__suffix"><span>₽</span></span>
		</template>
	</v-text-field>
</template>

<script setup>
	import { useRules } from "vuetify/labs/rules";

	const model = defineModel({ default: null });

	const emit = defineEmits(["update:modelValue", "beforechange"]);

	defineProps({
		placeholder: {
			type: String,
			default: () => "Наличные",
		},
	});

	const rules = useRules();

	const onBeforeInput = (event) => {
		if (event.data) {
			emit("beforechange", { e: event, futureValue: `${model.value || ""}${event.data}` });
		}
	};
</script>

<style scoped lang="scss">
	.deposit-input {
		$height: 38px;

		color: rgba(255, 255, 255, 0.7);

		& ::v-deep(.v-field) {
			background-color: rgba(var(--v-theme-white), 0.03) !important;
			padding-right: 15px !important;
		}

		& ::v-deep(.v-field__input) {
			min-height: $height !important;
			max-height: $height !important;
			text-align: inherit;
			padding: 12px 4px 12px 15px !important;
			border-radius: 4px;
		}
	}
</style>
