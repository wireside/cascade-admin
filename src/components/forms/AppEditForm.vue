<template>
	<v-form
		validate-on="submit"
		class="app-edit-form d-flex flex-column ga-3"
		@submit.prevent="submit"
	>
		<app-basic-data
			v-model:name="name"
			v-model:description="description"
			v-model:group="group"
		/>

		<app-media-settings
			v-model:icon="icon"
			v-model:icon-path="iconPath"
			:app-name="name"
			:fallback-image="fallbackImage"
		/>

		<s-editor-launch-settings
			v-model:paths="paths"
			v-model:arguments="launchArguments"
			v-model:run-as-administrator="runAsAdministrator"
		/>
	</v-form>
</template>

<script setup>
	const emit = defineEmits(["submit"]);

	defineProps({
		fallbackImage: {
			type: String,
			required: true,
		},
	});

	const name = defineModel("name", { type: String, default: "" });
	const description = defineModel("description", { type: String, default: "" });
	const group = defineModel("group", { type: String, default: "Без группы" });
	const icon = defineModel("icon", { type: String, default: "" });
	const iconPath = defineModel("iconPath", { type: String, default: "" });
	const paths = defineModel("paths", { type: Array, required: true });
	const launchArguments = defineModel("arguments", { type: String, default: "" });
	const runAsAdministrator = defineModel("runAsAdministrator", { type: Boolean, default: false });

	async function submit(event) {
		const result = await event;
		if (result.valid) emit("submit");
	}
</script>
