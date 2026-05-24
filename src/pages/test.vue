<template>
	<div class="test-page">
		<div class="test-page__backdrop" />

		<v-container
			fluid
			class="test-page__container"
		>
			<div class="test-page__hero">
				<div>
					<h1 class="test-page__title">Test</h1>
				</div>

				<div class="test-page__hero-actions">
					<v-btn
						color="white"
						variant="tonal"
						:loading="loading"
						prepend-icon="mdi-refresh"
						@click="reloadData"
					>
						Обновить
					</v-btn>
				</div>
			</div>

			<div class="test-page__sections">
				<section class="test-section">
					<div class="test-section__header">
						<div>
							<div class="test-section__title">Онлайн</div>
						</div>
					</div>

					<v-row>
						<v-col
							v-for="machine in onlineMachines"
							:key="machine.key"
							cols="12"
							md="6"
							xl="4"
						>
							<v-card
								class="machine-card"
								:class="machineCardClass(machine)"
								variant="tonal"
							>
								<v-card-item>
									<template #prepend>
										<div class="machine-card__avatar">
											<v-icon
												icon="mdi-monitor"
												size="20"
											/>
										</div>
									</template>

									<v-card-title class="machine-card__title">
										{{ machine.title }}
									</v-card-title>
								</v-card-item>

								<v-card-text class="machine-card__body">
									<div class="machine-card__meta">
										<div class="machine-card__meta-row">
											<span>Устройство</span>
											<strong>{{ machine.clientName }}</strong>
										</div>
										<div class="machine-card__meta-row">
											<span>HWID</span>
											<strong class="machine-card__mono">{{ machine.fingerprint }}</strong>
										</div>
										<div class="machine-card__meta-row">
											<span>Локация</span>
											<strong>{{ machine.locationName }}</strong>
										</div>
										<div class="machine-card__meta-row">
											<span>Последний пинг</span>
											<strong>{{ formatDateTime(machine.lastPingAtUtc) }}</strong>
										</div>
										<div
											v-if="machine.session"
											class="machine-card__meta-row"
										>
											<span>Остаток</span>
											<strong>{{ formatSessionRemaining(machine.session) }}</strong>
										</div>
									</div>
								</v-card-text>

								<v-divider />

								<v-card-actions class="machine-card__actions">
									<v-btn
										v-if="!machine.device"
										color="warning"
										variant="flat"
										prepend-icon="mdi-link-variant-plus"
										:loading="actionKey === `bind:${machine.fingerprint}`"
										@click="openBindDialog(machine)"
									>
										Привязать
									</v-btn>

									<template v-else>
										<v-btn
											color="error"
											variant="tonal"
											prepend-icon="mdi-link-variant-off"
											:loading="actionKey === `unbind:${machine.device.id}`"
											@click="unbindDevice(machine.device.id)"
										>
											Отвязать
										</v-btn>

										<v-btn
											v-if="!machine.session"
											color="primary"
											variant="flat"
											prepend-icon="mdi-timer-play-outline"
											:disabled="!machine.device"
											@click="openSessionDialog(machine)"
										>
											Новая сессия
										</v-btn>

										<v-btn
											v-if="machine.session?.status === 1"
											color="warning"
											variant="tonal"
											prepend-icon="mdi-pause"
											:loading="actionKey === `pause:${machine.session.id}`"
											@click="pauseSession(machine.session.id)"
										>
											Пауза
										</v-btn>

										<v-btn
											v-if="machine.session?.status === 0"
											color="success"
											variant="tonal"
											prepend-icon="mdi-play"
											:loading="actionKey === `resume:${machine.session.id}`"
											@click="resumeSession(machine.session.id)"
										>
											Продолжить
										</v-btn>

										<v-btn
											v-if="machine.session"
											color="error"
											variant="text"
											prepend-icon="mdi-delete-outline"
											:loading="actionKey === `session-delete:${machine.session.id}`"
											@click="deleteSession(machine.session.id)"
										>
											Удалить сессию
										</v-btn>
									</template>
								</v-card-actions>
							</v-card>
						</v-col>

						<v-col
							v-if="!onlineMachines.length && !loading"
							cols="12"
						>
							<v-sheet class="test-empty"></v-sheet>
						</v-col>
					</v-row>
				</section>

				<section class="test-section">
					<div class="test-section__header">
						<div>
							<div class="test-section__title">Оффлайн</div>
						</div>
					</div>

					<v-row>
						<v-col
							v-for="machine in offlineMachines"
							:key="machine.key"
							cols="12"
							md="6"
							xl="4"
						>
							<v-card
								class="machine-card machine-card--offline"
								variant="tonal"
							>
								<v-card-item>
									<template #prepend>
										<div class="machine-card__avatar machine-card__avatar--offline">
											<v-icon
												icon="mdi-monitor-off"
												size="20"
											/>
										</div>
									</template>

									<v-card-title class="machine-card__title">
										{{ machine.title }}
									</v-card-title>
								</v-card-item>

								<v-card-text class="machine-card__body">
									<div class="machine-card__meta">
										<div class="machine-card__meta-row">
											<span>Id</span>
											<strong>{{ machine.device.id }}</strong>
										</div>
										<div class="machine-card__meta-row">
											<span>Создан</span>
											<strong>{{ formatDateTime(machine.device.createdAt) }}</strong>
										</div>
										<div
											v-if="machine.session"
											class="machine-card__meta-row"
										>
											<span>Сессия</span>
											<strong>{{ formatSessionRemaining(machine.session) }}</strong>
										</div>
									</div>
								</v-card-text>

								<v-divider />

								<v-card-actions class="machine-card__actions">
									<v-btn
										v-if="machine.session"
										color="error"
										variant="text"
										prepend-icon="mdi-delete-outline"
										:loading="actionKey === `session-delete:${machine.session.id}`"
										@click="deleteSession(machine.session.id)"
									>
										Удалить сессию
									</v-btn>

									<v-btn
										color="error"
										variant="tonal"
										prepend-icon="mdi-link-variant-off"
										:loading="actionKey === `unbind:${machine.device.id}`"
										@click="unbindDevice(machine.device.id)"
									>
										Отвязать
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-col>

						<v-col
							v-if="!offlineMachines.length && !loading"
							cols="12"
						>
							<v-sheet class="test-empty">
								<div class="test-empty__title">Оффлайн-устройств нет</div>
								<div class="test-empty__text">Все `Device` сейчас представлены живыми `Client`.</div>
							</v-sheet>
						</v-col>
					</v-row>
				</section>
			</div>
		</v-container>

		<v-dialog
			v-model="bindDialog.open"
			max-width="440"
		>
			<v-card>
				<v-card-title>Привязать устройство</v-card-title>
				<v-card-text>
					<div class="mb-4 text-medium-emphasis">
						Fingerprint:
						<span class="machine-card__mono">{{ bindDialog.fingerprint }}</span>
					</div>
					<v-text-field
						v-model="bindDialog.name"
						label="Название устройства"
						variant="outlined"
						hide-details="auto"
					/>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn
						variant="text"
						@click="bindDialog.open = false"
					>
						Отмена
					</v-btn>
					<v-btn
						color="warning"
						variant="flat"
						:loading="actionKey === `bind:${bindDialog.fingerprint}`"
						@click="submitBind"
					>
						Привязать
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog
			v-model="sessionDialog.open"
			max-width="440"
		>
			<v-card>
				<v-card-title>Новая сессия</v-card-title>
				<v-card-text>
					<div class="mb-4 text-medium-emphasis">
						{{ sessionDialog.title }}
					</div>
					<v-text-field
						v-model="sessionDialog.durationMinutes"
						type="number"
						min="1"
						label="Длительность, минут"
						variant="outlined"
						hide-details="auto"
					/>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn
						variant="text"
						@click="sessionDialog.open = false"
					>
						Отмена
					</v-btn>
					<v-btn
						color="primary"
						variant="flat"
						:loading="actionKey === `start:${sessionDialog.deviceId}`"
						@click="submitSession"
					>
						Запустить
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<route lang="yaml">
meta:
  layout: auth
  title: Test
</route>

<script setup>
	import { getDeviceIndex } from "@/client";
	import {
		deleteDeviceDeleteMutation,
		deleteSessionDeleteMutation,
		getAdminIndexQuery,
		getClientIndexQuery,
		getClientIndexQueryKey,
		getSessionIndexQuery,
		getSessionIndexQueryKey,
		postClientRegisterMutation,
		postSessionPauseMutation,
		postSessionResumeMutation,
		postSessionStartMutation,
	} from "@/client/@pinia/colada.gen";
	import { useMutation, useQuery, useQueryCache } from "@pinia/colada";

	const { data: adminsData, refetch: adminsRefetch } = useQuery(getAdminIndexQuery());

	const { data: clientsData, refetch: clientsRefetch } = useQuery(getClientIndexQuery());

	const { data: sessionsData, refetch: sessionsRefetch } = useQuery(getSessionIndexQuery());

	const queryCache = useQueryCache();

	const loading = ref(false);
	const errorMessage = ref("");
	const actionKey = ref("");
	const devices = ref([]);
	const now = ref(Date.now());
	let refreshTimerId = 0;
	let reloadTimerId = 0;

	const bindDialog = reactive({
		open: false,
		fingerprint: "",
		name: "",
	});

	const sessionDialog = reactive({
		open: false,
		deviceId: "",
		title: "",
		durationMinutes: 60,
	});

	const snackbar = reactive({
		open: false,
		text: "",
	});

	const admins = computed(() => ensureArray(adminsData.value));

	const clients = computed(() => ensureArray(clientsData.value));

	const sessions = computed(() => ensureArray(sessionsData.value?.items));

	const sessionByDeviceId = computed(() => {
		return new Map(sessions.value.map((session) => [session.deviceId, session]));
	});

	const onlineMachines = computed(() => {
		return clients.value.map((client) => ({
			key: `online:${client.fingerprint}`,
			title: client.device?.name || client.clientName,
			subtitle: client.device ? "Привязанное устройство" : "Новый клиент",
			clientName: client.clientName,
			fingerprint: client.fingerprint,
			locationName: client.locationName,
			lastPingAtUtc: client.lastPingAtUtc,
			device: client.device || null,
			session: client.device ? sessionByDeviceId.value.get(client.device.id) || null : null,
		}));
	});

	const offlineMachines = computed(() => {
		const onlineDeviceIds = new Set(clients.value.map((client) => client.device?.id).filter(Boolean));

		return devices.value
			.filter((device) => !onlineDeviceIds.has(device.id))
			.map((device) => ({
				key: `offline:${device.id}`,
				title: device.name,
				subtitle: "Устройство из базы",
				device,
				session: sessionByDeviceId.value.get(device.id) || null,
			}));
	});

	onMounted(() => {
		loadDevices();

		refreshTimerId = window.setInterval(() => {
			now.value = Date.now();
		}, 1000);

		reloadTimerId = window.setInterval(() => {
			reloadData({ silent: true });
		}, 4000);
	});

	onBeforeUnmount(() => {
		window.clearInterval(refreshTimerId);
		window.clearInterval(reloadTimerId);
	});

	async function loadDevices() {
		try {
			const locationIds = [...new Set(admins.value.map((admin) => admin.locationId).filter(Boolean))];
			const deviceResponses = await Promise.all(
				locationIds.map((locationId) =>
					getDeviceIndex({
						query: { locationId, pageSize: 200 },
					})
				)
			);
			devices.value = deviceResponses.flatMap((response) => ensureArray(response?.items));
		} catch (error) {
			errorMessage.value = error?.message || "Не удалось загрузить тестовые данные";
		}
	}

	async function reloadData({ silent = false } = {}) {
		if (!silent) {
			loading.value = true;
		}

		errorMessage.value = "";

		try {
			await Promise.all([adminsRefetch(), clientsRefetch(), sessionsRefetch()]);

			await loadDevices();
		} catch (error) {
			errorMessage.value = error?.message || "Не удалось загрузить тестовые данные";
		} finally {
			if (!silent) {
				loading.value = false;
			}
		}
	}

	function ensureArray(value) {
		if (Array.isArray(value)) {
			return value;
		}

		return value ? [value] : [];
	}

	function machineCardClass(machine) {
		if (!machine.device) {
			return "machine-card--new";
		}

		if (machine.session?.status === 1) {
			return "machine-card--active";
		}

		if (machine.session?.status === 0) {
			return "machine-card--paused";
		}

		return "machine-card--bound";
	}

	function sessionLabel(session) {
		if (!session) {
			return "Без сессии";
		}

		return session.status === 1 ? "Сессия активна" : "На паузе";
	}

	function sessionTone(session) {
		if (!session) {
			return "grey";
		}

		return session.status === 1 ? "primary" : "warning";
	}

	function formatDateTime(value) {
		if (!value) {
			return "—";
		}

		return new Intl.DateTimeFormat("ru-RU", {
			day: "2-digit",
			month: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}).format(new Date(value));
	}

	function formatSessionRemaining(session) {
		if (!session) {
			return "—";
		}

		let remainingMilliseconds = parseDurationToMilliseconds(session.duration);

		if (session.status === 1) {
			remainingMilliseconds -= now.value - Date.parse(session.statusChangedAt);
		}

		const clamped = Math.max(0, remainingMilliseconds);
		const totalSeconds = Math.floor(clamped / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
	}

	function parseDurationToMilliseconds(value) {
		if (typeof value === "number") {
			return value;
		}

		if (!value || typeof value !== "string") {
			return 0;
		}

		const [hours, minutes, seconds] = value.split(":").map((part) => Number(part) || 0);
		return ((hours * 60 + minutes) * 60 + seconds) * 1000;
	}

	function openBindDialog(machine) {
		bindDialog.fingerprint = machine.fingerprint;
		bindDialog.name = machine.clientName;
		bindDialog.open = true;
	}

	function openSessionDialog(machine) {
		sessionDialog.deviceId = machine.device.id;
		sessionDialog.title = machine.title;
		sessionDialog.durationMinutes = 60;
		sessionDialog.open = true;
	}

	async function submitBind() {
		const { mutateAsync } = useMutation(postClientRegisterMutation());

		const fingerprint = bindDialog.fingerprint;

		await runAction(`bind:${fingerprint}`, async () => {
			await mutateAsync({
				query: {
					fingerprint,
					name: bindDialog.name,
				},
			});
			await queryCache.invalidateQueries({ key: getClientIndexQueryKey() });

			bindDialog.open = false;
			showSnackbar("Устройство привязано");
		});
	}

	async function submitSession() {
		const { mutateAsync } = useMutation(postSessionStartMutation()); // TODO

		const deviceId = sessionDialog.deviceId;

		await runAction(`start:${deviceId}`, async () => {
			await mutateAsync({
				query: {
					deviceId,
					duration: sessionDialog.durationMinutes,
				},
			});
			await queryCache.invalidateQueries({ key: getSessionIndexQueryKey() });

			sessionDialog.open = false;
			showSnackbar("Сессия запущена");
		});
	}

	async function unbindDevice(deviceId) {
		const { mutateAsync } = useMutation(deleteDeviceDeleteMutation());

		await runAction(`unbind:${deviceId}`, async () => {
			await mutateAsync({
				query: {
					id: deviceId,
				},
			});
			await queryCache.invalidateQueries({ key: getClientIndexQueryKey() });
			await queryCache.invalidateQueries({ key: getSessionIndexQueryKey() });

			showSnackbar("Устройство отвязано");
		});
	}

	async function pauseSession(sessionId) {
		const { mutateAsync } = useMutation(postSessionPauseMutation());

		await runAction(`pause:${sessionId}`, async () => {
			await mutateAsync({
				query: {
					id: sessionId,
				},
			});
			await queryCache.invalidateQueries({ key: getSessionIndexQueryKey() });

			showSnackbar("Сессия поставлена на паузу");
		});
	}

	async function resumeSession(sessionId) {
		const { mutateAsync } = useMutation(postSessionResumeMutation());

		await runAction(`resume:${sessionId}`, async () => {
			await mutateAsync({
				query: {
					id: sessionId,
				},
			});
			await queryCache.invalidateQueries({ key: getSessionIndexQueryKey() });

			showSnackbar("Сессия продолжена");
		});
	}

	async function deleteSession(sessionId) {
		const { mutateAsync } = useMutation(deleteSessionDeleteMutation());

		await runAction(`session-delete:${sessionId}`, async () => {
			await mutateAsync({
				query: {
					id: sessionId,
				},
			});
			await queryCache.invalidateQueries({ key: getSessionIndexQueryKey() });

			showSnackbar("Сессия удалена");
		});
	}

	async function runAction(key, action) {
		actionKey.value = key;
		errorMessage.value = "";

		try {
			await action();
		} catch (error) {
			errorMessage.value = error?.message || "Операция завершилась с ошибкой";
		} finally {
			actionKey.value = "";
		}
	}

	function showSnackbar(text) {
		snackbar.text = text;
		snackbar.open = true;
	}
</script>

<style scoped lang="scss">
	.test-page {
		min-height: 100vh;
		position: relative;
		background:
			radial-gradient(circle at top left, rgba(171, 244, 62, 0.08), transparent 22%),
			radial-gradient(circle at bottom right, rgba(37, 127, 249, 0.08), transparent 18%), #090909;
		color: rgba(255, 255, 255, 0.96);
	}

	.test-page__backdrop {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(9, 9, 9, 0.72), rgba(9, 9, 9, 0.92));
	}

	.test-page__container {
		position: relative;
		z-index: 1;
		padding: 40px 32px 56px;
		max-width: 1680px;
	}

	.test-page__hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 28px;
	}

	.test-page__eyebrow {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: rgba(255, 255, 255, 0.42);
		margin-bottom: 14px;
	}

	.test-page__title {
		margin: 0;
		font-size: clamp(32px, 4vw, 52px);
		line-height: 0.96;
		font-weight: 700;
	}

	.test-page__subtitle {
		margin: 14px 0 0;
		max-width: 620px;
		font-size: 16px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.64);
	}

	.test-page__hero-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
	}

	.test-page__sections {
		display: grid;
		gap: 28px;
	}

	.test-section__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 14px;
	}

	.test-section__title {
		font-size: 24px;
		font-weight: 600;
		line-height: 1.1;
	}

	.test-section__caption {
		margin-top: 6px;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.5);
	}

	.machine-card {
		height: 100%;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(17, 17, 17, 0.72);
		backdrop-filter: blur(12px);
	}

	.machine-card--new {
		border-color: rgba(244, 187, 62, 0.4);
	}

	.machine-card--bound {
		border-color: rgba(114, 172, 255, 0.28);
	}

	.machine-card--active {
		border-color: rgba(37, 127, 249, 0.5);
		box-shadow: inset 0 0 0 1px rgba(37, 127, 249, 0.18);
	}

	.machine-card--paused {
		border-color: rgba(244, 187, 62, 0.42);
	}

	.machine-card--offline {
		border-color: rgba(255, 255, 255, 0.06);
	}

	.machine-card__avatar {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: rgba(37, 127, 249, 0.18);
		color: #9fc5ff;
	}

	.machine-card__avatar--offline {
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.72);
	}

	.machine-card__title {
		font-size: 20px;
		font-weight: 600;
		line-height: 1.1;
	}

	.machine-card__subtitle {
		color: rgba(255, 255, 255, 0.52);
	}

	.machine-card__body {
		display: grid;
		gap: 16px;
	}

	.machine-card__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.machine-card__meta {
		display: grid;
		gap: 10px;
	}

	.machine-card__meta-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		font-size: 14px;
	}

	.machine-card__meta-row span {
		color: rgba(255, 255, 255, 0.48);
	}

	.machine-card__meta-row strong {
		color: rgba(255, 255, 255, 0.94);
		text-align: right;
		font-weight: 500;
	}

	.machine-card__mono {
		font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
		font-size: 12px;
		letter-spacing: 0.02em;
	}

	.machine-card__actions {
		flex-wrap: wrap;
		gap: 8px;
		padding: 14px 16px 16px;
	}

	.test-empty {
		padding: 28px;
		border-radius: 20px;
		border: 1px dashed rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.03);
	}

	.test-empty__title {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 6px;
	}

	.test-empty__text {
		color: rgba(255, 255, 255, 0.56);
	}

	@media (max-width: 959px) {
		.test-page__container {
			padding: 28px 18px 40px;
		}

		.test-page__hero {
			flex-direction: column;
		}

		.test-page__hero-actions {
			justify-content: flex-start;
		}
	}
</style>
