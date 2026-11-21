# Научные игры ИЯФиТ — каталог Telegram Mini Apps

Статическая страница-каталог в едином визуальном стиле проекта «Наука в игре».

## Состав

- `public/index.html` — страница каталога.
- `public/assets/styles.css` — оформление и адаптация смартфон / планшет / компьютер.
- `public/assets/app.js` — корректный запуск обеих игр из Telegram Mini App и обычного браузера.
- `public/assets/sipm-tetris.jpg`, `isotopes-256.jpg` — оптимизированные копии **утвержденных** обложек без перерисовки.
- `source_assets/` — оригинальные утвержденные PNG-обложки для дальнейшей работы.
- `public/_headers` — базовые HTTP-заголовки Cloudflare Pages.

## Ссылки на игры

- SiPM Tetris: https://t.me/Nucleargames_bot/sipm_tetris
- Isotopes.256: https://t.me/Nucleargames_bot/isotopes256

## Первая публикация через GitHub + Cloudflare Pages

1. На GitHub создать **новый пустой репозиторий**, например `inphe-games-catalog`.
2. Загрузить в него файлы этой папки (включая директорию `public`).
3. В Cloudflare Dashboard открыть **Workers & Pages → Create → Pages → Connect to Git**.
4. Выбрать созданный репозиторий и ветку `main`.
5. Настройки: **Framework preset: None**, **Build command: оставить пустым**, **Build output directory: `public`**. Переменные окружения не нужны.
6. Опубликовать и проверить полученный `https://...pages.dev` на смартфоне и в Telegram.
7. В BotFather у существующего `@Nucleargames_bot` настроить **Main Mini App**, указав адрес нового каталога. При необходимости настроить меню «Все игры».

После настройки публикация новой версии из ветки `main` будет автоматически запускать повторную сборку и публикацию сайта на прежнем адресе.

## Добавление новой игры

Скопировать одну карточку `<a class="game-card">...</a>` в `public/index.html`, заменить название, описание, миниатюру и прямую ссылку вида `https://t.me/Nucleargames_bot/shortname`. Количество игр в тексте секции тоже обновить.

## О техническом устройстве

- Только статический сайт: **без Cloudflare Functions, D1, API и отдельного токена бота**.
- Каталог не меняет существующие игры, их статистику, их репозитории и прямые Telegram-ссылки.
- Из Telegram игры открываются `Telegram.WebApp.openTelegramLink`; в обычном браузере используются обычные ссылки.
- Базовая функциональность не требует установки npm-пакетов или иных внешних зависимостей. Внешний Telegram WebApp SDK используется только при запуске в Telegram.

## Проверка

В папке проекта: `node --test tests/catalog.test.mjs` (Node.js 18+).