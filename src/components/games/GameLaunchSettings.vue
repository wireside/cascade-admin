<template>
	<s-editor-launch-settings
		v-model:paths="paths"
		v-model:arguments="launchArguments"
		v-model:run-as-administrator="runAsAdministrator"
	/>
</template>

<script setup>
	const paths = defineModel("paths", { type: Array, required: true });
	const launchArguments = defineModel("arguments", { type: String, default: "" });
	const runAsAdministrator = defineModel("runAsAdministrator", { type: Boolean, default: false });
</script>
