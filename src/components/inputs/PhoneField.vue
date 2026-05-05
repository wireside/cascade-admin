<template>
	<s-mask-input
		v-model="model"
		mask="+7 (###) ###-##-##"
		placeholder="Введите номер телефона"
		prepend-inner-icon="mdi:phone"
	/>
</template>

<script setup>
	const model = defineModel();
</script>
