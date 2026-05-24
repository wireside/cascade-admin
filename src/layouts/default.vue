<template>
	<v-main class="text-white bg-background">
		<div class="position-relative d-flex">
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

			<div class="d-flex flex-column flex-1-1">
				<header
					style="z-index: 10"
					class="position-sticky top-0 d-flex flex-column flex-md-row align-stretch align-md-center justify-space-between ga-4 pt-6 pb-7 px-6 bg-background border-b"
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

						<h1 class="m-0 text-title-large font-weight-regular text-no-wrap overflow-hidden">
							<span class="opacity-40">{{ branchName }} /</span>
							{{ route.meta.title }}
						</h1>
					</div>

					<div class="d-flex align-center ga-2">
						<search-bar v-model="searchQuery" />
						<s-btn-icon
							width="43px"
							height="43px"
							icon="mdi:cog-outline"
							bg-color="surface"
							class="bg-surface border"
							title="Настройки"
						/>
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

				<div class="pa-6">
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

	const branchName = "CYBER X Барвиха";
</script>
