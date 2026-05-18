<template>
	<v-input
    :width="width + 'px'"
		class="search-bar flex-shrink-0"
		hide-details
		density="compact"
	>
		<template #default>
			<div class="search-bar__field d-flex align-center ga-2 px-4 position-relative overflow-hidden rounded-md text-white bg-surface">
				<v-icon
					icon="mdi-magnify"
					color="white"
					size="16"
				/>

				<input
					v-model="model"
					type="search"
					class="search-bar__input flex-grow-1 flex-shrink-1"
					:placeholder="placeholder"
				/>

				<button
					v-if="model"
					type="button"
					class="search-bar__clear d-inline-flex align-center justify-center pa-0"
					aria-label="Очистить поиск"
					@click="clear"
				>
					<v-icon
						icon="mdi-close"
						color="white"
						size="16"
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

	defineProps({
		placeholder: {
			type: String,
			default: "Клиент",
		},
    width: {
      type: String,
      default: "201"
    }
	});

	const clear = () => {
		model.value = "";
	};
</script>

<style scoped lang="scss">
	.search-bar {
		min-width: 201px;
	}

	.search-bar__field {
		height: 43px;
		width: 100%;
		border: 1px solid rgba(246, 246, 246, 0.08);
	}

	.search-bar__input {
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
		color: #fff;
		font-size: 14px;
	}

	.search-bar__input::placeholder {
		color: rgba(255, 255, 255, 0.6);
		opacity: 1;
	}

	.search-bar__clear {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		border: 0;
		background: transparent;
		cursor: pointer;
		color: #fff;
	}
</style>
