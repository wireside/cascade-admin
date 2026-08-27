<template>
	<v-sheet
		rounded="lg"
		elevation="0"
		class="payment-details-panel d-flex flex-column bg-surface text-white pa-6"
	>
		<div class="mb-10">
			<div>
				<div class="payment-details-panel__title font-weight-medium mb-2">Платеж №{{ payment.number }}</div>
				<div class="text-white opacity-70">{{ payment.detailsDate }}</div>
			</div>
		</div>

		<div class="payment-details-panel__positions flex-1-1 overflow-y-auto pr-1">
			<div class="payment-details-panel__positions-title font-weight-medium mb-4">Позиции в чеке</div>

			<div class="d-flex flex-column ga-2">
				<div
					v-for="position in payment.positions"
					:key="position.name"
					class="payment-details-panel__position d-flex align-center justify-space-between ga-4 rounded-md bg-primary bg-opacity-10 px-4 py-3"
				>
					<div class="min-width-0 text-white">
						<div class="font-weight-medium text-truncate mb-1">{{ position.name }}</div>
						<div class="payment-details-panel__quantity opacity-50">Кол-во: {{ position.quantity }}</div>
					</div>
					<div class="font-weight-medium text-no-wrap text-white">
						{{ formatMoney(position.price * position.quantity) }}
					</div>
				</div>
			</div>
		</div>

		<div class="pt-6">
			<div class="payment-details-panel__total d-flex align-center justify-space-between font-weight-medium mb-5">
				<span>Итого</span>
				<span>{{ formatMoney(payment.total) }}</span>
			</div>

			<v-btn
				:disabled="payment.status.label === 'Отменён'"
				variant="flat"
				color="red"
				height="40"
				block
				rounded="md"
				class="bg-opacity-25 text-red"
				@click="emit('cancel', payment)"
			>
				<v-icon
					icon="mdi-plus-circle-outline"
					size="16"
					class="mr-2"
				/>
				{{ payment.status.label === "Отменён" ? "Платеж отменён" : "Отменить платеж" }}
			</v-btn>
		</div>
	</v-sheet>
</template>

<script setup>
	defineProps({
		payment: {
			type: Object,
			required: true,
		},
	});

	const emit = defineEmits(["cancel"]);

	const formatMoney = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
</script>

<style scoped lang="scss">
	.payment-details-panel {
		min-height: 540px;
		border-radius: 10px !important;

		&__title {
			font-size: 18px;
		}

		&__positions {
			min-height: 0;

			&-title {
				font-size: 16px;
			}
		}

		&__position {
			min-height: 52px;
		}

		&__quantity {
			font-size: 12px;
			line-height: 14px;
		}

		&__total {
			font-size: 16px;
			line-height: 120%;
		}
	}
</style>
