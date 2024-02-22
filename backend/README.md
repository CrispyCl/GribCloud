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

## Перейдите в папку проекта

```bash
cd GribCloud
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
