<template>
	<section class="apps-group">
		<header
			:class="isExpanded && 'rounded-b-0'"
			class="apps-group__header d-flex align-center justify-space-between ga-4 bg-white bg-opacity-5 px-5 py-4 rounded-lg"
		>
			<div class="d-flex align-center ga-3 overflow-hidden">
				<s-badge
					:label="appsCount"
					tone="primary"
					bg-opacity="20"
				/>

				<div class="apps-group__title text-white font-weight-bold text-truncate">
					{{ group.name }}
				</div>

				<v-icon
					icon="mdi-pencil-outline"
					size="18"
					class="text-white opacity-50 flex-shrink-0"
				/>
			</div>

			<div class="d-flex align-center ga-2 flex-shrink-0">
				<v-btn
					icon
					variant="text"
					color="red"
					size="34"
					rounded="md"
					class="bg-red bg-opacity-20 text-red"
					:class="{ 'pointer-events-none': !selectedInGroup }"
				>
					<v-icon
						icon="mdi-trash-can-outline"
						size="16"
					/>
				</v-btn>

				<v-btn
					icon
					variant="flat"
					color="white"
					size="34"
					rounded="md"
					class="bg-white bg-opacity-5 text-white"
					@click="isExpanded = !isExpanded"
				>
					<v-icon
						:icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
						size="16"
						class="opacity-50"
					/>
				</v-btn>
			</div>
		</header>

		<v-expand-transition>
			<div
				v-show="isExpanded"
				class="apps-group__content bg-white bg-opacity-2 pa-5"
			>
				<v-row
					class="ma-0 ga-4"
					no-gutters
				>
					<v-col
						v-for="app in group.apps"
						:key="getAppId(app)"
						cols="auto"
					>
						<article
							class="apps-group__card position-relative rounded-md d-flex flex-column align-center cursor-pointer px-5 bg-white bg-opacity-2"
							:class="{ 'apps-group__card--selected': isSelected(app) }"
							@click="selectApp(app)"
						>
							<v-img
								:src="app.img"
								:alt="app.name"
								width="77"
								height="77"
								class="apps-group__icon flex-grow-0"
								contain
							/>

							<div class="apps-group__card-title text-white text-center font-weight-bold">
								{{ app.name }}
							</div>
						</article>
					</v-col>
				</v-row>
			</div>
		</v-expand-transition>
	</section>
</template>

<script setup>
	const props = defineProps({
		group: {
			type: Object,
			required: true,
		},
		expanded: {
			type: Boolean,
			default: true,
		},
		selectedApp: {
			type: Object,
			default: null,
		},
	});

	const emit = defineEmits(["select-app"]);

	const isExpanded = ref(props.expanded);

	const appsCount = computed(() => props.group.apps?.length || 0);

	const selectedInGroup = computed(() => {
		return props.group.apps?.some((app) => isSelected(app));
	});

	const getAppId = (app) => {
		return app?.id || app?.name;
	};

	const isSelected = (app) => {
		return Boolean(props.selectedApp && getAppId(props.selectedApp) === getAppId(app));
	};

	const selectApp = (app) => {
		emit("select-app", app);
	};

	watch(
		() => props.expanded,
		(value) => {
			isExpanded.value = value;
		}
	);
</script>

<style scoped lang="scss">
	.apps-group {
		&__header {
			min-height: 48px;
		}

		&__title {
			font-size: 18px;
			line-height: 120%;
		}

		&__content {
			border-radius: 0 0 10px 10px;
		}

		&__card {
			width: 155px;
			height: 157px;
			border: 1px solid transparent;

			&--selected {
				border-color: rgb(var(--v-theme-primary));
			}
		}

		&__icon {
			margin-top: 15px;
		}

		&__card-title {
			position: absolute;
			right: 22px;
			bottom: 25px;
			left: 22px;
			line-height: 120%;
		}
	}
</style>
