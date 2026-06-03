<template>
	<v-dialog
		v-model="modalOpen"
		max-width="920"
		min-height="597"
		scrim="rgba(9, 9, 9, 0.70)"
		transition="fade-transition"
		class="deposit-modal"
	>
		<v-card
			rounded="xl"
			elevation="20"
			class="deposit-modal__content pa-4 bg-background overflow-hidden"
		>
			<v-row gap="10px">
				<v-col class="pa-0 flex-grow-0">
					<v-sheet
						width="380"
						class="deposit-modal__section overflow-hidden fill-height"
					>
						<v-img
							:src="resolvedBackgroundImage"
							class="px-4 pb-1 d-flex align-end"
							cover
							position="top center"
							height="230"
							gradient="180deg, rgba(14, 14, 14, 0.48) 0%, rgba(14, 14, 14, 1) 100%"
						>
							<div class="d-flex flex-column">
								<div class="mb-1">{{ clientName }}</div>

								<div class="d-flex align-end justify-space-between mb-4">
									<div class="deposit-modal__username font-weight-bold">{{ username }}</div>
									<s-badge
										:label="role"
										bg-opacity="25"
										tone="#EA00FF"
									/>
								</div>

								<div class="d-flex align-center ga-1">
									<div
										class="deposit-modal__time bg-white bg-opacity-5 d-flex align-center justify-center ga-1 px-4 py-2 rounded-sm flex-grow-1"
									>
										<v-icon
											icon="mdi-calendar-outline"
											size="14"
											color="white"
											opacity="0.7"
										/>
										<span class="text-white opacity-70">{{ startDate }}</span>
									</div>

									<div
										class="deposit-modal__time bg-white bg-opacity-5 d-flex align-center justify-center ga-1 px-4 py-2 rounded-sm flex-grow-1"
									>
										<v-icon
											icon="mdi-calendar-blank-outline"
											size="14"
											color="white"
											opacity="0.7"
										/>
										<span class="text-white opacity-70">{{ endDate }}</span>
									</div>

									<div
										class="deposit-modal__time bg-white bg-opacity-5 d-flex align-center justify-center ga-1 px-4 py-2 rounded-sm flex-grow-1"
									>
										<v-icon
											icon="mdi-timer-outline"
											size="14"
											color="white"
											opacity="0.7"
										/>
										<span class="text-white opacity-70">{{ durationHours }}</span>
									</div>
								</div>
							</div>
						</v-img>
						<div class="px-4 pt-4">
							<div class="opacity-70 mb-3">Управление депозитом</div>

							<v-sheet
								rounded="md"
								class="mb-2 d-flex px-4 py-2 align-center justify-space-between bg-white bg-opacity-3 text-white"
							>
								<div>Депозит</div>
								<deposit-change-field v-model="currentDeposit" />
							</v-sheet>

							<v-sheet
								rounded="md"
								class="mb-5 d-flex px-4 py-2 align-center justify-space-between bg-white bg-opacity-3 text-white"
							>
								<div>Скидка</div>
								<discount-field v-model="discountModelValue" />
							</v-sheet>
						</div>

						<div class="mb-3 px-4">
							<div class="opacity-70 mb-3">Комментарий о госте</div>
							<s-message-field
								v-model="comment"
								max-length="30"
								placeholder="Ваше сообщение..."
								max-height="76"
								rows="4"
							/>
						</div>

						<div class="px-4 pb-4">
							<v-sheet
								:class="blocked ? 'bg-opacity-60' : 'bg-opacity-40'"
								class="text-none px-4 py-2 bg-red rounded-md d-flex align-center justify-space-between"
								max-height="38"
							>
								<div class="d-flex align-center ga-2 text-white">
									<v-icon
										icon="mdi-gavel"
										size="18"
									/>
									<span>Заблокировать гостя</span>
								</div>
								<s-switch
									v-model="blocked"
									color="white"
									width="32"
									height="18"
								/>
							</v-sheet>
						</div>
					</v-sheet>
				</v-col>

				<v-col class="pa-0">
					<v-form ref="depositFormRef" @submit.prevent="onSubmit">
						<v-sheet
							class="deposit-modal__section d-flex flex-column pa-4 overflow-hidden fill-height"
							min-height="567"
						>
							<div class="deposit-modal__deposit-up font-weight-medium mb-4">Пополнение депозита</div>

							<v-sheet
								rounded="md"
								class="mb-2 d-flex px-4 py-2 align-center justify-space-between bg-white bg-opacity-3 text-white"
							>
								<div>Сумма пополнения</div>
								<deposit-up-field
									v-model="deposit"
									class="flex-grow-0"
								/>
							</v-sheet>

							<v-sheet
								rounded="md"
								class="mb-5 d-flex px-4 py-2 align-center justify-space-between bg-white bg-opacity-3 text-white"
							>
								<div>Промокод</div>
								<v-form
									ref="promoFormRef"
									validate-on="blur"
									@submit.prevent="applyPromo"
								>
									<div class="d-flex align-center ga-1">
										<promo-field v-model="promoCode" />
										<v-btn
											:density="null"
											variant="tonal"
											color="blue"
											height="32"
											width="103"
											class="text-white font-weight-regular bg-blue-10 rounded-sm fill-height"
											type="submit"
										>
											Применить
										</v-btn>
									</div>
								</v-form>
							</v-sheet>

							<div class="opacity-70 mb-3">Быстрые суммы</div>
							<deposit-quick-sum-toggle
								v-model="deposit"
								:quick-amounts="quickAmounts"
							/>

							<div class="opacity-70 mb-3 flex-grow-1 d-flex align-end">Способы оплаты</div>
							<deposit-payment-method-toggle
								v-model="paymentMethod"
								v-model:cash-amount="cashAmount"
								v-model:card-amount="cardAmount"
								:deposit="deposit"
								:cash-method="CASH_METHOD"
								:card-method="CARD_METHOD"
								:split-method="SPLIT_METHOD"
							/>

							<v-sheet
								rounded="lg"
								class="deposit-modal__total px-4 py-3 mt-2 mb-2 bg-white bg-opacity-3"
								height="60"
							>
								<div class="d-flex align-center justify-space-between text-white">
									<div class="d-flex flex-column ga-2">
										<div class="font-weight-medium">Итого к зачислению</div>
										<div class="deposit-modal__bonus">
											<span class="text-blue">{{ `+ ${promoCodeBonuspercentage || 0}% ` }}</span>
											<span class="opacity-70">по промокоду</span>
										</div>
									</div>
									<div class="deposit-modal__total-sum font-weight-bold">{{ formattedDeposit }}</div>
								</div>
							</v-sheet>

							<v-btn
								class="flex-grow-0"
								color="primary font-weight-medium"
								variant="flat"
								block
								height="38"
								type="submit"
							>
								Оплатить счет на {{ formattedDeposit }}
							</v-btn>
						</v-sheet>
					</v-form>
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
			default: new URL("../../assets/images/modal-image.jpg", import.meta.url).href,
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
	});

	const emit = defineEmits(["submit", "apply-promo", "edit-discount"]);

	const CASH_METHOD = "Наличные";
	const CARD_METHOD = "Банковская карта";
	const SPLIT_METHOD = "Разделить";

	const quickAmounts = [250, 500, 1000, 1500];

	const depositFormRef = $ref(null);
	const promoFormRef = $ref(null);

	const comment = $ref(null);

	const deposit = $ref(Number(props.initialDeposit) || Number(quickAmounts[0]) || undefined);
	const currentDeposit = $ref(768);

	const paymentMethod = $ref();

	const cashAmount = $ref(null);
	const cardAmount = $ref(null);

	const discountModelValue = $ref(props.discount);

	const promoCode = $ref("");

	const promoCodeBonuspercentage = $ref(0);

	const blocked = $ref(false);

	const resolvedBackgroundImage = $computed(() => props.backgroundImage);

	const formattedDeposit = $computed(() => formatMoney(deposit));

	const formatMoney = (value) => {
		const amount = Number(value) || 0;
		return `${new Intl.NumberFormat("ru-RU").format(amount)} ₽`;
	};

	const onSubmit = async () => {
		await depositFormRef?.validate();
		emit("submit", {
			deposit: Number(deposit) || 0,
			paymentMethod: paymentMethod,
			split: {
				cash: cashAmount,
				card: cardAmount,
			},
		});
	};

	const applyPromo = async () => {
		await promoFormRef?.validate();
		emit("apply-promo", {
			promoCode,
		});
	};
</script>
