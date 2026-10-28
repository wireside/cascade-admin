import { useStorage } from "@vueuse/core";

export const navigation = [
	{
		title: "Основные",
		items: [
			{ label: "Дашборд", icon: "chart-pie-slice", to: "/" },
			{ label: "Устройства", icon: "sidebar", to: "/devices" },
			{ label: "Карта клуба", icon: "globe", to: "/club-map" },
			{ label: "Бронирования", icon: "calendar-blank" },
			{ label: "Магазин", icon: "shopping-bag-open" },
			{ label: "Аналитика", icon: "chart-bar" },
		],
	},
	{
		title: "Работа с клиентами",
		items: [
			{ label: "Клиенты", icon: "users-three", items: [{ label: "Клиенты", to: "/clients" }, { label: "Группы" }] },
			{ label: "Тарифы", icon: "clock", to: "/rates" },
			{ label: "Товары и услуги", icon: "shopping-cart" },
			{ label: "Система лояльности", icon: "heart" },
			{ label: "Отзывы клиентов", icon: "chats-teardrop" },
		],
	},
	{
		title: "Настройки филиала",
		items: [
			{
				label: "Детализация",
				icon: "clock-counter-clockwise",
				items: [{ label: "Логи" }, { label: "Платежи", to: "/payments" }],
			},
			{
				label: "Приложения",
				icon: "four-leaf-clover",
				items: [
					{ label: "Игры", to: "/games" },
					{ label: "Программы", to: "/apps" },
				],
			},
			{ label: "Сотрудники", icon: "identification-badge" },
			{ label: "Настройки", icon: "gear" },
		],
	},
];

export const navigationPages = navigation.flatMap(({ items }) =>
	items.flatMap((item) =>
		item.items
			? item.items.filter((child) => child.to).map((child) => ({ ...child, icon: item.icon }))
			: item.to
				? [item]
				: []
	)
);

const favoritePaths = useStorage("cascade.navigation.favorites", ["/devices"]);
const recentPaths = useStorage("cascade.navigation.recent", []);

export function useNavigation() {
	const resolvePages = (paths) => paths.map((path) => navigationPages.find((item) => item.to === path)).filter(Boolean);
	const rememberPage = (path) => {
		const page = navigationPages.find(
			(item) => item.to === path || (item.to !== "/" && path.startsWith(`${item.to}/`))
		);
		if (page) recentPaths.value = [page.to, ...recentPaths.value.filter((entry) => entry !== page.to)].slice(0, 8);
	};
	const toggleFavorite = (path) => {
		if (!navigationPages.some((item) => item.to === path)) return;
		favoritePaths.value = favoritePaths.value.includes(path)
			? favoritePaths.value.filter((entry) => entry !== path)
			: [...favoritePaths.value, path];
	};
	return { favoritePaths, recentPaths, resolvePages, rememberPage, toggleFavorite };
}
