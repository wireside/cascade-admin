<template>
	<v-card
		elevation="0"
		outlined
	>
		<v-card-text>
			<v-row
				align="center"
				justify="space-between"
			>
				<v-col cols="auto">
					<div>
						<div class="text-subtitle-2">Детали устройства</div>
						<div class="text-h6">Компьютер 5</div>
					</div>
				</v-col>

				<v-col cols="auto">
					<v-row
						align="center"
						class="ma-0"
						style="gap: 8px"
					>
						<v-chip
							color="primary"
							variant="tonal"
							small
						>
							Занят
						</v-chip>
						<v-btn icon>
							<v-icon>mdi-dots-horizontal</v-icon>
						</v-btn>
					</v-row>
				</v-col>
			</v-row>

			<div v-if="loading">
				<v-row>
					<v-col
						cols="12"
						md="4"
						v-for="n in 3"
						:key="n"
					>
						<v-skeleton-loader type="heading, text" />
					</v-col>
				</v-row>
				<v-row>
					<v-col
						cols="12"
						md="6"
						v-for="n in 4"
						:key="`spec-${n}`"
					>
						<v-skeleton-loader type="article" />
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-skeleton-loader type="paragraph" />
					</v-col>
				</v-row>
			</div>

			<div v-else>
				<v-row
					class="mt-2"
					dense
				>
					<v-col
						v-for="item in summaryCards"
						:key="item.label"
						cols="12"
						sm="4"
					>
						<v-sheet
							elevation="0"
							rounded
							class="pa-3"
						>
							<div class="text-subtitle-2">{{ item.label }}</div>
							<div class="text-h6">{{ item.value }}</div>
						</v-sheet>
					</v-col>
				</v-row>

				<v-row
					class="mt-2"
					dense
				>
					<v-col
						v-for="item in specCards"
						:key="item.label"
						cols="12"
						sm="4"
					>
						<v-sheet
							elevation="0"
							rounded
							class="pa-3"
						>
							<div class="text-subtitle-2">{{ item.label }}</div>
							<div class="text-body-1">{{ item.value }}</div>
						</v-sheet>
					</v-col>
				</v-row>

				<v-row
					class="mt-2"
					dense
				>
					<v-col
						cols="12"
						sm="6"
					>
						<v-sheet
							elevation="0"
							rounded
							class="pa-3"
						>
							<div class="text-subtitle-2">Активное приложение</div>
							<div class="text-body-1">Cascade [v.1.5.2]</div>
						</v-sheet>
					</v-col>

					<v-col
						cols="12"
						sm="6"
					>
						<v-sheet
							elevation="0"
							rounded
							class="pa-3"
						>
							<div class="text-subtitle-2">Сеть</div>
							<v-list dense>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>192.168.155.1</v-list-item-title>
										<v-list-item-subtitle>D8:43:AE:C3:65:C9</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</v-sheet>
					</v-col>
				</v-row>

				<v-row class="mt-2">
					<v-col cols="12">
						<v-sheet
							elevation="0"
							rounded
							class="pa-3"
						>
							<div class="text-subtitle-2 mb-3">Диски</div>
							<v-list dense>
								<v-list-item
									v-for="disk in disks"
									:key="disk.name"
								>
									<v-list-item-content>
										<v-row align="center">
											<v-col cols="auto">
												<div class="text-subtitle-2">{{ disk.name }}</div>
											</v-col>
											<v-col>
												<div class="text-body-2">{{ disk.caption }}</div>
											</v-col>
										</v-row>
										<v-progress-linear
											:model-value="disk.usedPercent"
											height="10"
											rounded
											color="primary"
										/>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</v-sheet>
					</v-col>
				</v-row>
			</div>
		</v-card-text>
	</v-card>
</template>

<script setup>
	const summaryCards = [
		{ label: "Клиент", value: "SEVA2001" },
		{ label: "Тариф", value: "Буткемп 3 часа" },
		{ label: "Сеанс", value: "10:01:02 - 13:01:02" },
	];

	const specCards = [
		{ label: "Процессор", value: "AMD Ryzen 5 7500F 6-Core Processor" },
		{ label: "Оперативная память", value: "32 GB" },
		{ label: "Видеокарта", value: "NVIDIA GeForce RTX 5060 Ti" },
	];

	const disks = [
		{ name: "C:", caption: "8.1 ГБ свободно из 80.0 ГБ", usedPercent: 78 },
		{ name: "D:", caption: "1.3 ГБ свободно из 30.0 ГБ", usedPercent: 88 },
	];

	let loading = $ref(true);
</script>
