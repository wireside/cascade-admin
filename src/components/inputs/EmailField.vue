<template>
	<s-text-field
		v-model="model"
		type="email"
		placeholder="Введите почту"
		prepend-inner-icon="envelope"
	/>
</template>

<script setup>
	const model = defineModel();
</script>
