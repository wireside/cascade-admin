<template>
	<v-text-field>
		<template
			v-for="(_, slot) of $slots"
			v-slot:[slot]="scope"
		>
			<slot
				:name="slot"
				v-bind="scope"
			/>
		</template>
		<template
			v-if="prependInnerIcon"
			v-slot:prepend-inner
		>
			<s-smart-icon
				:icon="prependInnerIcon"
				:size="iconSize"
				:opacity="iconOpacity"
				@click="$emit('click:prepend-inner')"
			/>
		</template>
		<template
			v-if="prependIcon"
			v-slot:prepend
		>
			<s-smart-icon
				:icon="prependIcon"
				:size="iconSize"
				:opacity="iconOpacity"
				@click="$emit('click:prepend')"
			/>
		</template>
		<template
			v-if="appendInnerIcon"
			v-slot:append-inner
		>
			<s-smart-icon
				:icon="appendInnerIcon"
				:size="iconSize"
				:opacity="iconOpacity"
				@click="$emit('click:append-inner')"
			/>
		</template>
		<template
			v-if="appendIcon"
			v-slot:append
		>
			<s-smart-icon
				:icon="appendIcon"
				:size="iconSize"
				:opacity="iconOpacity"
				@click="$emit('click:append')"
			/>
		</template>
	</v-text-field>
</template>

<script setup>
	const props = defineProps({
		prependIcon: {
			type: String,
		},
		prependInnerIcon: {
			type: String,
		},
		appendIcon: {
			type: String,
		},
		appendInnerIcon: {
			type: String,
		},
		sound: {
			type: Boolean,
			default: true,
		},
		hideCounter: {
			type: Boolean,
			default: false,
		},
		centered: {
			type: Boolean,
			default: false,
		},
		iconSize: {
			type: [String, Number],
			default: 16,
		},
		iconOpacity: {
			type: [String, Number],
			default: 0.5,
		},
	});

	const appearance = $computed(() => props.hideCounter ? "none" : "auto");
	const textAlign = $computed(() => props.centered ? "center" : "left");
</script>

<style scoped>
.s-text-field {
	::v-deep(input) {
		text-align: v-bind(textAlign);
	}
}

::v-deep(input[type=number]::-webkit-inner-spin-button) {
	appearance: v-bind(appearance) !important;
}
</style>