<template>
	<v-main class="default-layout text-white bg-background">
		<v-navigation-drawer
			v-model="navOpen"
			:temporary="isCompact"
			:permanent="!isCompact && navOpen"
			color="sidebar"
			width="228"
			class="default-layout__navigation border-0"
		>
			<nav-menu />
		</v-navigation-drawer>
		<div class="default-layout__content d-flex flex-column">
			<header class="default-layout__header d-flex align-center ga-2 px-7 border-b bg-background">
				<v-btn
					:aria-expanded="navOpen"
					icon="sidebar"
					variant="text"
					color="white"
					size="28"
					aria-label="Переключить навигацию"
					@click="navOpen = !navOpen"
				/>
				<v-btn
					:color="isFavorite ? 'primary' : 'white'"
					:aria-pressed="isFavorite"
					:disabled="!canFavorite"
					icon="star"
					variant="text"
					size="28"
					aria-label="Добавить страницу в избранное"
					@click="toggleFavorite(route.path)"
				/>
				<div class="d-flex align-center ga-2 pl-2 text-no-wrap overflow-hidden">
					<router-link
						:to="parentRoute || '/'"
						class="text-secondary text-decoration-none px-2 py-1"
					>
						{{ branchName }}
					</router-link>
					<span class="text-muted">/</span>
					<span class="px-2 py-1 text-truncate">{{ route.meta.title }}</span>
				</div>
				<v-spacer />
				<v-menu
					:close-on-content-click="true"
					location="bottom end"
				>
					<template #activator="{ props }">
						<div
							v-bind="props"
							class="default-layout__search"
						>
							<s-search-bar
								ref="headerSearch"
								v-model="searchQuery"
								placeholder="Поиск"
								shortcut="⌘/"
								height="28"
								width="200"
							/>
						</div>
					</template>
					<v-list
						class="pa-2"
						min-width="240"
					>
						<v-list-item
							v-for="item in searchResults"
							:key="item.to"
							:to="item.to"
							:prepend-icon="item.icon"
							:title="item.label"
						/>
						<v-list-item
							v-if="!searchResults.length"
							title="Страницы не найдены"
						/>
					</v-list>
				</v-menu>
				<div class="d-flex align-center ga-2 pl-3">
					<v-menu location="bottom end">
						<template #activator="{ props }">
							<v-btn
								v-bind="props"
								icon="sun"
								variant="text"
								color="white"
								size="28"
								aria-label="Оформление"
							/>
						</template>
						<v-list class="pa-2">
							<v-list-item
								title="Тёмная тема"
								prepend-icon="check"
							/>
						</v-list>
					</v-menu>
					<v-menu location="bottom end">
						<template #activator="{ props }">
							<v-btn
								v-bind="props"
								icon="clock-counter-clockwise"
								variant="text"
								color="white"
								size="28"
								aria-label="История страниц"
							/>
						</template>
						<v-list
							class="pa-2"
							min-width="220"
						>
							<v-list-item
								v-for="item in recentPages"
								:key="item.to"
								:to="item.to"
								:title="item.label"
								:prepend-icon="item.icon"
							/>
						</v-list>
					</v-menu>
					<v-menu location="bottom end">
						<template #activator="{ props }">
							<v-btn
								v-bind="props"
								icon="bell"
								variant="text"
								color="white"
								size="28"
								aria-label="Уведомления"
							/>
						</template>
						<v-sheet
							class="pa-5"
							width="280"
						>
							<div class="font-weight-semibold mb-2">Уведомления</div>
							<div class="text-secondary">Новых уведомлений нет</div>
						</v-sheet>
					</v-menu>
					<v-btn
						:aria-expanded="rightPanelOpen"
						icon="sidebar"
						variant="text"
						color="white"
						size="28"
						aria-label="Быстрый доступ"
						@click="rightPanelOpen = !rightPanelOpen"
					/>
				</div>
			</header>
			<div
				:class="{ 'default-layout__page--original': route.path !== '/devices' }"
				class="default-layout__page"
			>
				<router-view v-slot="{ Component }">
					<component :is="Component" />
				</router-view>
			</div>
		</div>
		<v-navigation-drawer
			v-model="rightPanelOpen"
			temporary
			location="right"
			color="sidebar"
			width="280"
		>
			<div class="pa-5">
				<div class="d-flex align-center justify-space-between mb-4">
					<span class="font-weight-semibold">Избранное</span>
					<v-btn
						icon="close"
						variant="text"
						color="white"
						size="28"
						aria-label="Закрыть панель"
						@click="rightPanelOpen = false"
					/>
				</div>
				<v-list bg-color="transparent">
					<v-list-item
						v-for="item in favoritePages"
						:key="item.to"
						:to="item.to"
						:title="item.label"
						:prepend-icon="item.icon"
						@click="rightPanelOpen = false"
					/>
				</v-list>
				<div
					v-if="!favoritePages.length"
					class="text-secondary"
				>
					Добавляйте страницы кнопкой со звездой.
				</div>
			</div>
		</v-navigation-drawer>
	</v-main>
</template>

<script setup>
	import { useDisplay } from "vuetify";
	import { navigationPages, useNavigation } from "@/composables/navigation";
	const { lgAndUp } = useDisplay();
	const route = useRoute();
	const { favoritePaths, recentPaths, resolvePages, rememberPage, toggleFavorite } = useNavigation();
	let navOpen = $ref(lgAndUp.value);
	let rightPanelOpen = $ref(false);
	let searchQuery = $ref("");
	const headerSearch = $ref(null);
	useEventListener("keydown", (event) => {
		if ((event.metaKey || event.ctrlKey) && event.code === "Slash") {
			event.preventDefault();
			headerSearch?.focus();
		}
	});
	const isCompact = $computed(() => !lgAndUp.value);
	const branchName = $computed(() => route.meta.parentTitle || "Дашборд");
	const parentRoute = $computed(() => route.meta.parentRoute);
	const isFavorite = $computed(() => favoritePaths.value.includes(route.path));
	const canFavorite = $computed(() => navigationPages.some((item) => item.to === route.path));
	const recentPages = $computed(() => resolvePages(recentPaths.value));
	const favoritePages = $computed(() => resolvePages(favoritePaths.value));
	const searchResults = $computed(() =>
		navigationPages.filter((item) => item.label.toLocaleLowerCase("ru").includes(searchQuery.toLocaleLowerCase("ru")))
	);
	watch(
		() => route.path,
		(path) => {
			rememberPage(path);
			if (isCompact) navOpen = false;
		},
		{ immediate: true }
	);
	watch(
		() => isCompact,
		(compact) => {
			navOpen = !compact;
		}
	);
</script>

<style scoped lang="scss">
	.default-layout {
		height: 100dvh;
		overflow: hidden;
		&__content {
			height: 100%;
			min-height: 0;
			min-width: 0;
		}
		&__header {
			min-height: 68px;
			flex-shrink: 0;
			z-index: 10;
			border-color: rgb(var(--v-theme-menu)) !important;
		}
		&__header :deep(.v-btn .v-icon) {
			font-size: 20px;
		}
		&__page {
			flex: 1 1 auto;
			min-width: 0;
			min-height: 0;
			overflow: auto;
			padding: 24px 28px;
			overscroll-behavior: none;
		}
		&__page--original {
			padding: 20px;
			line-height: 100%;
			scrollbar-gutter: stable;
		}
		&__search :deep(.s-search-bar__field) {
			background: rgba(var(--v-theme-white), 0.06) !important;
			gap: 8px;
		}
		&__search :deep(input) {
			padding: 0;
			height: 20px;
		}
		&__search :deep(input::placeholder) {
			color: rgb(var(--v-theme-muted));
		}
		&__search :deep(.v-icon) {
			color: rgb(var(--v-theme-muted)) !important;
			opacity: 1 !important;
		}
		@media (max-width: 767px) {
			&__header {
				padding-inline: 12px !important;
				flex-wrap: wrap;
				padding-block: 12px;
			}
			&__search {
				order: 3;
				width: 100%;
			}
			&__search :deep(.s-search-bar) {
				width: 100% !important;
			}
			&__page:not(.default-layout__page--original) {
				padding: 16px 12px;
			}
		}
	}
	:global(html:has(.v-overlay.v-dialog.v-overlay--active)),
	:global(html:has(.v-overlay.v-dialog.v-overlay--active) body) {
		overflow: hidden !important;
		overscroll-behavior: none;
	}
</style>
