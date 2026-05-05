<template>
	<s-mask-input
		v-model="model"
		mask="######"
		placeholder="Введите код"
		prepend-inner-icon="mdi:form-textbox"
	/>
</template>

<script setup>
	const model = defineModel();
</script>
