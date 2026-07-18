<template>
	<main class="s-editor-layout-page text-white w-100">
		<section class="s-editor-layout overflow-hidden rounded-lg bg-white bg-opacity-2">
			<header
				:class="`s-editor-layout__hero--${props.tone}`"
				class="s-editor-layout__hero d-flex align-end px-7"
			>
				<div>
					<h1 class="s-editor-layout__title text-white font-weight-bold">{{ title }}</h1>
					<div class="text-white opacity-40 mt-1">{{ subtitle }}</div>
				</div>
			</header>

			<div class="s-editor-layout__body d-flex flex-wrap align-start ga-3 pa-7">
				<div class="s-editor-layout__form">
					<slot name="form" />
				</div>
				<slot name="aside" />
			</div>
		</section>
	</main>
</template>

<script setup>
	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			default: "редактирование",
		},
		tone: {
			type: String,
			default: "red",
		},
	});
</script>

<style scoped lang="scss">
	.s-editor-layout {
		width: 100%;
		min-width: 0;

		&__hero {
			height: 278px;

			&--red {
				background:
					radial-gradient(90% 180% at 63% -45%, rgba(174, 0, 20, 0.82) 0%, rgba(105, 0, 12, 0.76) 49%, transparent 74%),
					linear-gradient(180deg, rgba(69, 0, 7, 0.82) 0%, rgba(69, 0, 7, 0.72) 54%, #0e0e0e 100%);
			}

			&--orange {
				background:
					linear-gradient(180deg, rgba(var(--v-theme-background), 0.02) 0%, rgba(#0e0e0e, 0.18) 55%, #0e0e0e 100%),
					linear-gradient(
						90deg,
						rgba(var(--v-theme-orange), 0.12) 0%,
						rgba(var(--v-theme-orange), 0.5) 50%,
						rgba(var(--v-theme-orange), 0.12) 100%
					),
					rgb(var(--v-theme-background));
			}
		}

		&__title {
			font-size: 20px;
			line-height: 1.2;
		}

		&__body {
			min-width: 0;
			margin-top: -2px;
		}

		&__form {
			flex: 1 1 615px;
			min-width: 615px;
			max-width: 615px;
		}

		@media (max-width: 1199px) {
			&__body {
				flex-direction: column;
			}

			&__form {
				width: 100%;
				max-width: 650px;
				flex: 0 0 auto;
			}
		}
	}
</style>
