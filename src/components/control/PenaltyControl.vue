<template>
	<v-menu
		v-model="menuOpen"
		open-on-hover
		:close-on-content-click="false"
		:open-delay="80"
		:close-delay="120"
		:offset="[2, 0]"
		class="control-menu"
		location="end"
		transition="fade-transition"
		scroll-strategy="reposition"
	>
		<template #activator="{ props: activatorProps }">
			<v-sheet
				v-bind="activatorProps"
				:class="{ 'bg-white bg-opacity-8': menuOpen }"
				class="px-4 py-0 d-flex align-center text-white bg-transparent"
				height="34"
			>
				<div class="d-flex w-100 align-center justify-space-between">
					<div class="d-flex ga-1 align-center">
						<v-icon
							icon="mdi-clock-remove-outline"
							size="16"
						/>
						<span>Штраф</span>
					</div>

					<div>
						<v-icon
							icon="mdi-chevron-right"
							size="18"
						/>
					</div>
				</div>
			</v-sheet>
		</template>

		<v-list
			class="control-menu__content pa-0 pt-2 font-weight-medium bg-surface bg-opacity-80"
			@wheel.prevent
			@touchmove.prevent
		>
			<v-list-item
				v-for="action in actionItems"
				:key="action.minutes"
				:density="null"
				class="px-4 py-0"
				height="34"
				@click="onSelect(action.minutes)"
			>
				<div class="d-flex w-100 align-center justify-space-between">
					<div class="d-flex ga-1 align-center">
						<v-icon
							:style="{ color: action.color }"
							icon="mdi-timer-outline"
							size="16"
							class="text-current"
						/>
						<span :style="{ color: action.color }">
							{{ action.label }}
						</span>
					</div>
				</div>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script setup>
	const props = defineProps({
		row: {
			type: Object,
			default: null,
		},
	});

	const emit = defineEmits(["set-penalty"]);

	let menuOpen = $ref(false);

	const actionItems = [
		{ minutes: 5, label: "5 минут", color: "#F3A81D" },
		{ minutes: 15, label: "15 минут", color: "#F36F1D" },
		{ minutes: 30, label: "30 минут", color: "#DE3E3D" },
		{ minutes: 60, label: "60 минут", color: "red" },
	];

	const onSelect = (minutes) => {
		menuOpen = false;
		emit("set-penalty", {
			minutes,
			row: props.row,
		});
	};
</script>
