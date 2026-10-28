<template>
	<span
		:class="[`text-${tone}`, { 's-status--pill': pill }]"
		:style="pill ? { backgroundColor: `rgba(var(--v-theme-${tone}), 0.12)` } : undefined"
		class="s-status d-inline-flex align-center font-weight-semibold text-no-wrap"
	>
		<v-icon
			:size="pill ? 6 : 8"
			icon="status-dot"
		/>
		{{ label }}
	</span>
</template>

<script setup>
	defineProps({
		label: { type: String, required: true },
		tone: { type: String, default: "success" },
		pill: { type: Boolean, default: false },
	});
</script>

<style scoped lang="scss">
	.s-status {
		font-size: 14px;
		line-height: 20px;
		gap: 6px;
		&--pill {
			padding: 5px 10px;
			border-radius: 13px;
			font-size: 12px;
			line-height: 16px;
			font-weight: 700 !important;
		}
	}
</style>
