<template>
	<s-date-input
		v-model="model"
		placeholder="Введите дату рождения"
		prepend-inner-icon="calendar-blank"
	/>
</template>

<script setup>
	const model = defineModel();
</script>
