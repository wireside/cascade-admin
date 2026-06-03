<template>
	<div class="s-message-field position-relative">
		<v-textarea
			v-model="model"
			:variant="null"
			:maxLength="maxLength"
			:rules="fieldRules"
			:placeholder="placeholder"
			:hide-details="hideDetails"
			:rows="rows"
			:max-height="maxHeight"
			no-resize
			class="s-message-field__field bg-white bg-opacity-3 h-100"
		/>
		<div
			v-if="maxLength > 0"
			class="s-message-field__available-chars opacity-60 position-absolute"
		>
			{{ model?.length || 0 }}/{{ maxLength }}
		</div>
	</div>
</template>

<script setup>
	import { useRules } from "vuetify/labs/rules";

	const model = defineModel();

	const props = defineProps({
		placeholder: {
			type: String,
			default: "Ваше сообщение...",
		},
		hideDetails: {
			type: Boolean,
			default: true,
		},
		maxLength: {
			type: [String, Number],
			default: 0,
		},
		rules: {
			type: Array,
			default: null,
		},
		maxHeight: {
			type: [String, Number],
			default: 76,
		},
		rows: {
			type: [String, Number],
			default: null,
		},
	});

	const r = useRules();

	const fieldRules = props.rules || [r.maxLength(props.maxLength, `Максимальная длинна: ${props.maxLength} символов`)];
</script>

<style scoped lang="scss">
	.s-message-field {
		&__field {
			border-radius: 6px;

			& ::v-deep(.v-field) {
				color: white;
				font-size: 12px;
				line-height: 140%;
			}
		}

		&__available-chars {
			font-size: 12px;
			line-height: 140%;
			bottom: 11px;
			right: 15px;
		}
	}
</style>
