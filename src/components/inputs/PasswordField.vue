<template>
	<s-text-field
		v-model="model"
		placeholder="Введите пароль"
		prepend-inner-icon="lock"
		:append-inner-icon="showPassword ? 'eye' : 'eye-slash'"
		:type="showPassword ? 'text' : 'password'"
		@click:append-inner="showPassword = !showPassword"
	/>
</template>

<script setup>
	const model = defineModel();

	const showPassword = $ref(false);
</script>
