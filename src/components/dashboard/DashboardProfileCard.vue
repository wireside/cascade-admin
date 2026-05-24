<template>
	<s-dashboard-panel
		class="profile-card"
		width="207"
	>
		<v-row
			v-if="testStore.loading"
			class="flex-column align-center justify-center profile-card"
		>
			<v-col class="d-inline-flex flex-column justify-center">
				<v-skeleton-loader
					type="avatar, text, text, chip"
					height="154"
				/>
			</v-col>
		</v-row>

		<div
			v-else
			class="d-flex flex-column align-center"
		>
			<v-avatar
				size="74"
				color="primary"
				class="mb-3"
			>
				<v-icon
					icon="mdi-account"
					size="38"
				/>
			</v-avatar>
			<span class="profile-card__name font-weight-medium mb-1">Админов А.</span>
			<span class="opacity-60 mb-3">+7 (999) 999 90-99</span>
			<div class="profile-card__badge bg-primary">
				<v-icon
					icon="mdi-timer-outline mr-1"
					size="14"
				/>
				<span class="text-background">{{ now }}</span>
			</div>
		</div>
	</s-dashboard-panel>
</template>

<script setup>
	const testStore = useTestStore();
	import { ref, onMounted, onUnmounted } from "vue";

	function formatNow(date = new Date()) {
		const dayMonth = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(date);
		const time = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);

		return `${dayMonth} ${time}`;
	}

	const now = ref(formatNow());

	let timer = null;
	onMounted(() => {
		const msToNextMinute = (60 - new Date().getSeconds()) * 1000;

		timer = setTimeout(() => {
			now.value = formatNow();
			timer = setInterval(() => (now.value = formatNow()), 60_000);
		}, msToNextMinute);
	});
	onUnmounted(() => {
		if (timer) clearInterval(timer);
	});
</script>

<style lang="scss">
	.profile-card {
		&__name {
			font-size: 18px;
		}

		&__badge {
			padding: 5px 10px;
			border-radius: 6px !important;
		}
	}
</style>
