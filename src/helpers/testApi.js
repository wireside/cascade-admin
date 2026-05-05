const apiBaseUrl = (import.meta.env.VITE_CENTRAL_API_BASE_URL || "http://192.168.0.123:5000").replace(/\/$/, "");

function buildUrl(path, query) {
	const url = new URL(`${apiBaseUrl}${path}`);

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined || value === null || value === "") {
				continue;
			}

			url.searchParams.set(key, String(value));
		}
	}

	return url.toString();
}

async function request(path, { method = "GET", query, body } = {}) {
	const response = await fetch(buildUrl(path, query), {
		method,
		headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	const text = await response.text();
	const data = text ? JSON.parse(text) : null;

	if (!response.ok) {
		const error = new Error(data?.message || `Request failed with status ${response.status}`);
		error.status = response.status;
		error.data = data;
		throw error;
	}

	return data;
}

function formatDurationForApi(totalMinutes) {
	const minutes = Math.max(1, Number(totalMinutes) || 0);
	const hoursPart = Math.floor(minutes / 60);
	const minutesPart = minutes % 60;

	return `${String(hoursPart).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}:00`;
}

export const testApi = {
	getAdmins() {
		return request("/Admin/Index");
	},
	getClients() {
		return request("/Client/Index");
	},
	getDevices(locationId) {
		return request("/Device/Index", {
			query: {
				locationId,
				pageSize: 200,
			},
		});
	},
	getSessions() {
		return request("/Session/Index", {
			query: {
				pageSize: 200,
			},
		});
	},
	registerClient({ fingerprint, name }) {
		return request("/Client/Register", {
			method: "POST",
			query: {
				fingerprint,
				name,
			},
		});
	},
	deleteDevice(id) {
		return request("/Device/Delete", {
			method: "DELETE",
			query: { id },
		});
	},
	startSession({ deviceId, durationMinutes }) {
		return request("/Session/Start", {
			method: "POST",
			query: {
				deviceId,
				duration: formatDurationForApi(durationMinutes),
			},
		});
	},
	pauseSession(id) {
		return request("/Session/Pause", {
			method: "POST",
			query: { id },
		});
	},
	resumeSession(id) {
		return request("/Session/Resume", {
			method: "POST",
			query: { id },
		});
	},
	deleteSession(id) {
		return request("/Session/Delete", {
			method: "DELETE",
			query: { id },
		});
	},
};
