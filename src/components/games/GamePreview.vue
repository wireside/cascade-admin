<template>
	<section class="game-preview rounded-lg bg-white bg-opacity-2 text-white pa-5">
		<h2 class="game-preview__title text-white font-weight-bold mb-4 mt-0">Предпросмотр</h2>
		<div class="game-preview__canvas position-relative overflow-hidden rounded-md">
			<img
				src="@/assets/images/games/game-preview.png"
				alt=""
				class="game-preview__background position-absolute w-100 h-100"
			/>

			<article class="game-preview__card position-absolute overflow-hidden rounded-md">
				<img
					:src="image"
					:alt="gameName"
					class="game-preview__cover w-100 h-100"
				/>
				<div class="game-preview__shade position-absolute w-100 h-100" />
				<div class="game-preview__name position-absolute text-white text-center font-weight-bold px-2 pb-3">
					{{ gameName || "Без названия" }}
				</div>
			</article>
		</div>
	</section>
</template>

<script setup>
	defineProps({
		gameName: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			required: true,
		},
	});
</script>

<style scoped lang="scss">
	.game-preview {
		flex: 0 0 auto;

		&__title {
			font-size: 14px;
			line-height: 1.2;
		}

		&__canvas {
			width: 360px;
			aspect-ratio: 3 / 4;
		}

		&__background {
			inset: 0;
			object-fit: cover;
		}

		&__card {
			top: 50%;
			left: 50%;
			width: 155px;
			height: 231px;
			transform: translateX(-50%) translateY(-50%);
			box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
		}

		&__cover {
			object-fit: cover;
		}

		&__shade {
			inset: 0;
			background: linear-gradient(180deg, transparent 42%, rgba(9, 9, 9, 0.92) 100%);
		}

		&__name {
			left: 0;
			right: 0;
			bottom: 0;
			font-size: 14px;
			line-height: 1.2;
		}
	}
</style>
