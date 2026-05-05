<template>
	<v-form
		validate-on="submit"
		@submit.prevent="submit"
	>
		<code-confirmation-field v-model="code" />
		<div class="mt-2 text-caption text-disabled">
			На номер {{ authStore.pendingPhone || "из регистрации" }} отправлен код подтверждения.
		</div>
		<div class="text-caption">
			Не получили код?
			<span
				class="cursor-pointer"
				@click="resendCode"
			>
				{{ isResending ? "Отправка..." : "Отправить снова" }}
			</span>
		</div>
		<div
			v-if="authStore.pendingDevConfirmationCode"
			class="mt-1 text-caption text-medium-emphasis"
		>
			Код для разработки: {{ authStore.pendingDevConfirmationCode }}
		</div>
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
		<div class="mt-4 d-flex justify-center align-center">
			<div class="w-50 pr-1">
				<s-secondary-btn
					class="w-100"
					type="button"
					@click="emit('back')"
				>
					Назад
				</s-secondary-btn>
			</div>
			<div class="w-50 pl-1">
				<s-btn
					class="w-100"
					type="submit"
					:loading="isSubmitting"
					:disabled="!(typeof code === 'string' && code.length === 6)"
				>
					Подтвердить
				</s-btn>
			</div>
		</div>
	</v-form>
</template>

<script setup>
	import SSecondaryBtn from "@/components/_s/buttons/SSecondaryBtn.vue";

	const emit = defineEmits(["done", "back"]);
	const authStore = useAuthStore();

	let code = $ref("");
	let errorMessage = $ref("");
	let successMessage = $ref("");
	let isSubmitting = $ref(false);
	let isResending = $ref(false);

	async function submit(event) {
		errorMessage = "";
		successMessage = "";

		const result = await event;
		if (!result.valid) {
			return;
		}

		isSubmitting = true;

		try {
			const response = await authStore.confirmPhone(code);
			successMessage = response.message;
			emit("done");
		} catch (error) {
			errorMessage = error.message || "Не удалось подтвердить номер телефона";
		} finally {
			isSubmitting = false;
		}
	}

	async function resendCode() {
		errorMessage = "";
		successMessage = "";
		isResending = true;

		try {
			const response = await authStore.resendPhoneCode();
			successMessage = response.message;
		} catch (error) {
			errorMessage = error.message || "Не удалось отправить код повторно";
		} finally {
			isResending = false;
		}
	}
</script>
