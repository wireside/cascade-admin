<template>
	<v-btn
		:height="46"
		variant="plain"
		style="background: rgba(9, 9, 9, 0.5) !important;"
		class="border"
	>
		<template v-if="prependIcon">
			<s-smart-icon
				:icon="prependIcon"
				class="mr-1"
				:class="[(disabled ? 'opacity-5' : '')]"
			/>
		</template>
		<slot />
	</v-btn>
</template>

<script setup>
	const props = defineProps({
		prependIcon: {
			type: String,
		},
	});
</script>