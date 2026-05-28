<template>
	<div class="px-6 pt-7 pb-5">
		<div class="d-flex flex-column align-start w-100">
			<v-img
				src="../../assets/images/cascade-logo.svg"
				width="168px"
				class="mb-7 align-self-center"
			/>

			<div class="mb-10 w-100">
				<div
					v-for="section in navigation"
					:key="section.title"
				>
					<div class="text-white opacity-4 mb-4">{{ section.title }}</div>
					<div class="d-flex flex-column ga-1 mb-4">
						<v-btn
							v-for="item in section.items"
							:key="item.label"
							:to="item.to ?? null"
							:prepend-icon="item.icon"
							:ripple="false"
							:class="{ 'bg-primary bg-opacity-20 nav-link--active': route.path === item.to }"
							class="bg-background justify-start opacity-100 pl-6"
							active-color="white"
							color="secondary"
							variant="plain"
							height="46px"
							rounded="8px"
							@click="navOpen = false"
						>
							<span>{{ item.label }}</span>
						</v-btn>
					</div>
				</div>
			</div>

			<div class="mt-10 d-flex flex-column ga-3 w-100">
				<v-btn
					:ripple="false"
					prepend-icon="mdi-chat"
					class="bg-primary bg-opacity-20 border-half-primary opacity-100"
					color="white"
					variant="plain"
					height="38px"
					rounded="8px"
				>
					<span>Чат с поддержкой</span>
				</v-btn>
				<v-img
					cover
					src="../../assets/images/premium-support.jpg"
					alt="premium-support"
					height="106px"
					class="rounded-md pl-5 pt-4"
				>
					<div class="fill-height">
						<div class="premium-support__title mb-2 text-black font-weight-bold">Premium Support</div>
						<div class="premium-support__text text-black">
							Полный цикл обслуживания и поддержки IT-структуры вашего клуба
						</div>
					</div>
				</v-img>
			</div>
		</div>
	</div>
</template>

<script setup>
	const route = useRoute();
	const navigation = [
		{
			title: "Основные",
			items: [
				{ label: "Дашборд", icon: "mdi-home-outline", to: "/" },
				{ label: "Устройства", icon: "mdi-monitor", to: "/devices" },
				{ label: "Карта клуба", icon: "mdi-map-outline" },
				{ label: "Бронирования", icon: "mdi-clock-outline" },
			],
		},
		{
			title: "Клиенты и финансы",
			items: [
				{ label: "Платежи", icon: "mdi-currency-rub" },
				{ label: "Клиенты", icon: "mdi-account-group-outline" },
				{ label: "Аналитика", icon: "mdi-finance" },
			],
		},
		{
			title: "Настройки филиала",
			items: [
				{ label: "Приложения", icon: "mdi-apps" },
				{ label: "Тарифы", icon: "mdi-timelapse" },
				{ label: "Товары", icon: "mdi-store-outline" },
				{ label: "Услуги", icon: "mdi-store-outline" },
				{ label: "Наборы", icon: "mdi-archive" },
			],
		},
	];
</script>

<style lang="scss">
	.nav-link--active {
		opacity: 1 !important;
		position: relative;
		border-radius: 8px;
		background-clip: padding-box;

		&::before {
			content: "";
			position: absolute;
			inset: 0;
			// толщина рамки
			padding: 1px;
			border-radius: inherit;
			pointer-events: none;
			background: linear-gradient(
				90deg,
				rgba(171, 244, 62, 1) 0%,
				rgba(17, 17, 17, 0.08) 25%,
				rgba(17, 17, 17, 0) 50%,
				rgba(17, 17, 17, 0.15) 75%,
				rgba(171, 244, 62, 1) 100%
			);
			mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#000 0 0);
			mask-composite: exclude;
		}
	}

	.premium-support {
		&__title {
			font-size: 18px;
			letter-spacing: 1%;
			line-height: 100%;
		}

		&__text {
			font-size: 14px;
			letter-spacing: 1%;
			line-height: 120%;
			max-width: 178px;
		}
	}
</style>
