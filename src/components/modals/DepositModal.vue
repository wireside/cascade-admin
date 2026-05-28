<template>
	<v-dialog
		v-model="modalOpen"
		max-width="920"
		scrim="rgba(9, 9, 9, 0.70)"
		transition="fade-transition"
	>
		<v-card
			rounded="xl"
			elevation="20"
			class="overflow-hidden"
		>
			<v-row class="ma-0" no-gutters>
				<v-col cols="12" md="5" class="pa-0">
					<v-sheet class="position-relative overflow-hidden fill-height">
						<v-img
							:src="resolvedBackgroundImage"
							cover
							height="100%"
							gradient="to bottom, rgba(9, 9, 9, 0.18), rgba(9, 9, 9, 0.88)"
						/>

						<div class="position-absolute top-0 right-0 bottom-0 left-0 d-flex flex-column justify-space-between pa-6 pa-md-8">
							<div class="d-flex justify-end">
								<v-btn
									icon="mdi-close"
									variant="text"
									color="white"
									size="small"
									@click="close"
								/>
							</div>

							<div class="mt-auto">
								<div class="text-body-1 text-medium-emphasis text-white mb-1">{{ clientName }}</div>
								<div class="text-h4 font-weight-bold text-white">{{ username }}</div>
								<v-chip
									class="mt-3 px-4"
									color="purple-darken-1"
									variant="flat"
								>
									{{ role }}
								</v-chip>

								<v-row class="mt-6">
									<v-col
										v-for="item in guestMeta"
										:key="item.label"
										cols="12"
										sm="4"
									>
										<v-sheet
											rounded="lg"
											class="d-flex align-center ga-2 px-4 py-3"
											color="rgba(255, 255, 255, 0.06)"
										>
											<v-icon :icon="item.icon" size="18" color="white" opacity="0.9" />
											<span class="text-body-2 text-white">{{ item.value }}</span>
										</v-sheet>
									</v-col>
								</v-row>

								<div class="text-body-1 text-medium-emphasis text-white mt-8 mb-4">Управление депозитом</div>
								<v-row>
									<v-col cols="12">
										<v-sheet rounded="lg" class="d-flex align-center ga-3 px-4 py-3" color="rgba(255, 255, 255, 0.06)">
											<div class="text-body-1 text-white flex-grow-1">Депозит</div>
											<div class="text-body-1 text-white">{{ formattedDeposit }}</div>
											<v-btn icon="mdi-pencil" variant="text" color="white" size="small" @click="focusDeposit" />
										</v-sheet>
									</v-col>
									<v-col cols="12" class="mt-3">
										<v-sheet rounded="lg" class="d-flex align-center ga-3 px-4 py-3" color="rgba(255, 255, 255, 0.06)">
											<div class="text-body-1 text-white flex-grow-1">Скидка</div>
											<div class="text-body-1 text-white">{{ discount }}%</div>
											<v-btn icon="mdi-pencil" variant="text" color="white" size="small" @click="emit('edit-discount')" />
										</v-sheet>
									</v-col>
								</v-row>

								<div class="text-body-1 text-medium-emphasis text-white mt-8 mb-4">Комментарий о госте</div>
								<v-textarea
									ref="commentFieldRef"
									v-model="comment"
									variant="solo-filled"
									bg-color="rgba(255, 255, 255, 0.04)"
									hide-details
									rows="4"
									no-resize
									placeholder="Ваше сообщение..."
									class=""
								/>
								<div class="text-right text-body-2 text-medium-emphasis mt-2">{{ comment.length }}/{{ commentLimit }}</div>

								<v-btn
									class="mt-6 text-none"
									color="red-darken-2"
									variant="tonal"
									block
									height="48"
									prepend-icon="mdi-pin-off"
								>
									<div class="d-flex align-center justify-space-between w-100">
										<span>Заблокировать гостя</span>
										<v-switch
											v-model="blocked"
											inset
											hide-details
											color="white"
											class="ma-0 ml-4"
											@click.stop
										/>
									</div>
								</v-btn>
							</div>
						</div>
					</v-sheet>
				</v-col>

				<v-col cols="12" md="7" class="pa-0">
					<v-sheet class="fill-height pa-6 pa-md-8">
						<div class="d-flex align-center justify-space-between mb-6">
							<div class="text-h5 font-weight-medium">Пополнение депозита</div>
							<v-btn icon="mdi-close" variant="text" color="white" size="small" class="d-md-none" @click="close" />
						</div>

						<v-row>
							<v-col cols="12">
								<v-sheet rounded="lg" class="px-4 py-4" color="rgba(255, 255, 255, 0.05)">
									<div class="d-flex align-center justify-space-between ga-4 flex-wrap">
										<div class="text-body-1 text-medium-emphasis">Сумма пополнения</div>
										<v-text-field
											ref="depositFieldRef"
											v-model="deposit"
											type="number"
											variant="plain"
											hide-details
											bg-color="transparent"
											color="primary"
											class="flex-grow-1"
											suffix="₽"
											hide-spin-buttons
											min="0"
										/>
									</div>
								</v-sheet>
							</v-col>

							<v-col cols="12" class="mt-3">
								<v-sheet rounded="lg" class="px-4 py-4" color="rgba(255, 255, 255, 0.05)">
									<div class="d-flex align-center ga-3 flex-wrap">
										<div class="text-body-1 text-medium-emphasis mr-auto">Промокод</div>
										<v-text-field
											v-model="promoCode"
											placeholder="Введите промокод"
											hide-details
											variant="solo-filled"
											bg-color="rgba(255, 255, 255, 0.04)"
										/>
										<v-btn color="primary" variant="tonal" class="text-none px-6" @click="applyPromo">
											Применить
										</v-btn>
									</div>
								</v-sheet>
							</v-col>
						</v-row>

						<div class="text-body-1 text-medium-emphasis mt-7 mb-3">Быстрые суммы</div>
						<v-btn-toggle v-model="deposit" mandatory class="d-flex ga-3 flex-wrap">
							<v-btn
								v-for="amount in quickAmounts"
								:key="amount"
								:value="amount"
								variant="tonal"
								class="text-none"
								min-height="40"
							>
								{{ formatMoney(amount) }}
							</v-btn>
						</v-btn-toggle>

						<div class="text-body-1 text-medium-emphasis mt-8 mb-3">Способы оплаты</div>
						<v-btn-toggle
							v-model="paymentMethod"
							mandatory
							class="d-grid ga-3"
						>
							<v-btn
								v-for="method in paymentMethods"
								:key="method.value"
								:value="method.value"
								variant="tonal"
								class="text-none py-6"
								min-height="92"
							>
								<div class="d-flex flex-column align-center ga-2">
									<v-icon :icon="method.icon" size="34" />
									<div class="text-body-1">{{ method.label }}</div>
								</div>
							</v-btn>
						</v-btn-toggle>

						<v-sheet rounded="lg" class="px-4 py-4 mt-5" color="rgba(255, 255, 255, 0.05)">
							<div class="d-flex align-start justify-space-between ga-4">
								<div>
									<div class="text-body-1 font-weight-medium">Итого к зачислению</div>
									<div class="text-body-2 text-primary mt-1">+ {{ promoLabel }}</div>
								</div>
								<div class="text-h5 font-weight-bold">{{ formattedDeposit }}</div>
							</div>
						</v-sheet>

						<v-btn
							class="mt-5 text-none"
							color="primary"
							variant="flat"
							block
							height="58"
							@click="submit"
						>
							Оплатить счет на {{ formattedDeposit }}
						</v-btn>
					</v-sheet>
				</v-col>
			</v-row>
		</v-card>
	</v-dialog>
</template>

<script setup>
	const modalOpen = defineModel("modalOpen", { type: Boolean, default: false });

	const props = defineProps({
		clientName: {
			type: String,
			default: "Алексей",
		},
		username: {
			type: String,
			default: "alexeytopor",
		},
		role: {
			type: String,
			default: "Менеджер",
		},
		backgroundImage: {
			type: String,
			default: new URL("../../assets/images/premium-support.jpg", import.meta.url).href,
		},
		startDate: {
			type: String,
			default: "12.12.2025",
		},
		endDate: {
			type: String,
			default: "09.05.2026",
		},
		durationHours: {
			type: String,
			default: "188 ч.",
		},
		initialDeposit: {
			type: [Number, String],
			default: 1000,
		},
		discount: {
			type: [Number, String],
			default: 5,
		},
		commentLimit: {
			type: Number,
			default: 30,
		},
		quickAmounts: {
			type: Array,
			default: () => [250, 500, 1000, 1500],
		},
		paymentMethods: {
			type: Array,
			default: () => [
				{ label: "Наличные", value: "cash", icon: "mdi-cash" },
				{ label: "Банковская карта", value: "card", icon: "mdi-credit-card-outline" },
				{ label: "Разделить", value: "split", icon: "mdi-swap-horizontal" },
			],
		},
	});

	const emit = defineEmits(["submit", "edit-discount"]);

	const depositFieldRef = ref(null);
	const commentFieldRef = ref(null);

	const deposit = ref(Number(props.initialDeposit) || 0);
	const comment = ref("");
	const promoCode = ref("");
	const blocked = ref(false);
	const paymentMethod = ref(props.paymentMethods[2]?.value ?? props.paymentMethods[0]?.value ?? "cash");

	const resolvedBackgroundImage = computed(() => props.backgroundImage || defaultBackgroundImage);
	const formattedDeposit = computed(() => formatMoney(deposit.value));
	const promoLabel = computed(() => `${Number(props.discount) || 0}% по промокоду`);

	const guestMeta = computed(() => [
		{ label: "start", icon: "mdi-calendar-outline", value: props.startDate },
		{ label: "end", icon: "mdi-calendar-blank-outline", value: props.endDate },
		{ label: "duration", icon: "mdi-timer-outline", value: props.durationHours },
	]);

	function formatMoney(value) {
		const amount = Number(value) || 0;
		return `${new Intl.NumberFormat("ru-RU").format(amount)} ₽`;
	}

	function close() {
		modalOpen.value = false;
	}

	function submit() {
		emit("submit", {
			deposit: Number(deposit.value) || 0,
			promoCode: promoCode.value,
			comment: comment.value,
			blocked: blocked.value,
			paymentMethod: paymentMethod.value,
		});
	}

	function applyPromo() {
		promoCode.value = promoCode.value.trim();
	}

	function focusDeposit() {
		depositFieldRef.value?.focus?.();
	}

	function focusComment() {
		commentFieldRef.value?.focus?.();
	}
</script>


<style lang="scss">

</style>