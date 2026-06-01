<template>
	<v-text-field
		v-model="model"
		:density="null"
		:variant="null"
		:rules="[rules.required(), rules.integer()]"
		ref="inputRef"
		hide-details
		width="265"
		class="deposit-input font-weight-medium text-end"
		@focus="handleFocus"
		@keydown="$utils.filterKeysOnlyNumbers"
	>
		<template v-slot:append-inner>
			<span class="deposit-input__suffix"><span>₽</span></span>
		</template>
	</v-text-field>
</template>

<script setup>
	import { useRules } from "vuetify/labs/rules";

	const model = defineModel();

	const rules = useRules();

	const inputRef = $ref(null);

	const handleFocus = () => {
		nextTick(() => {
			const input = inputRef?.$el?.querySelector("input");

			if (input) {
				requestAnimationFrame(() => {
					const length = input.value.length;
					input.setSelectionRange(length, length);
				});
			}
		});
	};
</script>
