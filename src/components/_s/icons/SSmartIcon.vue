<template>
	<v-icon
		v-if="type === 'mdi'"
		:icon="icon"
		:size="size"
		:style="style"
	/>
	<s-svg-icon
		v-else-if="type === 'svg'"
		:path="icon"
		:size="size"
		:squared="squared"
		:style="style"
	/>
	<s-png-icon
		v-else-if="type === 'png'"
		:path="icon"
		:size="size"
		:style="style"
	/>
	<span
		v-else-if="type === 'iconify'"
		class="d-inline-flex align-center justify-center"
	>
		<iconify-icon
			:icon="icon"
			:color="themedColor"
			:height="size"
			:style="style"
		/>
	</span>
	<s-icon
		v-else
		:icon="icon"
		:size="size"
		:style="style"
	/>
</template>

<script setup lang="ts">
	import { Icon as IconifyIcon } from "@iconify/vue";
	import { useTheme } from "vuetify";

	const props = withDefaults(
		defineProps<{
			icon?: string;
			color?: string;
			size?: string | number;
			opacity?: string | number;
			squared?: boolean;
		}>(),
		{
			icon: "",
			color: "white",
			size: 24,
			opacity: 1,
			squared: true,
		}
	);

	const theme = useTheme();

	const mdiPrefix = "mdi:";
	const svgPostfix = ".svg";
	const pngPostfix = ".png";
	const iconifySeparator = ":";

	const type = $computed(() => {
		switch (true) {
			case props.icon.includes(iconifySeparator):
				return "iconify";
			case props.icon.startsWith(mdiPrefix):
				return "mdi";
			case props.icon.endsWith(svgPostfix):
				return "svg";
			case props.icon.endsWith(pngPostfix):
				return "png";
			default:
				return "";
		}
	});

	const style = $computed(() => {
		return {
			opacity: props.opacity,
		};
	});

	const themedColor: string = $computed(() => {
		const colors = theme.current.value.colors;
		return colors[props.color] || props.color;
	});
</script>
