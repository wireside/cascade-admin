export function deviceStatusTone(device) {
	const label = String(device?.status?.label || device?.status || "").toLocaleLowerCase("ru");
	if (label.includes("обслуж") || device?.status?.tone === "orange") return "warning";
	if (label.includes("выключ") || ["red", "secondary", "muted"].includes(device?.status?.tone)) return "secondary";
	return "success";
}

export function matchesDeviceFilter(device, filter) {
	switch (filter) {
		case "powered":
			return deviceStatusTone(device) === "success";
		case "session":
			return Boolean(device.client?.trim());
		case "service":
			return deviceStatusTone(device) === "warning";
		case "admin":
			return Boolean(device.highAccess);
		case "shell":
			return device.shellRunning === false;
		default:
			return true;
	}
}
