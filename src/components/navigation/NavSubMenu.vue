<template>
	<v-btn
		:ripple="false"
		class="bg-background justify-start pl-2 opacity-100 font-weight-regular"
		color="white"
		variant="plain"
		height="38px"
		rounded="8px"
		@click="open = !open"
	>
		<div class="d-flex align-center">
			<v-icon
				:icon="'mdi-chevron-' + (open ? 'up' : 'down')"
				size="16"
				class="mr-1 opacity-20"
			/>
			<v-icon
				:icon="icon"
				size="20"
				class="mr-2"
			/>
			<span>{{ label }}</span>
		</div>
	</v-btn>

	<div v-if="open">
		<div
			v-if="items"
			class="d-flex w-100 flex-column ga-1"
		>
			<nav-link
				v-for="i in items"
				:key="i.label"
				:to="i.to"
				:label="i.label"
				secondary
			/>
		</div>
		<slot
			v-else
			:open="open"
		/>
	</div>
</template>

<script setup>
	const props = defineProps({
		label: {
			type: String,
			default: null,
		},
		icon: {
			type: String,
			default: null,
		},
		items: {
			type: [Array],
			default: null,
		},
	});

	const route = useRoute();
	const hasActiveChild = (path) =>
		props.items?.some((item) => item.to && (path === item.to || path.startsWith(`${item.to}/`)));

	let open = $ref(hasActiveChild(route.path));

	watch(
		() => route.path,
		(path) => {
			if (hasActiveChild(path)) {
				open = true;
			}
		}
	);
</script>
