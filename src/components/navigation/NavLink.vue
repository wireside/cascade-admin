<template>
	<v-btn
		:to="to"
		:prepend-icon="prependIcon"
		:ripple="false"
		:class="{
			'bg-primary bg-opacity-10 nav-link--active': route.path === to,
			'pl-13': secondary,
		}"
		class="bg-background justify-start opacity-100 font-weight-regular pl-7"
		color="white"
		variant="plain"
		height="38px"
		rounded="8px"
		@click="(e) => $emit('click', e)"
	>
		<span v-if="label">{{ label }}</span>
		<slot v-else />
	</v-btn>
</template>

<script setup>
	const props = defineProps({
		to: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
		prependIcon: {
			type: String,
			default: null,
		},
		secondary: {
			type: Boolean,
			default: false,
		},
	});

	const route = useRoute();
</script>

<style lang="scss">
	.nav-link {
		line-height: 20px;
		font-size: 14px;
		border-radius: 8px;
		opacity: 1 !important;

		&--active {
			position: relative;

			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 4px;
				height: 16px;
				border-radius: 2px;
				background-color: #abf43e;
			}
		}
	}
</style>
