import { defineStore } from "pinia";

export const DEVICE_TYPE = Object.freeze({
	COMPUTER: "computer",
	CONSOLE: "console",
});

function createMockDevice(id, overrides = {}) {
	const type = overrides.type || DEVICE_TYPE.COMPUTER;

	return {
		id: String(id),
		type,
		name: type === DEVICE_TYPE.CONSOLE ? `Консоль ${id}` : `Компьютер ${id}`,
		status: { label: "Включен", tone: "primary" },
		booking: { label: "Без брони", tone: "secondary" },
		client: "",
		tariff: "",
		start: "",
		end: "",
		app: type === DEVICE_TYPE.CONSOLE ? "PlayStation 5" : "Cascade [v.1.5.2]",
		...overrides,
	};
}

function createComputerRange(from, to, overridesById = {}) {
	return Array.from({ length: to - from + 1 }, (_, index) => {
		const id = from + index;
		return createMockDevice(id, overridesById[id]);
	});
}

const MOCK_BOOTCAMPS = [
	{
		id: "1",
		tone: "blue",
		devices: createComputerRange(1, 16, {
			4: {
				booking: { label: "Есть бронь", tone: "blue" },
				nextBookingTime: "19:16",
			},
		}),
	},
	{
		id: "2",
		tone: "purple",
		devices: createComputerRange(17, 21),
	},
	{
		id: "3",
		tone: "green",
		devices: createComputerRange(22, 26, {
			22: {
				booking: { label: "Есть бронь", tone: "green" },
				nextBookingTime: "18:20",
			},
		}),
	},
	{
		id: "4",
		tone: "deep-purple",
		devices: [
			createMockDevice(27, {
				type: DEVICE_TYPE.CONSOLE,
				status: { label: "Включена", tone: "primary" },
			}),
		],
	},
];

function cloneDevice(device) {
	return {
		...device,
		status: device.status ? { ...device.status } : device.status,
		booking: device.booking ? { ...device.booking } : device.booking,
	};
}

function cloneMockBootcamps() {
	return MOCK_BOOTCAMPS.map((bootcamp) => ({
		...bootcamp,
		devices: bootcamp.devices.map(cloneDevice),
	}));
}

function normalizeId(id, entityName) {
	const normalizedId = String(id ?? "").trim();

	if (!normalizedId) {
		throw new TypeError(`${entityName} должен иметь id`);
	}

	return normalizedId;
}

export const useDevicesStore = defineStore("devices", {
	state: () => ({
		bootcamps: cloneMockBootcamps(),
	}),
	getters: {
		devices: (state) => state.bootcamps.flatMap((bootcamp) => bootcamp.devices),
		getBootcampById: (state) => (bootcampId) => state.bootcamps.find((bootcamp) => bootcamp.id === String(bootcampId)),
		getDevicesByBootcampId() {
			return (bootcampId) => this.getBootcampById(bootcampId)?.devices ?? [];
		},
		getDeviceById: (state) => (deviceId) =>
			state.bootcamps.flatMap((bootcamp) => bootcamp.devices).find((device) => device.id === String(deviceId)),
	},
	actions: {
		addDevice(bootcampId, payload) {
			const bootcamp = this.getBootcampById(bootcampId);

			if (!bootcamp) {
				throw new Error(`Буткемп с id "${bootcampId}" не найден`);
			}

			const device = cloneDevice({
				...payload,
				id: normalizeId(payload?.id, "Устройство"),
			});

			if (this.getDeviceById(device.id)) {
				throw new Error(`Устройство с id "${device.id}" уже существует`);
			}

			bootcamp.devices.push(device);
			return device;
		},
		updateDevice(deviceId, changes) {
			const bootcamp = this.bootcamps.find(({ devices }) => devices.some((device) => device.id === String(deviceId)));
			const index = bootcamp?.devices.findIndex((device) => device.id === String(deviceId)) ?? -1;

			if (index === -1) {
				throw new Error(`Устройство с id "${deviceId}" не найдено`);
			}

			const currentDevice = bootcamp.devices[index];
			const updatedDevice = cloneDevice({
				...currentDevice,
				...changes,
				id: currentDevice.id,
				status: changes?.status ?? currentDevice.status,
				booking: changes?.booking ?? currentDevice.booking,
			});

			bootcamp.devices[index] = updatedDevice;
			return updatedDevice;
		},
		removeDevice(deviceId) {
			const bootcamp = this.bootcamps.find(({ devices }) => devices.some((device) => device.id === String(deviceId)));
			const index = bootcamp?.devices.findIndex((device) => device.id === String(deviceId)) ?? -1;

			if (index === -1) {
				return false;
			}

			bootcamp.devices.splice(index, 1);
			return true;
		},
	},
});
