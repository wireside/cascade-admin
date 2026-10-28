<template>
	<div
		v-if="visible"
		class="control-menu"
	>
		<div
			class="control-menu__backdrop"
			@click="closeMenu"
			@wheel.prevent
			@touchmove.prevent
		/>

		<div
			ref="fallbackTarget"
			:style="fallbackTargetStyle"
		/>

		<v-menu
			v-model="menuOpen"
			:offset="[-8, -12]"
			:target="resolvedTarget"
			:close-on-content-click="false"
			close-on-back
			transition="fade-transition"
			location="bottom start"
			scroll-strategy="reposition"
		>
			<v-list
				class="control-menu__content"
				@wheel.prevent
				@touchmove.prevent
			>
				<v-list-item
					prepend-icon="identification-card"
					title="Информация о ПК"
					height="32"
					@click="showDetails"
				/>
				<v-divider class="my-1" />
				<v-list-subheader class="control-menu__label">Клиент</v-list-subheader>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="32"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-2 align-center">
							<v-icon
								icon="clock"
								size="16"
							/>
							<span>Выбрать тариф</span>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					:class="{ 'pointer-events-none opacity-60': !row.client.trim() }"
					class="px-4 py-0"
					height="32"
					@click="onDepositUp"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-2 align-center">
							<v-icon
								icon="wallet"
								size="16"
							/>
							<span>Пополнить депозит</span>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="32"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-2 align-center">
							<v-icon
								icon="clock"
								size="16"
							/>
							<span>Бронирование</span>
						</div>

						<div>
							<v-icon
								icon="right"
								size="18"
							/>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="pa-0"
					:class="{ 'pointer-events-none opacity-60': !row.client.trim() }"
					height="32"
				>
					<penalty-control :row="row" />
				</v-list-item>

				<v-list-item
					:density="null"
					:class="{ 'pointer-events-none opacity-60': !row.client.trim() }"
					class="px-4 py-0"
					height="32"
					@click="onNotification"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-2 align-center">
							<v-icon
								icon="bell"
								size="16"
							/>
							<span>Уведомление</span>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0 pointer-events-none opacity-60"
					height="32"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-2 align-center">
							<v-icon
								icon="arrows-down-up"
								size="16"
							/>
							<span>Пересадить</span>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="text-red px-4 py-0"
					height="32"
					@click="onAction('end-session')"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-2 align-center">
							<v-icon
								icon="stop-circle"
								size="16"
							/>
							<span>Завершить сеанс</span>
						</div>
					</div>
				</v-list-item>

				<v-divider class="my-1" />
				<v-list-subheader class="control-menu__label">Устройство</v-list-subheader>

				<v-list-item
					:density="null"
					class="pa-0"
					height="32"
				>
					<electricity-control :row="row" />
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="32"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-2 align-center">
							<v-icon
								icon="gear"
								size="16"
							/>
							<span>Управление</span>
						</div>

						<div>
							<v-icon
								icon="right"
								size="18"
							/>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="32"
					@click="onAction('shell')"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-2 align-center">
							<v-icon
								icon="sidebar"
								size="16"
							/>
							<span>Оболочка</span>
						</div>

						<div>
							<v-icon
								icon="right"
								size="18"
							/>
						</div>
					</div>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>

	<deposit-modal
		v-if="depositModalOpen"
		v-model:modal-open="depositModalOpen"
		:client-name="'Алексей'"
		:username="row.client"
		:start-date="row.start"
		:end-date="row.end"
	/>

	<notification-modal
		v-if="notificationModalOpen"
		v-model:modal-open="notificationModalOpen"
	/>
</template>

<script setup>
	const props = defineProps({
		visible: {
			type: Boolean,
			default: false,
		},
		menuTarget: {
			type: [Object, String, Function],
			default: null,
		},
		x: {
			type: Number,
			default: 0,
		},
		y: {
			type: Number,
			default: 0,
		},
		row: {
			type: Object,
			default: null,
		},
	});

	const emit = defineEmits(["update:visible", "show-details", "action"]);

	const fallbackTarget = $ref(null);

	let depositModalOpen = $ref(null);
	let notificationModalOpen = $ref(null);

	let menuOpen = $computed({
		get() {
			return props.visible;
		},
		set(value) {
			emit("update:visible", value);
		},
	});

	const fallbackTargetStyle = $computed(() => ({
		position: "fixed",
		left: `${props.x}px`,
		top: `${props.y}px`,
		width: "1px",
		height: "1px",
		opacity: 0,
		pointerEvents: "none",
	}));

	const resolvedTarget = $computed(() => props.menuTarget || fallbackTarget);

	const action = (f) => {
		return function (...args) {
			closeMenu();
			f(...args);
		};
	};

	const onDepositUp = action(() => {
		depositModalOpen = true;
	});

	const onNotification = action(() => {
		notificationModalOpen = true;
	});

	const closeMenu = () => {
		menuOpen = false;
	};
	const showDetails = () => {
		closeMenu();
		emit("show-details", props.row);
	};
	const onAction = (action) => {
		closeMenu();
		emit("action", { action, row: props.row });
	};
</script>
