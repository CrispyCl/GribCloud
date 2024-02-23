# Запуск проекта в dev-режиме

## Установите и активируйте виртуальное окружение

 ```bash
python -m venv venv
source venv/bin/activate
```

В Windows комманда активации будет отличаться:

```bat
venv\Scripts\activate
```

## Установите зависимостей

* Для продакшена:

    ```bash
    pip install -r requirements/dev.txt
    ```

* Для разработки:

    ```bash
    pip install -r requirements/prod.txt
    ```

* Для тестирования:

    ```bash
    pip install -r requirements/test.txt
    ```

## Создайте в корневой папке файл ".env"

```bash
cp .env.template .env
```

В Windows комманда копирования будет отличаться:

```bat
copy .env.template .env
```

Если файл не создать, то в любом случае при запуске будут использоваться стандартные значения

### Значения в .env

1. DJANGO_SECRET_KEY - секретный ключ, строка (DJANGO_SECRET_KEY="secret_key")
2. DJANGO_DEBUG - режим разработки, пустая строка, если False (DJANGO_DEBUG="")
3. DJANGO_ALLOWED_HOSTS - разрешенные хосты: список IP-адресов разделённый " " (DJANGO_ALLOWED_HOSTS="localhost 127.0.0.1")
4. DJANGO_INTERNAL_IPS - разрешенные хосты на локальной машине, список IP-адресов разделённый " " (DJANGO_INTERNAL_IPS="localhost 127.0.0.1")

## Перейдите в папку проекта

```bash
cd GribCloud
```

## Выполните компиляцию файлов перевода

```bash
django-admin compilemessages
```

## Создание Базы данных

### Применить миграции

```bash
python manage.py migrate
```

## Админ панель

#### (Мы рекомендуем открыть админ панель, тк в ней отображаются данные из базы данный )

* Создайте пользователя аминистрации

```bash
python manage.py createsuperuser
```

* Следуйте инструкциям

## Запустите сервер

```bash
python manage.py runserver
```
