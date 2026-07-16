<template>
	<v-menu
		:offset="[5, 0]"
		class="profile-menu"
	>
		<template v-slot:activator="{ props }">
			<v-btn
				v-bind="props"
				height="40"
				min-width="166"
				class="bg-white bg-opacity-5 d-block profile-menu__dropdown"
				:variant="null"
				:ripple="null"
			>
				<div class="flex-grow-1 d-flex align-center text-white justify-start">
					<div class="d-flex align-center ga-2 mr-5 w-100 flex-grow-1">
						<v-avatar size="24">
							<v-img
								color="secondary"
								alt="Default profile picture"
								src="../../assets/images/profile-avatar.png"
							/>
						</v-avatar>
						<span>{{ user?.userName || "Киллов Я." }}</span>
					</div>
					<v-icon
						icon="mdi-chevron-down"
						size="16"
						class="opacity-50"
					/>
				</div>
			</v-btn>
		</template>

		<v-sheet
			class="profile-menu__content pa-3 d-flex flex-column ga-1"
			min-width="300"
		>
			<v-btn
				v-for="account in accountsList"
				:key="account.userName"
				class="profile-menu__account-list-item bg-white bg-opacity-5 text-white justify-start d-block"
				height="56"
			>
				<div class="flex-grow-1 d-flex justify-space-between align-center">
					<div class="d-flex align-center ga-2 justify-start">
						<v-avatar
							color="secondary"
							size="34"
						>
							<v-img
								alt="Default profile picture"
								src="../../assets/images/profile-avatar.png"
							/>
						</v-avatar>

						<div class="d-flex flex-column justify-space-between align-start">
							<span>{{ account.name }}</span>
							<span class="profile-menu__phone opacity-50">{{ account.phone }}</span>
						</div>
					</div>

					<span
						v-if="account.role"
						color="primary"
						class="profile-menu__role-badge text-primary bg-primary bg-opacity-20 d-inline-flex align-center"
					>
						{{ account.role }}
					</span>
				</div>
			</v-btn>

			<div class="d-flex flex-column ga-1">
				<v-btn
					class="profile-menu__menu-btn w-100 px-4 rounded-md text-white justify-start text-none"
					height="48"
					variant="text"
					:ripple="false"
				>
					<div class="w-100 d-flex align-center ga-2">
						<v-icon
							icon="mdi-bullhorn-outline"
							size="24"
						/>
						<span>Блог</span>
					</div>
				</v-btn>

				<v-btn
					class="profile-menu__menu-btn w-100 px-4 rounded-md text-white justify-start text-none"
					height="48"
					variant="text"
					:ripple="false"
				>
					<div class="w-100 d-flex align-center ga-2">
						<v-icon
							icon="mdi-bookmark-box-outline"
							size="24"
						/>
						<span>База знаний</span>
					</div>
				</v-btn>

				<v-btn
					class="profile-menu__menu-btn w-100 px-4 rounded-md text-white justify-start opacity-100"
					height="48"
					variant="plain"
					:ripple="false"
				>
					<div class="w-100 d-flex align-center ga-2">
						<v-icon
							icon="mdi-translate"
							size="24"
						/>
						<span>Язык</span>
						<div class="ml-auto d-flex align-center ga-1">
							<img
								class="profile-menu__language-flag"
								src="../../assets/images/russian-flag.png"
								alt="Русский"
							/>
							<span class="opacity-50">Русский</span>
						</div>
					</div>
				</v-btn>

				<v-btn
					class="profile-menu__menu-btn w-100 px-4 rounded-md bg-primary bg-opacity-20 justify-start"
					height="48"
					variant="text"
					:ripple="false"
				>
					<div class="w-100 d-flex align-center ga-2 text-primary">
						<v-icon
							icon="mdi-cog-outline"
							size="24"
						/>
						<span>Настройки</span>
					</div>
				</v-btn>

				<v-btn
					class="profile-menu__menu-btn profile-menu__logout bg-transparent w-100 px-4 rounded-md text-red justify-start bg-opacity-20"
					height="48"
					:variant="null"
					:ripple="false"
					@click="logout"
				>
					<div class="w-100 d-flex align-center ga-2">
						<v-icon
							icon="mdi-logout"
							size="24"
						/>
						<span>Выйти из аккаунта</span>
					</div>
				</v-btn>
			</div>
		</v-sheet>
	</v-menu>
</template>

<script setup>
	const authStore = useAuthStore();

	const user = $computed(() => authStore?.user);

	const accountsList = $computed(() => {
		if (user) {
			return [
				{ name: user?.userName, userName: user?.userName, phone: user?.phone },
				{
					name: "Алексей Топоров",
					userName: "alexeykillov",
					phone: "+7 (999) 999-67-67",
					role: "Кассир",
				},
			];
		}

		return [
			{
				name: "Киллов Ян",
				userName: "hatekilla",
				phone: "+7 (999) 999-67-67",
			},
			{
				name: "Алексей Топоров",
				userName: "alexeytopor",
				phone: "+7 (888) 999-67-67",
				role: "Кассир",
			},
		];
	});

	const logout = () => {
		authStore.logout();
	};
</script>

<style lang="scss" scoped>
	.profile-menu {
		&__dropdown {
			padding: 7px 15px 9px 15px;

			&::v-deep(.v-btn__overlay) {
				opacity: 0 !important;
			}
		}

		&__content {
			border-radius: 12px;
			background-color: #151515;
		}

		&__account-list-item {
			padding: 11px 15px;
			line-height: 125% !important;
		}

		&__phone {
			font-size: 12px;
			line-height: 125%;
		}

		&__role-badge {
			height: 16px;
			border-radius: 10px !important;
			font-size: 10px;
			padding: 1.5px 8px;
		}

		&__menu-btn {
			letter-spacing: 0;

			&::v-deep(.v-btn__content) {
				width: 100%;
			}

			&::v-deep(.v-btn__overlay) {
				opacity: 0 !important;
			}
		}

		&__logout {
			&::v-deep(.v-btn__overlay) {
				opacity: 0 !important;
			}

			&:hover,
			&:active {
				background-color: rgba(var(--v-theme-red), 20%) !important;
			}
		}

		&__language-flag {
			width: 18px;
			height: 12px;
			object-fit: cover;
			border-radius: 1px;
		}
	}
</style>
