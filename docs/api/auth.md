# API: аутентификация

Каждый запрос к API, который работает от имени пользователя (например `GET /api/v1/users/me`),
передаёт данные для идентификации в заголовке `Authorization`:

```
Authorization: <схема> <данные>
```

Схема определяет, откуда пришёл пользователь и как сервер проверяет данные.
Пользователь в БД определяется парой `provider + external_id` (`swipy.users`). Для `internal` `external_id = NULL`, пользователя определяет `users.id`.

| Схема | Откуда клиент | `provider` | `external_id` |
|---|---|---|---|
| `vk` | VK Mini App | `vk` | `vk_user_id` |
| `tma` | Telegram Mini App | `telegram` | `user.id` из `initData` |
| `internal` | Приложение в App Store | `internal` | `NULL` |

## vk: VK Mini Apps

```http
Authorization: vk vk_user_id=1&vk_language=ru&vk_ts=1760700000&sign=...
```

- Значение: строка launch params, которую VK выдал приложению.
- Проверка: `sign` пересчитывается по `VK_CLIENT_SECRET`.
- Пользователя определяет `vk_user_id`.

## tma: Telegram Mini Apps

```http
Authorization: tma user=%7B%22id%22%3A1...%7D&auth_date=1760700000&hash=...
```

- Значение: строка `initData`, которую Telegram выдал приложению.
- Проверка: `hash` по токену бота.
- Пользователя определяет `user.id`.

## internal: приложение в App Store

Схема ещё не определена. Нужно решить:

- что клиент присылает как доказательство личности (платформа не подписывает данные, как VK и Telegram);
- как пользователь регистрируется и как сервер выдаёт ему идентификатор;

## Ошибки

Формат как у текущего `ErrorResponse`:

```json
{ "message": "failed verify VK params", "error": "invalid argument" }
```

| Код | Когда |
|---|---|
| `401 Unauthorized` | Нет заголовка, неизвестная схема или неверная подпись |
| `404 Not Found` | Данные верны, но пользователь не инициализирован (для VK: не вызывался `POST /api/v1/users/initialize/vk`) |

> Сейчас сервер поддерживает только схему `vk`. Схемы `tma` и `internal` пока отвечают `401`.

## Секреты

Секреты (`VK_CLIENT_SECRET`, токен бота) и сервисный токен `VK_API_TOKEN` хранятся только на сервере,
клиенту их не передают.
