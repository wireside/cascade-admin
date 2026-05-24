<template>
	<div
		class="w-100 h-screen"
		:style="{ background: 'url(' + background + ') no-repeat center center / cover' }"
	>
		<video
			:src="backgroundVideo"
			class="position-cover h-screen"
			style="width: 100vw; height: 100vh; object-fit: cover"
			autoplay
			muted
			loop
			playsinline
		/>
		<div class="position-cover background-cover w-100 h-100 d-flex justify-center align-center">
			<div class="auth-card w-100 pa-10">
				<div class="w-100 d-flex align-center justify-center">
					<div>
						<v-img
							src="@/assets/images/auth-logo.svg"
							width="auto"
						/>
					</div>
				</div>
				<template v-if="!authStore.isAuthenticated">
					<v-window
						v-model="currentStep"
						class="mt-4"
					>
						<v-window-item>
							<div class="d-flex align-center justify-center">
								<div
									class="mr-1 cursor-pointer transition-color text-body-large"
									:class="{ 'text-disabled': currentTab !== 'auth' }"
									@click="currentTab = 'auth'"
								>
									Авторизация
								</div>
								<div
									class="ml-1 cursor-pointer transition-color text-body-large"
									:class="{ 'text-disabled': currentTab !== 'registration' }"
									@click="currentTab = 'registration'"
								>
									Регистрация
								</div>
							</div>
						</v-window-item>
						<v-window-item>
							<div class="d-flex align-center justify-center text-body-large">
								<div>Подтверждение номера телефона</div>
							</div>
						</v-window-item>
					</v-window>
					<v-window
						v-model="currentTab"
						class="mt-4"
					>
						<v-window-item value="auth">
							<auth-form
								@confirmation="openConfirmation()"
								@done="handleAuthorized()"
							/>
						</v-window-item>
						<v-window-item value="registration">
							<registration-form @done="openConfirmation()" />
						</v-window-item>
						<v-window-item value="confirmation">
							<phone-confirmation-form
								@back="goBackToRegistration()"
								@done="handleAuthorized()"
							/>
						</v-window-item>
					</v-window>
				</template>
				<div
					v-else
					class="mt-6"
				>
					<div class="text-h5 text-center">Вы авторизованы</div>
					<div class="mt-2 text-center">{{ authStore.user?.userName }}</div>
					<div class="text-disabled text-center">{{ authStore.user?.phone }}</div>
					<div
						v-if="authStore.user?.email"
						class="text-disabled text-center"
					>
						{{ authStore.user.email }}
					</div>
					<s-btn
						class="w-100 mt-4"
						@click="logout"
					>
						Выйти
					</s-btn>
				</div>
			</div>
		</div>
	</div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>

<script setup>
	import background from "@/assets/images/auth-background.png";
	import backgroundVideo from "@/assets/videos/auth-background.webm";

	const authStore = useAuthStore();
	let currentStep = $ref(0);
	let currentTab = $ref("auth");

	onMounted(async () => {
		await authStore.bootstrap();
		syncStep();
	});

	watch(
		() => [authStore.isAuthenticated, authStore.pendingPhone],
		() => syncStep()
	);

	function syncStep() {
		if (authStore.isAuthenticated) {
			currentStep = 0;
			currentTab = "auth";
			return;
		}

		if (authStore.pendingPhone) {
			currentStep = 1;
			currentTab = "confirmation";
			return;
		}

		if (currentTab === "confirmation") {
			currentTab = "auth";
		}

		currentStep = 0;
	}

	function openConfirmation() {
		currentStep = 1;
		currentTab = "confirmation";
	}

	function goBackToRegistration() {
		currentStep = 0;
		currentTab = "registration";
	}

	function handleAuthorized() {
		syncStep();
	}

	async function logout() {
		await authStore.logout();
		currentStep = 0;
		currentTab = "auth";
	}
</script>

<style scoped lang="scss">
	.background-cover {
		background: rgba(9, 9, 9, 0.9);
	}

	.auth-card {
		max-width: 450px;
	}
</style>
