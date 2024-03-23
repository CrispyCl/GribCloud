# Запуск проекта в dev-режиме

## Установите зависимости

```bash
yarn
```

## Создайте файл ".env" и заполните его

```bash
cp .env.template .env
```

В Windows комманда копирования будет отличаться:

```shell
copy .env.template .env
```

### Значения в .env

1. VITE_APP_API_URL - адрес backend api (по стандарту: http://localhost:8000/)
2. VITE_GEOCODER_KEY - ключ для геокодера от Яндекса

#### Ниже перечислены данные, которые выдаются при создании firebase проекта

3. VITE_FIREBASE_API_KEY
4. VITE_FIREBASE_AUTH_DOMAIN
5. VITE_FIREBASE_PROJECT_ID
6. VITE_FIREBASE_STORAGE_BUCKET
7. VITE_FIREBASE_MESSAGING_SENDER_ID
8. VITE_FIREBASE_APP_ID

## Запустите сервер

```bash
yarn dev
```
