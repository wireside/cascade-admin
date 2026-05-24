export const useTestStore = defineStore("test_dev", {
	state: () => ({
		loading: false,
	}),
	actions: {
		switchLoading() {
			this.loading = !this.loading;
		},
	},
});
