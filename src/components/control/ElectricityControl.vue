<template>
	<v-menu
		v-model="menuOpen"
		open-on-hover
		:close-on-content-click="false"
		:open-delay="80"
		:close-delay="120"
		location="end"
		:offset="[2, 0]"
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
							icon="mdi-flash-outline"
							size="16"
						/>
						<span>Электропитание</span>
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
				:key="action.key"
				:density="null"
				class="px-4 py-0"
				height="34"
				:class="action.className"
				@click="onAction(action.key)"
			>
				<div class="d-flex w-100 align-center justify-space-between">
					<div class="d-flex ga-1 align-center">
						<v-icon
							:icon="action.icon"
							size="16"
							class="text-current"
						/>
						<span>{{ action.label }}</span>
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

	const emit = defineEmits(["action"]);

	let menuOpen = $ref(false);
	const isPoweredOn = $computed(() => props.row?.status?.tone !== "red");

	const actionItems = $computed(() => [
		{
			key: "power-on",
			label: "Включить",
			icon: "mdi-power",
			className: isPoweredOn ? "text-white opacity-60" : "text-primary",
		},
		{
			key: "power-off",
			label: "Выключить",
			icon: "mdi-power",
			className: isPoweredOn ? "text-red" : "text-white opacity-60",
		},
		{
			key: "reboot",
			label: "Перезагрузить",
			icon: "mdi-restart",
			className: "text-white",
		},
		{
			key: "logout",
			label: "Выйти из системы",
			icon: "mdi-logout",
			className: "text-white",
		},
	]);

	const onAction = (action) => {
		menuOpen = false;
		emit("action", {
			action,
			row: props.row,
			isPoweredOn,
		});
	};
</script>
