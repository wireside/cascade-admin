<template>
	<div class="s-data-table-pagination d-flex align-center ga-1">
		<v-btn
			:disabled="page <= 1"
			aria-label="Предыдущая страница"
			icon="mdi-chevron-left"
			variant="text"
			color="white"
			size="36"
			@click="setPage(page - 1)"
		/>

		<template
			v-for="(item, itemIdx) in paginationItems"
			:key="`${item}-${itemIdx}`"
		>
			<div
				v-if="item === paginationDivider"
				aria-hidden="true"
				class="px-2 text-white opacity-50"
			>
				...
			</div>
			<v-btn
				v-else
				:variant="item === page ? 'flat' : 'text'"
				:color="item === page ? tone : 'white'"
				:class="item === page ? 'text-background' : 'text-white opacity-50'"
				:aria-current="item === page ? 'page' : undefined"
				:aria-label="`Страница ${item}`"
				rounded="md"
				size="36"
				@click="setPage(item)"
			>
				{{ item }}
			</v-btn>
		</template>

		<v-btn
			:disabled="page >= totalPages"
			aria-label="Следующая страница"
			icon="mdi-chevron-right"
			variant="text"
			color="white"
			size="36"
			@click="setPage(page + 1)"
		/>
	</div>
</template>

<script setup>
	const page = defineModel("page", {
		type: Number,
		default: 1,
	});

	const props = defineProps({
		totalPages: {
			type: Number,
			default: 1,
		},
		tone: {
			type: String,
			default: "primary",
		},
	});

	const paginationDivider = "divider";

	const paginationItems = $computed(() => {
		if (props.totalPages <= 7) {
			return Array.from({ length: props.totalPages }, (_, index) => index + 1);
		}

		if (page.value <= 4) {
			return [1, 2, 3, 4, 5, paginationDivider, props.totalPages];
		}

		if (page.value >= props.totalPages - 3) {
			return [
				1,
				paginationDivider,
				props.totalPages - 4,
				props.totalPages - 3,
				props.totalPages - 2,
				props.totalPages - 1,
				props.totalPages,
			];
		}

		return [1, paginationDivider, page.value - 1, page.value, page.value + 1, paginationDivider, props.totalPages];
	});

	const setPage = (pageNumber) => {
		page.value = Math.min(Math.max(pageNumber, 1), props.totalPages);
	};
</script>
