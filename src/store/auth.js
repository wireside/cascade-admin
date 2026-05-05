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

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: localStorage.getItem(authTokenKey),
		user: readJson(authUserKey),
		pendingPhone: localStorage.getItem(pendingPhoneKey) || "",
		pendingDevConfirmationCode: "",
		initialized: false,
	}),
	getters: {
		isAuthenticated: state => Boolean(state.token && state.user),
	},
	actions: {
		setSession(token, user) {
			this.token = token;
			this.user = user;

			localStorage.setItem(authTokenKey, token);
			localStorage.setItem(authUserKey, JSON.stringify(user));
		},
		clearSession() {
			this.token = null;
			this.user = null;

			localStorage.removeItem(authTokenKey);
			localStorage.removeItem(authUserKey);
		},
		setPendingConfirmation(phone, devConfirmationCode = "") {
			this.pendingPhone = phone || "";
			this.pendingDevConfirmationCode = devConfirmationCode || "";

			if (this.pendingPhone) {
				localStorage.setItem(pendingPhoneKey, this.pendingPhone);
			} else {
				localStorage.removeItem(pendingPhoneKey);
			}
		},
		clearPendingConfirmation() {
			this.pendingPhone = "";
			this.pendingDevConfirmationCode = "";

			localStorage.removeItem(pendingPhoneKey);
		},
		async bootstrap() {
			if (this.initialized) {
				return;
			}

			this.initialized = true;

			if (!this.token) {
				return;
			}

			if (this.user) {
				return;
			}

			try {
				this.user = await authApi.me(this.token);
				localStorage.setItem(authUserKey, JSON.stringify(this.user));
			} catch {
				this.clearSession();
			}
		},
		async register(payload) {
			const response = await authApi.register(payload);

			if (response.requiresPhoneConfirmation) {
				this.setPendingConfirmation(response.phone, response.devConfirmationCode);
			}

			return response;
		},
		async login(payload) {
			const response = await authApi.login(payload);

			if (response.requiresPhoneConfirmation) {
				this.setPendingConfirmation(response.phone, response.devConfirmationCode);
				return response;
			}

			if (response.isAuthenticated) {
				this.setSession(response.authToken, response.user);
				this.clearPendingConfirmation();
			}

			return response;
		},
		async confirmPhone(code) {
			const response = await authApi.confirmPhone({
				phone: this.pendingPhone,
				code,
			});

			if (response.isAuthenticated) {
				this.setSession(response.authToken, response.user);
				this.clearPendingConfirmation();
			}

			return response;
		},
		async resendPhoneCode() {
			if (!this.pendingPhone) {
				throw new Error("Не найден номер телефона для подтверждения");
			}

			const response = await authApi.resendPhoneCode({
				phone: this.pendingPhone,
			});

			this.setPendingConfirmation(response.phone, response.devConfirmationCode);

			return response;
		},
		async logout() {
			try {
				if (this.token) {
					await authApi.logout(this.token);
				}
			} finally {
				this.clearSession();
				this.clearPendingConfirmation();
			}
		},
	},
});
