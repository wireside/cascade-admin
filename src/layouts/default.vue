<template>
	<v-main class="admin-shell">
		<div class="admin-shell__frame">
			<transition name="admin-fade">
				<div
					v-if="isCompact && navOpen"
					class="admin-shell__backdrop"
					@click="navOpen = false"
				/>
			</transition>

			<aside
				class="admin-shell__sidebar"
				:class="{
					'admin-shell__sidebar--compact': isCompact,
					'admin-shell__sidebar--open': navOpen,
				}"
			>
				<div class="admin-shell__sidebar-scroll">
					<div
						v-for="section in navigation"
						:key="section.title"
						class="admin-shell__nav-group"
					>
						<div class="admin-shell__nav-title">{{ section.title }}</div>

						<div class="admin-shell__nav-list">
							<router-link
								v-for="item in section.items.filter((entry) => entry.to)"
								:key="item.label"
								:to="item.to"
								class="admin-shell__nav-item"
								:class="{ 'admin-shell__nav-item--active': route.path === item.to }"
								@click="navOpen = false"
							>
								<v-icon
									:icon="item.icon"
									size="18"
								/>
								<span>{{ item.label }}</span>
							</router-link>

							<button
								v-for="item in section.items.filter((entry) => !entry.to)"
								:key="item.label"
								type="button"
								class="admin-shell__nav-item"
							>
								<v-icon
									:icon="item.icon"
									size="18"
								/>
								<span>{{ item.label }}</span>
							</button>
						</div>
					</div>

					<div class="admin-shell__support">
						<button
							type="button"
							class="admin-shell__support-button"
						>
							<v-icon
								icon="mdi-chat-outline"
								size="16"
							/>
							<span>Чат с поддержкой</span>
						</button>

						<div class="admin-shell__support-card">
							<div class="admin-shell__support-copy">
								<div class="admin-shell__support-heading">Premium Support</div>
								<p>Полный цикл обслуживания и поддержки IT-структуры вашего клуба</p>
							</div>
							<div class="admin-shell__support-visual">
								<div class="admin-shell__support-monitor" />
								<div class="admin-shell__support-sticker">PREMIUM</div>
							</div>
						</div>
					</div>
				</div>
			</aside>

			<div class="admin-shell__content">
				<header class="admin-shell__header">
					<div class="admin-shell__header-main">
						<button
							v-if="isCompact"
							type="button"
							class="admin-shell__icon-button admin-shell__menu-button"
							@click="navOpen = !navOpen"
						>
							<v-icon
								icon="mdi-menu"
								size="20"
							/>
						</button>

						<h1 class="admin-shell__title">
							<span class="admin-shell__title-muted">{{ branchName }} / </span>
							{{ pageTitle }}
						</h1>
					</div>

					<div class="admin-shell__actions">
						<label class="admin-shell__search">
							<v-icon
								icon="mdi-magnify"
								size="16"
							/>
							<input
								type="search"
								placeholder="Клиент"
							>
						</label>

						<button
							type="button"
							class="admin-shell__icon-button"
						>
							<v-icon
								icon="mdi-cog-outline"
								size="18"
							/>
						</button>
					</div>
				</header>

				<div class="admin-shell__page">
					<router-view v-slot="{ Component }">
						<component :is="Component" />
					</router-view>
				</div>
			</div>
		</div>
	</v-main>
</template>

<script setup>
	const route = useRoute();
	const appStore = useAppStore();

	const branchName = "CYBER X Барвиха";
	const navOpen = ref(false);

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
				{ label: "Логи", icon: "mdi-menu" },
			],
		},
		{
			title: "Настройки филиала",
			items: [
				{ label: "Контент", icon: "mdi-view-module-outline" },
				{ label: "Тарифы", icon: "mdi-timelapse" },
				{ label: "Товары и услуги", icon: "mdi-store-outline" },
				{ label: "Система лояльности", icon: "mdi-percent-outline" },
				{ label: "Аналитика", icon: "mdi-finance" },
				{ label: "Настройки", icon: "mdi-cog-outline" },
			],
		},
	];

	const pageTitle = computed(() => route.meta?.title || "Дашборд");
	const isCompact = computed(() => {
		const width = appStore.window.width || window.innerWidth;
		return width < 1280;
	});

	watch(
		() => route.fullPath,
		() => {
			navOpen.value = false;
		},
	);
</script>

<style scoped lang="scss">
.admin-shell {
	--admin-bg: #090909;
	--admin-surface: rgba(17, 17, 17, 0.6);
	--admin-border: rgba(255, 255, 255, 0.12);
	--admin-border-soft: rgba(255, 255, 255, 0.08);
	--admin-text: rgba(255, 255, 255, 0.96);
	--admin-text-muted: rgba(255, 255, 255, 0.6);
	--admin-text-faint: rgba(255, 255, 255, 0.38);
	--admin-accent: #abf43e;
	--admin-accent-deep: #71b805;
	--admin-shadow: 0 16px 48px rgba(0, 0, 0, 0.34);
	min-height: 100vh;
	background:
		radial-gradient(circle at top left, rgba(171, 244, 62, 0.08), transparent 18%),
		radial-gradient(circle at bottom right, rgba(39, 127, 249, 0.08), transparent 20%),
		var(--admin-bg);
	color: var(--admin-text);
}

.admin-shell__frame { display: flex; min-height: 100vh; position: relative; }
.admin-shell__backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); z-index: 19; }
.admin-shell__sidebar { width: 350px; flex: 0 0 350px; border-right: 1px solid var(--admin-border-soft); background: rgba(9, 9, 9, 0.94); position: relative; z-index: 20; }
.admin-shell__sidebar-scroll { height: 100vh; overflow-y: auto; padding: 108px 24px 28px; display: flex; flex-direction: column; }
.admin-shell__sidebar--compact { position: fixed; inset: 0 auto 0 0; transform: translateX(-100%); transition: transform 0.28s ease; box-shadow: var(--admin-shadow); }
.admin-shell__sidebar--open { transform: translateX(0); }
.admin-shell__nav-group + .admin-shell__nav-group { margin-top: 28px; }
.admin-shell__nav-title { font-size: 14px; line-height: 1; color: var(--admin-text-faint); margin-bottom: 14px; }
.admin-shell__nav-list { display: grid; gap: 8px; }
.admin-shell__nav-item { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 46px; padding: 12px 18px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--admin-text-muted); font-size: 16px; line-height: 1; text-decoration: none; text-align: left; transition: background-color 0.28s ease, border-color 0.28s ease, color 0.28s ease; }
.admin-shell__nav-item:hover { background: rgba(255, 255, 255, 0.04); color: var(--admin-text); }
.admin-shell__nav-item--active { background: rgba(171, 244, 62, 0.18); border-color: var(--admin-accent); color: #fff; }
.admin-shell__support { margin-top: auto; padding-top: 24px; }
.admin-shell__support-button { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 38px; padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(171, 244, 62, 0.45); background: rgba(171, 244, 62, 0.18); color: #fff; font-size: 14px; line-height: 1; }
.admin-shell__support-card { margin-top: 12px; min-height: 106px; border-radius: 8px; padding: 16px 18px; display: flex; align-items: stretch; justify-content: space-between; gap: 8px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.5); background: linear-gradient(111deg, #abf43e 0%, #71b805 100%); color: #090909; position: relative; }
.admin-shell__support-card::before, .admin-shell__support-card::after { content: ""; position: absolute; border-radius: 999px; background: rgba(9, 9, 9, 0.12); }
.admin-shell__support-card::before { width: 92px; height: 92px; right: -18px; top: -18px; }
.admin-shell__support-card::after { width: 74px; height: 74px; right: 40px; bottom: -26px; }
.admin-shell__support-copy { position: relative; z-index: 1; max-width: 170px; }
.admin-shell__support-heading { font-size: 18px; font-weight: 700; line-height: 1.1; margin-bottom: 8px; }
.admin-shell__support-copy p { margin: 0; font-size: 12px; line-height: 1.25; }
.admin-shell__support-visual { position: relative; width: 92px; flex: 0 0 92px; z-index: 1; }
.admin-shell__support-monitor { position: absolute; right: 6px; top: 12px; width: 64px; height: 42px; border-radius: 10px; background: rgba(9, 9, 9, 0.85); box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.18); }
.admin-shell__support-monitor::before, .admin-shell__support-monitor::after { content: ""; position: absolute; background: rgba(171, 244, 62, 0.7); }
.admin-shell__support-monitor::before { inset: 8px; border-radius: 7px; }
.admin-shell__support-monitor::after { width: 26px; height: 6px; border-radius: 999px; bottom: -8px; left: 50%; transform: translateX(-50%); background: rgba(9, 9, 9, 0.75); }
.admin-shell__support-sticker { position: absolute; right: 0; bottom: 12px; padding: 4px 8px; border-radius: 999px; background: rgba(255, 255, 255, 0.76); font-size: 10px; font-weight: 700; line-height: 1; }
.admin-shell__content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.admin-shell__header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 24px; border-bottom: 1px solid var(--admin-border-soft); position: sticky; top: 0; z-index: 10; background: rgba(9, 9, 9, 0.88); backdrop-filter: blur(16px); }
.admin-shell__header-main { display: flex; align-items: center; gap: 12px; min-width: 0; }
.admin-shell__title { margin: 0; font-size: 22px; font-weight: 400; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.admin-shell__title-muted { color: var(--admin-text-faint); }
.admin-shell__actions { display: flex; align-items: center; gap: 8px; }
.admin-shell__search { height: 43px; min-width: 150px; display: flex; align-items: center; gap: 8px; padding: 0 14px; border-radius: 8px; border: 1px solid var(--admin-border-soft); background: rgba(17, 17, 17, 0.6); color: var(--admin-text-muted); }
.admin-shell__search input { width: 100%; border: 0; outline: 0; background: transparent; color: #fff; font-size: 14px; }
.admin-shell__search input::placeholder { color: var(--admin-text-faint); }
.admin-shell__icon-button { width: 43px; height: 43px; border-radius: 8px; border: 1px solid var(--admin-border-soft); background: rgba(17, 17, 17, 0.6); color: #fff; display: inline-flex; align-items: center; justify-content: center; }
.admin-shell__menu-button { flex: 0 0 43px; }
.admin-shell__page { flex: 1; min-height: 0; padding: 18px 24px 24px; }
.admin-fade-enter-active, .admin-fade-leave-active { transition: opacity 0.28s ease; }
.admin-fade-enter-from, .admin-fade-leave-to { opacity: 0; }

@media (max-width: 1279px) {
	.admin-shell__page { padding-top: 22px; }
}

@media (max-width: 767px) {
	.admin-shell__header { flex-direction: column; align-items: stretch; }
	.admin-shell__actions { width: 100%; }
	.admin-shell__search { flex: 1; }
	.admin-shell__title { font-size: 18px; }
}
</style>
