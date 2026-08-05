<template>
	<div class="d-flex justify-space-between align-center mb-4">
		<rates-days-toggle v-model="activeView" />

		<v-btn
			color="primary"
			class="px-4 bg-opacity-20 text-primary"
			rounded="md"
			height="40"
			variant="flat"
			@click="addItem"
		>
			<v-icon
				icon="mdi-plus-circle-outline"
				size="16"
				class="mr-1"
			/>
			{{ addButtonLabel }}
		</v-btn>
	</div>
</template>

<script setup>
	const activeView = defineModel({ type: String, default: "calendar" });
	const emit = defineEmits(["add-type", "add-rate"]);

	const addButtonLabel = $computed(() => (activeView.value === "calendar" ? "Добавить тип" : "Добавить тариф"));

	const addItem = () => {
		emit(activeView.value === "calendar" ? "add-type" : "add-rate");
	};
</script>
