# Научные игры ИЯФиТ — каталог Telegram Mini Apps

Статическая страница-каталог в едином стиле проекта «Наука в игре».

## Структура (без папки public)

- `index.html` — главная страница.
- `assets/styles.css` — оформление и адаптация.
- `assets/app.js` — переходы к Telegram Mini Apps и обычным браузерным ссылкам.
- `assets/sipm-tetris.jpg`, `assets/isotopes-256.jpg` — оптимизированные копии утвержденных обложек.
- `assets/science-in-games-logo.png` — логотип проекта.
- `_headers` — HTTP-заголовки Cloudflare Pages.
- `tests/catalog.test.mjs` — проверка ссылок и статических ресурсов.

Оригинальные PNG-обложки сохранены как отдельные утвержденные образцы; в репозитории находятся оптимизированные файлы для публикации.

## Telegram-ссылки

- SiPM Tetris: https://t.me/Nucleargames_bot/sipm_tetris
- Isotopes.256: https://t.me/Nucleargames_bot/isotopes256

## Cloudflare Pages

Подключите репозиторий `maksimdelov13-cell/NuclearGames`, ветку `main`.

- Framework preset: `None`
- Root directory: корень репозитория (по умолчанию)
- Build command: пусто
- Build output directory: корень репозитория (пусто, либо `.`, если интерфейс требует значение)
- Environment variables: не нужны

Адрес: https://nuclear-games.pages.dev/

После каждого коммита в `main` Cloudflare Pages обновляет сайт, если включен Git-based deployment.

## Добавление игры

Добавьте новую карточку в `index.html`, картинку в `assets/`, замените заголовок, описание, прямую ссылку Telegram и обновите счетчик игр.

## Ограничения

Каталог полностью статический: не использует Cloudflare Functions, D1 или токен бота и не изменяет счетчики существующих игр.

## Проверка

`node --test tests/catalog.test.mjs` (Node.js 18+).
