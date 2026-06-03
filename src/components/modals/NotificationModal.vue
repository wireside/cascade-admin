<template>
	<v-dialog
		v-model="modalOpen"
		max-width="430"
		min-height="306"
		scrim="rgba(9, 9, 9, 0.70)"
		transition="fade-transition"
		class="notification-modal"
	>
		<v-form
			ref="formRef"
			@submit.prevent="onSubmit"
		>
			<v-card
				elevation="20"
				class="notification-modal__content px-6 py-5 bg-background overflow-hidden"
			>
				<div class="d-flex align-start justify-space-between mb-2">
					<div class="font-weight-medium text-content-primary notification-modal__title">
						<span>Уведомление для Компьютер 5</span>
					</div>
					<v-btn
						:ripple="false"
						width="29px"
						height="29px"
						icon="mdi:close"
						variant="plain"
						class="bg-white bg-opacity-3 border rounded-sm"
						@click="onClose"
					>
						<v-icon
							icon="mdi-close"
							size="17"
							color="white"
							class="opacity-60"
						/>
					</v-btn>
				</div>

				<v-sheet
					max-width="352"
					class="mb-4 bg-transparent"
				>
					<span class="notification-modal__subtitle text-content-secondary text-wrap">
						Гость за выбранным устройством получит ваше текстовое сообщение на своем экране. Учтите, что ваше
						уведомление появится поверх всех окон.
					</span>
				</v-sheet>

				<s-message-field
					v-model="message"
					max-length="70"
					placeholder="Ваше сообщение..."
					max-height="110"
					rows="4"
					class="mb-4"
				/>

				<v-btn
					:density="null"
					:variant="null"
					height="40"
					type="submit"
					class="bg-white bg-opacity-3"
				>
					<span class="notification-modal__submit-btn-text font-weight-medium">Отправить</span>
				</v-btn>
			</v-card>
		</v-form>
	</v-dialog>
</template>

<script setup>
	const modalOpen = defineModel("modalOpen", { type: Boolean, default: false });

	const emit = defineEmits(["submit"]);

	const formRef = $ref(null);
	const message = $ref(null);

	const onClose = () => {
		modalOpen.value = false;
	};

	const onSubmit = async () => {
		await formRef?.validate();
		emit("submit", {
			message,
		});
	};
</script>
