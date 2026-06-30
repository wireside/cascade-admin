<template>
	<v-input
		:width="normalizedWidth"
		class="s-search-bar flex-shrink-0"
		hide-details
		density="compact"
	>
		<template #default>
			<div
				class="s-search-bar__field d-flex align-center ga-1 px-2 position-relative overflow-hidden rounded-md text-white font-weight-regular bg-white bg-opacity-5"
			>
				<v-icon
					icon="mdi-magnify"
					color="white"
					size="16"
					class="opacity-50"
				/>

				<input
					v-model="model"
					type="search"
					class="s-search-bar__input flex-grow-1 flex-shrink-1"
					:placeholder="placeholder"
				/>

				<button
					v-if="model"
					type="button"
					class="s-search-bar__clear d-inline-flex align-center justify-center pa-0 mr-1"
					aria-label="Очистить поиск"
					@click="clear"
				>
					<v-icon
						icon="mdi-close"
						color="white"
						size="14"
					/>
				</button>
			</div>
		</template>
	</v-input>
</template>

<script setup>
	const model = defineModel({
		type: String,
		default: "",
	});

	const props = defineProps({
		placeholder: {
			type: String,
			default: "Клиент",
		},
		width: {
			type: [String, Number],
			default: "160",
		},
		height: {
			type: [String, Number],
			default: "28",
		},
	});

	const normalizeSize = (value) => {
		if (typeof value === "number") {
			return `${value}px`;
		}

		return value.includes("px") ? value : `${value}px`;
	};

	const normalizedWidth = $computed(() => normalizeSize(props.width));
	const normalizedHeight = $computed(() => normalizeSize(props.height));

	const clear = () => {
		model.value = "";
	};
</script>

<style scoped lang="scss">
	.s-search-bar {
		min-width: 160px;

		&__field {
			height: v-bind(normalizedHeight);
			width: 100%;
			line-height: 20px;
		}

		&__input {
			min-width: 0;
			border: 0;
			outline: 0;
			background: transparent;
			color: #fff;
			font-size: 14px;

			&::placeholder {
				color: rgba(255, 255, 255, 0.6);
				opacity: 1;
			}
		}

		&__clear {
			position: absolute;
			right: 4px;
			top: 50%;
			transform: translateY(-50%);
			width: 18px;
			height: 18px;
			border: 0;
			background: transparent;
			cursor: pointer;
			color: #fff;
		}
	}
</style>
