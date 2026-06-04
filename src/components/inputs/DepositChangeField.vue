<template>
	<div class="d-flex align-center ga-1">
		<v-text-field
			v-model="display"
			:density="null"
			:variant="null"
			:rules="computedRules"
			:readonly="fieldReadonly"
			ref="inputRef"
			hide-details
			width="154"
			class="deposit-input font-weight-medium"
			validate-on="blur"
			@blur="fieldReadonly = true"
			@focus="handleFocus"
			@keydown="$utils.filterKeysOnlyNumbers"
		></v-text-field>
		<v-btn
			variant="text"
			color="surface"
			size="32"
			class="text-white bg-surface"
			@click="handleDepositChange"
		>
			<v-icon
				icon="mdi-square-edit-outline"
				size="16"
				:class="`opacity-${fieldOpacity * 100}`"
			/>
		</v-btn>
	</div>
</template>

<script setup>
	import { useRules } from "vuetify/labs/rules";

	const model = defineModel();

	const rules = useRules();

	let fieldReadonly = $ref(true);
	const inputRef = $ref();

	const fieldOpacity = computed(() => `${fieldReadonly ? 0.7 : 1}`);

	const strip = (v) => {
		if (v == null) return "";
		return String(v).replace(/\s/g, "").replace(/₽/g, "");
	};

	const display = computed({
		get() {
			const raw = strip(model.value);
			return `${raw} ₽`;
		},
		set(val) {
			model.value = strip(val);
		},
	});

	const computedRules = [(v) => rules.required()(strip(v)), (v) => rules.integer()(strip(v))];

	const handleDepositChange = () => {
		fieldReadonly = false;

		const input = inputRef?.$el?.querySelector("input");

		input?.focus();
	};

	const handleFocus = () => {
		nextTick(() => {
			const input = inputRef?.$el?.querySelector("input");

			if (input) {
				requestAnimationFrame(() => {
					const val = input.value || "";
					const len = val.length;
					const pos = val.endsWith("₽") ? Math.max(0, len - 2) : len;
					input.setSelectionRange(pos, pos);
				});
			}
		});
	};
</script>

<style scoped lang="scss">
	.deposit-input {
		::v-deep(input) {
			opacity: v-bind(fieldOpacity) !important;
		}
	}
</style>
