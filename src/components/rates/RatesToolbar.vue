<template>
	<div class="s-page-toolbar d-flex justify-space-between align-center mb-4">
		<rates-days-toggle v-model="activeView" />

		<v-btn
			color="primary"
			class="px-4 text-on-primary"
			rounded="md"
			height="44"
			variant="flat"
			@click="addItem"
		>
			<v-icon
				icon="plus"
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
