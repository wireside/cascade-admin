const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://192.168.0.123:5245").replace(/\/$/, "");

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

async function request(path, { method = "GET", body, token } = {}) {
	const response = await fetch(`${apiBaseUrl}${path}`, {
		method,
		headers: {
			...(body !== undefined ? { "Content-Type": "application/json" } : {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	const text = await response.text();
	const data = text ? JSON.parse(text) : null;

	if (!response.ok) {
		const error = new Error(data?.message || `Request failed with status ${response.status}`);
		error.status = response.status;
		error.field = data?.field || null;
		error.data = data;
		throw error;
	}

	return data;
}

export const authApi = {
	register(payload) {
		return request("/Auth/Register", {
			method: "POST",
			body: {
				...payload,
				birthDate: normalizeBirthDate(payload.birthDate),
			},
		});
	},
	login(payload) {
		return request("/Auth/Login", {
			method: "POST",
			body: payload,
		});
	},
	confirmPhone(payload) {
		return request("/Auth/ConfirmPhone", {
			method: "POST",
			body: payload,
		});
	},
	resendPhoneCode(payload) {
		return request("/Auth/ResendPhoneCode", {
			method: "POST",
			body: payload,
		});
	},
	me(token) {
		return request("/Auth/Me", {
			token,
		});
	},
	logout(token) {
		return request("/Auth/Logout", {
			method: "POST",
			token,
		});
	},
};
