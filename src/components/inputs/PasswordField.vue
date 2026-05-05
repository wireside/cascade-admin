<template>
	<s-text-field
		v-model="model"
		placeholder="Введите пароль"
		prepend-inner-icon="mdi:lock"
		:append-inner-icon="showPassword ? 'mdi:eye' : 'mdi:eye-off'"
		:type="showPassword ? 'text' : 'password'"
		@click:append-inner="showPassword = !showPassword"
	/>
</template>

<script setup>
	const model = defineModel();

	const showPassword = $ref(false);
</script>
