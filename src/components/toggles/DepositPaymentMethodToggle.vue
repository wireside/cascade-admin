<template>
	<v-btn-toggle
		v-model="model"
		:density="null"
		mandatory
		class="d-flex ga-3 flex-wrap rounded-0"
	>
		<v-row gap="6px">
			<v-col
				v-for="method in paymentMethods"
				:key="method"
				cols="4"
			>
				<v-btn
					:value="method"
					:class="{
						'bg-primary bg-opacity-10': method === model,
						'bg-white bg-opacity-3 text-white': method !== model,
					}"
					:ripple="false"
					:variant="null"
					class="deposit-modal__payment-method-btn font-weight-medium w-100"
					rounded="sm"
					height="72"
				>
					<div
						class="opacity-70 d-flex flex-column align-center justify-center ga-1"
						:class="{ 'text-primary': method === model }"
					>
						<s-smart-icon
							:icon="paymentMethodsIcons[method]"
							:color="method === model ? 'primary' : 'white'"
							size="28"
						/>
						<span>{{ method }}</span>
					</div>
				</v-btn>
			</v-col>
			<template v-if="model === props.splitMethod">
				<v-col cols="6">
					<split-payment-field
							v-model="cashAmountProxy"
							:placeholder="CASH_METHOD"
							@beforechange="filterAmountIsNotMoreThenDeposit"
					/>
				</v-col>
				<v-col cols="6">
					<split-payment-field
							v-model="cardAmountProxy"
							:placeholder="CARD_METHOD"
							@beforechange="filterAmountIsNotMoreThenDeposit"
					/>
				</v-col>
			</template>
		</v-row>
	</v-btn-toggle>
</template>

<script setup>
	const CASH_METHOD = "Наличные";
	const CARD_METHOD = "Банковская карта";
	const SPLIT_METHOD = "Разделить";

	const model = defineModel({ type: String, required: true, default: () => CASH_METHOD });
	const cashAmount = defineModel("cash-amount", {
		default: null,
	});
	const cardAmount = defineModel("card-amount", {
		default: null,
	});

	const props = defineProps({
		deposit: {
			type: [Number, String],
			default: 0,
			required: true,
		},
		cashMethod: {
			type: String,
			default: CASH_METHOD,
		},
		cardMethod: {
			type: String,
			default: CARD_METHOD,
		},
		splitMethod: {
			type: String,
			default: SPLIT_METHOD,
		},
	})

	const paymentMethods = [props.cashMethod, props.cardMethod, props.splitMethod];
	const paymentMethodsIcons = {
		[props.cashMethod]: "mdi:cash",
		[props.cardMethod]: "solar:card-outline",
		[props.splitMethod]: "ic:baseline-divide",
	};

	const normalizedDeposit = computed(() => Math.max(Number(props.deposit) || 0, 0));
	const lastEditedField = ref(null);
	const isEmptyValue = (value) => value === null || value === undefined || value === "";

	const clampAmount = (value) => {
		if (isEmptyValue(value)) {
			return null;
		}

		const amount = Math.max(Number(value) || 0, 0);
		return Math.min(amount, normalizedDeposit.value);
	};

	const syncAmounts = (primaryAmount, primaryField) => {
		const nextCashAmount = clampAmount(primaryAmount);

		if (nextCashAmount === null) {
			cashAmount.value = null;
			cardAmount.value = null;
			lastEditedField.value = primaryField;
			return;
		}

		const nextCardAmount = Math.max(normalizedDeposit.value - nextCashAmount, 0);

		cashAmount.value = nextCashAmount;
		cardAmount.value = nextCardAmount;
		lastEditedField.value = primaryField;
	};

	const cashAmountProxy = computed({
		get() {
			return cashAmount.value ?? null;
		},
		set(value) {
			syncAmounts(value, "cash");
		},
	});

	const cardAmountProxy = computed({
		get() {
			return cardAmount.value ?? null;
		},
		set(value) {
			const nextCardAmount = clampAmount(value);

			if (nextCardAmount === null) {
				cashAmount.value = null;
				cardAmount.value = null;
				lastEditedField.value = "card";
				return;
			}

			const nextCashAmount = Math.max(normalizedDeposit.value - nextCardAmount, 0);

			cardAmount.value = nextCardAmount;
			cashAmount.value = nextCashAmount;
			lastEditedField.value = "card";
		},
	});

	watch(
		() => normalizedDeposit.value,
		(deposit) => {
			if (model.value !== props.splitMethod) {
				return;
			}

			if (isEmptyValue(cashAmount.value) && isEmptyValue(cardAmount.value)) {
				return;
			}

			if (lastEditedField.value === "cash" && !isEmptyValue(cashAmount.value)) {
				cardAmount.value = Math.max(deposit - Number(cashAmount.value), 0);
				return;
			}

			if (lastEditedField.value === "card" && !isEmptyValue(cardAmount.value)) {
				cashAmount.value = Math.max(deposit - Number(cardAmount.value), 0);
			}
		},
		{ immediate: true }
	);

	const filterAmountIsNotMoreThenDeposit = ({ e, futureValue}) => {
		if (+futureValue > +props.deposit) {
			e.preventDefault();
		}
	}
</script>

<style scoped lang="scss">
	.deposit-modal__payment-method-btn {
		& ::v-deep(.v-btn__overlay) {
			opacity: 0;
		}
	}
</style>
