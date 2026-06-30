<template>
	<v-main class="default-layout text-white bg-background">
		<div class="default-layout__shell position-relative d-flex">
			<v-navigation-drawer
				v-if="isCompact"
				v-model="navOpen"
				temporary
				color="background"
				width="350"
			>
				<nav-menu />
			</v-navigation-drawer>
			<v-navigation-drawer
				v-else
				permanent
				color="background"
				width="350"
			>
				<nav-menu />
			</v-navigation-drawer>

			<div class="default-layout__content d-flex flex-column flex-1-1">
				<header
					style="z-index: 10"
					class="position-sticky top-0 d-flex flex-column flex-md-row align-stretch align-md-center justify-space-between ga-4 px-7 py-5 bg-background border-b"
				>
					<div class="d-flex align-center ga-3">
						<s-btn-icon
							v-if="isCompact"
							:size="24"
							width="43px"
							height="43px"
							class="pa-0 ma-0"
							icon="mdi:menu"
							color="white"
							variant="text"
							@click="navOpen = !navOpen"
						/>

						<div class="m-0 d-flex align-center font-weight-regular text-no-wrap overflow-hidden">
							<div class="px-1 py-2">
								<v-icon
									:icon="route.meta.icon"
									size="16"
									color="white"
								/>
							</div>
							<div class="opacity-40 py-1 px-2">{{ branchName }}</div>
							<div class="opacity-20">/</div>
							<div class="py-1 px-2">{{ route.meta.title }}</div>
						</div>
					</div>

					<div class="d-flex align-center ga-3 flex-grow-0">
						<s-search-bar
							v-model="searchQuery"
							height="28"
						/>
						<v-btn
							variant="text"
							width="28"
							height="28"
							max-width="28"
							min-width="28"
							class="flex-grow-0 pa-0 ma-0"
						>
							<v-icon
								size="20"
								icon="mdi-cog"
							/>
							<s-tooltip>Настройки</s-tooltip>
						</v-btn>
						<!--
						For development
					-->
						<v-switch
							v-model="model"
							density="compact"
							hide-details
							height="20px"
							class="ml-1"
						/>
						<!---->
					</div>
				</header>

				<div class="default-layout__page pa-5">
					<router-view v-slot="{ Component }">
						<component :is="Component" />
					</router-view>
				</div>
			</div>
		</div>
	</v-main>
</template>

<script setup>
	// Dev
	const testStore = useTestStore();
	const model = ref(false);

	watch(model, () => {
		testStore.switchLoading();
	});
	//

	import { useDisplay } from "vuetify";

	const { xlAndUp } = useDisplay();

	const route = useRoute();

	const navOpen = ref(false);
	const searchQuery = ref("");

	const isCompact = computed(() => !xlAndUp.value);

	watch(
		() => route.fullPath,
		() => {
			navOpen.value = false;
		}
	);

	const branchName = "Дашборд";
</script>

<style lang="scss">
	.default-layout {
		height: 100dvh;
		overflow: hidden;
		overscroll-behavior: none;

		&__shell,
		&__content {
			height: 100%;
			min-height: 0;
		}

		&__content,
		&__page {
			min-width: 0;
		}

		&__page {
			flex: 1 1 auto;
			overflow-y: auto;
			overflow-x: hidden;
			overscroll-behavior: none;
			scrollbar-gutter: stable;
		}
	}

	.current-page {
		line-height: 20px;
	}
</style>
