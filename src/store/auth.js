import { computed, ref } from "vue";
import { useMutation } from "@pinia/colada";
import {
	postAuthConfirmPhoneMutation,
	postAuthLoginMutation,
	postAuthLogoutMutation,
	postAuthRegisterMutation,
	postAuthResendPhoneCodeMutation,
} from "@/client/@pinia/colada.gen";
import { getAuthMe, postAuthLogout } from "@/client/sdk.gen";

const authTokenKey = "auth-token";
const authUserKey = "auth-user";
const pendingPhoneKey = "pending-phone";

function readJson(key) {
	const value = localStorage.getItem(key);
	if (!value) {
		return null;
	}

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

function normalizeBirthDate(value) {
	if (!value) {
		return null;
	}

	if (value instanceof Date) {
		return value.toISOString();
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) {
			return null;
		}

		if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) {
			const [day, month, year] = trimmed.split(".");
			return `${year}-${month}-${day}T00:00:00`;
		}

		return trimmed;
	}

	return value;
}

export const useAuthStore = defineStore("auth", () => {
	const token = ref(localStorage.getItem(authTokenKey));
	const user = ref(readJson(authUserKey));
	const pendingPhone = ref(localStorage.getItem(pendingPhoneKey) || "");
	const pendingDevConfirmationCode = ref("");
	const initialized = ref(false);

	const isAuthenticated = computed(() => Boolean(token.value && user.value));

	const loginMutation = useMutation(postAuthLoginMutation());
	const registerMutation = useMutation(postAuthRegisterMutation());
	const confirmPhoneMutation = useMutation(postAuthConfirmPhoneMutation());
	const resendPhoneCodeMutation = useMutation(postAuthResendPhoneCodeMutation());
	const logoutMutation = useMutation(postAuthLogoutMutation());

	function setSession(tokenValue, userValue) {
		token.value = tokenValue;
		user.value = userValue;

		localStorage.setItem(authTokenKey, tokenValue);
		localStorage.setItem(authUserKey, JSON.stringify(userValue));
	}

	function clearSession() {
		token.value = null;
		user.value = null;

		localStorage.removeItem(authTokenKey);
		localStorage.removeItem(authUserKey);
	}

	function setPendingConfirmation(phone, devConfirmationCode = "") {
		pendingPhone.value = phone || "";
		pendingDevConfirmationCode.value = devConfirmationCode || "";

		if (pendingPhone.value) {
			localStorage.setItem(pendingPhoneKey, pendingPhone.value);
		} else {
			localStorage.removeItem(pendingPhoneKey);
		}
	}

	function clearPendingConfirmation() {
		pendingPhone.value = "";
		pendingDevConfirmationCode.value = "";

		localStorage.removeItem(pendingPhoneKey);
	}

	async function bootstrap() {
		if (initialized.value) {
			return;
		}

		initialized.value = true;

		if (!token.value) {
			return;
		}

		if (user.value) {
			return;
		}

		try {
			const response = await getAuthMe({
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
			});

			user.value = response.data;
			localStorage.setItem(authUserKey, JSON.stringify(user.value));
		} catch {
			clearSession();
		}
	}

	async function register(payload) {
		const response = await registerMutation.mutateAsync({
			body: {
				...payload,
				birthDate: normalizeBirthDate(payload.birthDate),
			},
		});

		if (response.requiresPhoneConfirmation) {
			setPendingConfirmation(response.phone, response.devConfirmationCode);
		}

		return response;
	}

	async function login(payload) {
		const response = await loginMutation.mutateAsync({
			body: payload,
		});

		if (response.requiresPhoneConfirmation) {
			setPendingConfirmation(response.phone, response.devConfirmationCode);
			return response;
		}

		if (response.isAuthenticated) {
			setSession(response.authToken, response.user);
			clearPendingConfirmation();
		}

		return response;
	}

	async function confirmPhone(code) {
		const response = await confirmPhoneMutation.mutateAsync({
			body: {
				phone: pendingPhone.value,
				code,
			},
		});

		if (response.isAuthenticated) {
			setSession(response.authToken, response.user);
			clearPendingConfirmation();
		}

		return response;
	}

	async function resendPhoneCode() {
		if (!pendingPhone.value) {
			throw new Error("Не найден номер телефона для подтверждения");
		}

		const response = await resendPhoneCodeMutation.mutateAsync({
			body: {
				phone: pendingPhone.value,
			},
		});

		setPendingConfirmation(response.phone, response.devConfirmationCode);

		return response;
	}

	async function logout() {
		try {
			if (token.value) {
				await logoutMutation.mutateAsync({
					headers: {
						Authorization: `Bearer ${token.value}`,
					},
				});
			}
		} catch {
			if (token.value) {
				await postAuthLogout({
					headers: {
						Authorization: `Bearer ${token.value}`,
					},
				});
			}
		} finally {
			clearSession();
			clearPendingConfirmation();
		}
	}

	return {
		token,
		user,
		pendingPhone,
		pendingDevConfirmationCode,
		initialized,
		isAuthenticated,
		setSession,
		clearSession,
		setPendingConfirmation,
		clearPendingConfirmation,
		bootstrap,
		register,
		login,
		confirmPhone,
		resendPhoneCode,
		logout,
	};
});
