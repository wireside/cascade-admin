<template>
	<div class="px-6 pt-7 pb-5">
		<div class="d-flex flex-column align-start w-100">
			<v-img
				src="../../assets/images/cascade-logo.svg"
				width="168px"
				class="mb-1 align-self-center"
			/>

			<div class="mb-10 w-100">
				<div
					v-for="section in navigation"
					:key="section.title"
				>
					<div class="section-title py-1 text-white opacity-4 mb-1">{{ section.title }}</div>
					<div class="d-flex flex-column ga-1 mb-4">
						<template
							v-for="item in section.items"
							:key="item.label"
						>
							<nav-sub-menu
								v-if="item.items && item.items.length > 0"
								:label="item.label"
								:icon="item.icon"
								:items="item.items"
							/>
							<nav-link
								v-else
								:to="item.to"
							>
								<div class="d-flex align-center ga-2">
									<v-icon
										:icon="item.icon"
										size="20"
									/>
									<span>{{ item.label }}</span>
								</div>
							</nav-link>
						</template>
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
				{ label: "Дашборд", icon: "mdi-chart-pie-outline", to: "/" },
				{ label: "Устройства", icon: "mdi-desktop-tower-monitor", to: "/devices" },
				{ label: "Карта клуба", icon: "mdi-map-outline" },
				{ label: "Бронирования", icon: "mdi-calendar-clock-outline" },
				{ label: "Магазин", icon: "mdi-basket-outline" },
				{ label: "Аналитика", icon: "mdi-finance" },
			],
		},
		{
			title: "Работа с клиентами",
			items: [
				{
					label: "Клиенты",
					icon: "mdi-account-group-outline",
					items: [{ label: "Клиенты", to: "/clients" }, { label: "Группы" }],
				},
				{ label: "Тарифы", icon: "mdi-clock-outline", to: "/rates/" },
				{ label: "Товары и услуги", icon: "mdi-shopping-outline" },
				{ label: "Система лояльности", icon: "mdi-percent-outline" },
				{ label: "Отзывы клиентов", icon: "mdi-timelapse" },
			],
		},
		{
			title: "Настройки филиала",
			items: [
				{
					label: "Детализация",
					icon: "mdi-timelapse",
					items: [{ label: "Логи" }, { label: "Платежи", to: "/payments" }],
				},
				{
					label: "Приложения",
					icon: "mdi-view-grid-plus-outline",
					items: [
						{ label: "Игры", to: "/games" },
						{ label: "Программы", to: "/apps" },
					],
				},
				{ label: "Сотрудники", icon: "mdi-badge-account-outline" },
				{ label: "Настройки", icon: "mdi-cog" },
			],
		},
	];
</script>

<style lang="scss">
	.section-title {
		line-height: 20px;
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
