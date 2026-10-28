<template>
	<v-btn
		:to="to"
		:prepend-icon="prependIcon"
		:ripple="false"
		:class="{
			'bg-white bg-opacity-8 nav-link--active': active,
			'pl-13': secondary,
		}"
		class="nav-link justify-start opacity-100 font-weight-regular pl-7 pr-2"
		color="white"
		variant="text"
		height="36"
		rounded="xl"
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
	const active = $computed(
		() =>
			props.to &&
			(route.path === props.to || (props.to !== "/" && route.path.startsWith(`${props.to.replace(/\/$/, "")}/`)))
	);
</script>

<style scoped lang="scss">
	.nav-link {
		line-height: 20px;
		font-size: 14px;
		border-radius: 12px;
		opacity: 1 !important;
		:deep(.v-btn__content) {
			overflow: hidden;
			text-overflow: ellipsis;
			display: block;
			text-align: left;
		}
		:deep(.v-btn__prepend) {
			margin-inline-start: 0;
			margin-inline-end: 8px;
		}
		:deep(.v-icon) {
			width: 20px;
			height: 20px;
			font-size: 20px;
		}
		&--active {
			font-weight: 600 !important;
		}
		&--active :deep(.v-btn__overlay) {
			opacity: 0;
		}

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
				background-color: rgb(var(--v-theme-primary));
			}
		}
	}
</style>
