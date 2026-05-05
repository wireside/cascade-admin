<template>
	<div class="dashboard-card profile-card">
		<div
			v-if="loading"
			class="dashboard-skeleton-profile"
		>
			<v-skeleton-loader type="avatar, text, text, chip" />
		</div>

		<template v-else>
			<div class="profile-card__avatar"><div class="profile-card__avatar-ring" /></div>
			<div class="profile-card__name">Админов А.</div>
			<div class="profile-card__phone">+7 (999) 999 90-99</div>
			<div class="profile-card__badge">
				<v-icon icon="mdi-circle" size="7" />
				<span>22 февр. 09:26</span>
			</div>
		</template>
	</div>
</template>

<script setup>
	let loading = $ref(true);
</script>
