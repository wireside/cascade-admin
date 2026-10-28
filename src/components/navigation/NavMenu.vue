<template>
	<nav
		class="nav-menu d-flex flex-column ga-4 px-4 py-5"
		aria-label="Главная навигация"
	>
		<profile-menu compact />
		<div>
			<div
				class="d-flex ga-2 py-1 pl-1"
				role="tablist"
				aria-label="Быстрый доступ"
			>
				<v-btn
					v-for="tab in quickTabs"
					:key="tab.value"
					:aria-selected="quickTab === tab.value"
					:color="quickTab === tab.value ? 'content-secondary' : 'muted'"
					height="28"
					variant="text"
					class="px-2 font-weight-regular"
					role="tab"
					@click="quickTab = tab.value"
				>
					{{ tab.label }}
				</v-btn>
			</div>
			<v-btn
				v-for="item in quickPages"
				:key="item.to"
				:to="item.to"
				variant="text"
				color="white"
				height="32"
				class="nav-menu__quick d-flex justify-start px-2 mt-1 font-weight-regular"
			>
				<span class="nav-menu__dot mx-2 mr-4 bg-muted rounded-circle" />
				{{ item.label }}
			</v-btn>
			<div
				v-if="!quickPages.length"
				class="text-muted text-caption px-3 py-2"
			>
				Пока пусто
			</div>
		</div>
		<div
			v-for="section in navigation"
			:key="section.title"
		>
			<div class="text-secondary px-3 py-1 mb-1 nav-menu__section">{{ section.title }}</div>
			<div class="d-flex flex-column nav-menu__items">
				<template
					v-for="item in section.items"
					:key="item.label"
				>
					<nav-sub-menu
						v-if="item.items"
						:label="item.label"
						:icon="item.icon"
						:items="item.items"
					/>
					<nav-link
						v-else
						:to="item.to"
						:label="item.label"
						:prepend-icon="item.icon"
					/>
				</template>
			</div>
		</div>
		<div class="flex-grow-1" />
		<div class="d-flex align-center ga-2 px-2 flex-shrink-0">
			<v-sheet
				color="primary"
				width="24"
				height="24"
				rounded="sm"
				class="d-flex align-center justify-center text-on-primary font-weight-bold"
			>
				C
			</v-sheet>
			<span class="font-weight-bold">Cascade</span>
			<span class="text-caption text-muted ml-auto">v1.5.2</span>
		</div>
	</nav>
</template>

<script setup>
	import { navigation, useNavigation } from "@/composables/navigation";
	const { favoritePaths, recentPaths, resolvePages } = useNavigation();
	let quickTab = $ref("favorites");
	const quickTabs = [
		{ value: "favorites", label: "Избранное" },
		{ value: "recent", label: "Недавние" },
	];
	const quickPages = $computed(() => resolvePages(quickTab === "favorites" ? favoritePaths.value : recentPaths.value));
</script>

<style scoped lang="scss">
	.nav-menu {
		min-height: 100%;
		&__section {
			line-height: 20px;
		}
		&__dot {
			width: 6px;
			height: 6px;
		}
		&__quick {
			width: 100%;
		}
		&__quick :deep(.v-btn__overlay) {
			opacity: 0;
		}
		&__items {
			gap: 2px;
		}
	}
</style>
