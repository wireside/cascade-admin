<template>
	<s-text-field
		v-model="model"
		type="email"
		placeholder="Введите почту"
		prepend-inner-icon="mdi:email"
	/>
</template>

<script setup>
	const model = defineModel();
</script>
