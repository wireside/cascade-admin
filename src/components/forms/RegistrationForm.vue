<template>
	<v-form
		validate-on="submit"
		@submit.prevent="submit"
	>
		<username-field
			v-model="username"
			:rules="[rules.required()]"
		/>
		<birthday-field
			v-model="birthday"
			:rules="[rules.required()]"
			class="mt-2"
		/>
		<phone-field
			v-model="phone"
			:rules="[rules.required(), rules.phone()]"
			class="mt-2"
		/>
		<password-field
			v-model="password"
			:rules="[rules.required()]"
			class="mt-2"
		/>
		<password-field
			v-model="repeatPassword"
			:rules="[rules.required(), passwordsEqual]"
			placeholder="Повторите пароль"
			class="mt-2"
		/>
		<email-field
			v-model="email"
			:rules="[rules.required(), rules.email()]"
			class="mt-2"
		/>
		<template v-if="false">
			<v-checkbox
				v-model="personalDataConsent"
				class="mt-2"
				hide-details="auto"
			>
				<template #label>
					<span>Я принимаю Политику обработки персональных данных</span>
				</template>
			</v-checkbox>
			<v-checkbox
				v-model="mailingConsent"
				class="mt-1"
				hide-details
			>
				<template #label>
					<span>Я даю согласие на получение информационных рассылок</span>
				</template>
			</v-checkbox>
		</template>
		<div class="mt-4">
			<s-btn
				class="w-100"
				type="submit"
				:loading="isSubmitting"
			>
				Зарегистрироваться
			</s-btn>
			<div
				v-if="successMessage"
				class="mt-4 text-center text-medium-emphasis"
			>
				{{ successMessage }}
			</div>
			<div
				v-if="errorMessage"
				class="mt-4 text-center text-error"
			>
				{{ errorMessage }}
			</div>
		</div>
	</v-form>
</template>

<script setup>
	import { useRules } from "vuetify/labs/rules";

	const emit = defineEmits(["done"]);

	const rules = useRules();
	const authStore = useAuthStore();

	let username = $ref("");
	let birthday = $ref();
	let phone = $ref("");
	let password = $ref("");
	let repeatPassword = $ref("");
	let email = $ref("");
	let personalDataConsent = $ref(false);
	let mailingConsent = $ref(false);
	let errorMessage = $ref("");
	let successMessage = $ref("");
	let isSubmitting = $ref(false);

	function passwordsEqual() {
		return String(password) === String(repeatPassword) || "Пароли не совпадают";
	}

	async function submit(event) {
		errorMessage = "";
		successMessage = "";

		const result = await event;
		if (!result.valid) {
			return;
		}

		isSubmitting = true;

		try {
			const response = await authStore.register({
				userName: username,
				birthDate: birthday,
				phone,
				password,
				repeatPassword,
				email,
				personalDataConsent,
				mailingConsent,
			});

			successMessage = response.message;
			emit("done");
		} catch (error) {
			errorMessage = error.message || "Не удалось завершить регистрацию";
		} finally {
			isSubmitting = false;
		}
	}
</script>
