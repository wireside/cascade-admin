<template>
	<s-text-field
		v-model="model"
		placeholder="Введите имя пользователя"
		prepend-inner-icon="mdi:user"
	/>
</template>

<script setup>
	const model = defineModel();
</script>
