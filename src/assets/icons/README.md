# Иконки Cascade

Набор зарегистрирован как набор Vuetify по умолчанию в `src/plugins/icons.js`.
SVG хранятся локально. Для изменения цвета используется CSS mask и currentColor;
исходные SVG из Figma не изменяются.

```vue
<v-icon icon="sidebar" size="20" color="primary" />
<v-btn prepend-icon="folder" append-icon="down">Новая группа</v-btn>
<s-btn-icon icon="pencil" title="Переименовать" />
```

Основные имена: `sidebar`, `chart-pie-slice`, `globe`, `calendar-blank`,
`shopping-bag-open`, `chart-bar`, `users-three`, `clock`, `shopping-cart`,
`heart`, `chats-teardrop`, `clock-counter-clockwise`, `four-leaf-clover`,
`identification-badge`, `gear`, `sun`, `bell`, `magnifying-glass`, `star`,
`down`, `right`, `plus`, `pencil`, `move`, `folder`, `dots`, `close`,
`calendar`, `check`, `minus`, `power`, `trash`, `tag`, `wallet`, `stop`,
`lightning`, `arrow-clockwise`, `sign-out`, `arrow-line-right`.

`chevron-up` и `chevron-left` поворачивают исходные `down` и `right`.
Стандартные алиасы Vuetify (`$prev`, `$next`, `$clear` и другие) также настроены.
Новый SVG достаточно добавить в эту папку: имя файла без расширения станет
значением `icon`. При добавлении иконок используйте существующие семейства.

Источник основного набора (41 иконка):
[VOZHAK SOFT — DESIGN / DEVICES v2 // Icons](https://www.figma.com/design/RWju70o0LQ112xmvJIcx1C/VOZHAK-SOFT--Copy-?node-id=1429-3134).

Для существующих форм и инструментов редактора карты, отсутствующих в новом
макете, добавлены локальные иконки Phosphor через Iconify. Они сохраняют значения
действий (выравнивание текста, телефон, пароль, игровые и сервисные зоны).
Лицензия Phosphor — MIT: https://github.com/phosphor-icons/core/blob/main/LICENSE

MDI подключён дополнительным набором через `@mdi/font`. Используйте явный
префикс набора: `icon="mdi:mdi-power"` или `prepend-icon="mdi:mdi-plus"`.
Без префикса используется Cascade; стандартные алиасы Vuetify также остаются
на Cascade. Иконки и шрифты не загружаются из сети во время работы приложения.
