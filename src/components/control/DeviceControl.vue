<template>
	<div
		v-if="visible"
		class="control-menu"
	>
		<div
			class="control-menu__backdrop"
			@click="closeMenu"
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
			scroll-strategy="block"
		>
			<v-list class="control-menu__content pa-0 pt-2 font-weight-medium bg-surface bg-opacity-80">
				<v-list-subheader class="control-menu__label">Клиент</v-list-subheader>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="34"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-1 align-center">
							<v-icon
								icon="mdi-clock-plus-outline"
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
					height="34"
					@click="onDepositUp"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-1 align-center">
							<v-icon
								icon="mdi-cash-plus"
								size="16"
							/>
							<span>Пополнить депозит</span>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="34"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-1 align-center">
							<v-icon
								icon="mdi-clock-edit-outline"
								size="16"
							/>
							<span>Бронирование</span>
						</div>

						<div>
							<v-icon
								icon="mdi-chevron-right"
								size="18"
							/>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="pa-0"
					:class="{ 'pointer-events-none opacity-60': !row.client.trim() }"
					height="34"
				>
					<penalty-control :row="row" />
				</v-list-item>

				<v-list-item
					:density="null"
					:class="{ 'pointer-events-none opacity-60': !row.client.trim() }"
					class="px-4 py-0"
					height="34"
					@click="onNotification"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-1 align-center">
							<v-icon
								icon="mdi-bell-outline"
								size="16"
							/>
							<span>Уведомление</span>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0 pointer-events-none opacity-60"
					height="34"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-1 align-center">
							<v-icon
								icon="mdi-swap-horizontal"
								size="16"
							/>
							<span>Пересадить</span>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="34"
					@click="onAction('end-session')"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-1 align-center">
							<v-icon
								icon="mdi-clock-remove-outline"
								size="16"
							/>
							<span>Завершить сеанс</span>
						</div>
					</div>
				</v-list-item>

				<v-list-subheader class="control-menu__label">Управление</v-list-subheader>

				<v-list-item
					:density="null"
					class="pa-0"
					height="34"
				>
					<electricity-control :row="row" />
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="34"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-1 align-center">
							<v-icon
								icon="mdi-cog-outline"
								size="16"
							/>
							<span>Управление</span>
						</div>

						<div>
							<v-icon
								icon="mdi-chevron-right"
								size="18"
							/>
						</div>
					</div>
				</v-list-item>

				<v-list-item
					:density="null"
					class="px-4 py-0"
					height="34"
					@click="onAction('shell')"
				>
					<div class="d-flex w-100 align-center justify-space-between">
						<div class="d-flex ga-1 align-center">
							<v-icon
								icon="mdi-monitor-edit"
								size="16"
							/>
							<span>Оболочка</span>
						</div>

						<div>
							<v-icon
								icon="mdi-chevron-right"
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

	const emit = defineEmits(["update:visible"]);

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
</script>
