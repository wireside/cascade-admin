<template>
	<v-form
		validate-on="submit"
		@submit.prevent="submit"
	>
		<phone-field
			v-model="phone"
			:rules="[rules.required(), rules.phone()]"
		/>
		<password-field
			v-model="password"
			:rules="[rules.required()]"
			class="mt-2"
		/>
		<div class="mt-4">
			<s-btn
				class="w-100"
				type="submit"
				:loading="isSubmitting"
			>
				Войти
			</s-btn>
			<div
				v-if="successMessage"
				class="mt-2 text-center text-medium-emphasis"
			>
				{{ successMessage }}
			</div>
			<div
				v-if="errorMessage"
				class="mt-2 text-center text-error"
			>
				{{ errorMessage }}
			</div>
			<div class="mt-4 d-flex justify-center">
				<div class="text-disabled">Забыли свой пароль?</div>
				<div class="ml-1 cursor-pointer">Восстановить</div>
			</div>
		</div>
	</v-form>
</template>

<script setup>
	import { useRules } from "vuetify/labs/rules";

	const emit = defineEmits(["done", "confirmation"]);

	const rules = useRules();
	const authStore = useAuthStore();

	let phone = $ref("");
	let password = $ref("");
	let errorMessage = $ref("");
	let successMessage = $ref("");
	let isSubmitting = $ref(false);

	async function submit(event) {
		errorMessage = "";
		successMessage = "";

		const result = await event;
		if (!result.valid) {
			return;
		}

		isSubmitting = true;

		try {
			const response = await authStore.login({
				phone,
				password,
			});

			successMessage = response.message;

			if (response.requiresPhoneConfirmation) {
				emit("confirmation");
				return;
			}

			emit("done");
		} catch (error) {
			errorMessage = error.message || "Не удалось выполнить вход";
		} finally {
			isSubmitting = false;
		}
	}
</script>
