# Содержание

- [Введение](#введение)
- [Инструкция по локальному разворачиванию и запуску прилодений](#установка)

# Введение

Этот проект — монорепозиторий с несколькими сервисами и клиентским приложением, созданный для демонстрации моих навыков в бэкенд и фронтенд разработке. Он включает в себя два Express сервиса, NestJs сервис, браузерное расширение для chrome и firefox на React. Функционал не зависящий от бизнес логики конкретного преложения, который используется или может быть использован в нескольких приложениях вынесен библиотеки.

# Установка

### 1. Клонирование приложения с git hub

```
git clone https://github.com/KalPal14/focus-learn-flow.git

cd focus-learn-flow/
```

### 2. Установка npm версии 10.8.1 и node версии 20.16.0

Рекомендую использовать nvm

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
```

или

```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
```

затем

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Если возникли проблемы, посетите раздел [Installing and Updating](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating), там вы сможете найти подробную инструкцию

Далее установите нужную версию npm и node командой

```
nvm install 20.16.0
```

Проверте версию node, в консле вы должны увидеть v20.16.0

```
node -v
```

Если это не так, запустите команду

```
nvm use 20.16.0
```

nvm установит npm нужной версии автоматически, вы можете проверить это, запустив команду. В консоле вы должны увидеть 10.8.1

```
npm -v
```

### 3. Добавление .env.dev и .env.test

Создайте в корне проекта (это попка focus-learn-flow) два файла. Первый с названием .env.dev, второй с .env.test.

В оба файла добавте

```
SALT = 9
JWT_KEY = 'jwt_secret_key'
COOCKIE_KEY = 'COOCKIE_SECRET_KEY'
GROQ_API_KEY = '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'
```

В .env.dev добавте

```
# freq-words
FREQ_WORDS_PORT = 8002
FREQ_WORDS_HOST = 'localhost'
FREQ_WORDS_URL = 'http://localhost:8002'
FREQ_WORDS_DB_PORT = 5430
FREQ_WORDS_DB_USERNAME = 'postgres'

FREQ_WORDS_DB_PASSWORD = 'postgres'
FREQ_WORDS_DB_NAME = 'freq-words-dev'

# highlight-extension
H_EXT_PORT = 8001
H_EXT_HOST = 'localhost'
H_EXT_URL = 'http://localhost:8001'
H_EXT_DB_PORT = 5433
H_EXT_DB_USERNAME = 'postgres'
H_EXT_DB_PASSWORD = 'postgres'
H_EXT_DB_NAME = 'highlight-extension-dev'
H_EXT_DB_URL = 'postgresql://postgres:postgres@localhost:5433/highlight-extension-dev'

# highlight-extension-fe
H_EXT_FE_URLS = 'chrome-extension://kjcnjieddkcmfoebehajbipdkoicpbmi, moz-extension://65bf4d9c-6d43-47c2-88a4-5296b7a802f5'

# iam
IAM_PORT = 8000
IAM_HOST = 'localhost'
IAM_URL = 'http://localhost:8000'
IAM_DB_PORT = 5435
IAM_DB_USERNAME = 'postgres'
IAM_DB_PASSWORD = 'postgres'
IAM_DB_NAME = 'iam-dev'
IAM_DB_URL = 'postgresql://postgres:postgres@localhost:5435/iam-dev'
```

В .env.test добавте

```
# freq-words
FREQ_WORDS_URL = ''
FREQ_WORDS_DB_PORT = 5431
FREQ_WORDS_DB_USERNAME = 'postgres'
FREQ_WORDS_DB_PASSWORD = 'postgres'
FREQ_WORDS_DB_NAME = 'freq-words-test'

# highlight-extension
H_EXT_PORT = 0
H_EXT_URL = ''
H_EXT_DB_PORT = 5434
H_EXT_DB_USERNAME = 'postgres'
H_EXT_DB_PASSWORD = 'postgres'
H_EXT_DB_NAME = 'highlight-extension-test'
H_EXT_DB_URL = 'postgresql://postgres:postgres@localhost:5434/highlight-extension-test'

# highlight-extension-fe
H_EXT_FE_URLS = 'chrome-extension://kjcnjieddkcmfoebehajbipdkoicpbmi, moz-extension://65bf4d9c-6d43-47c2-88a4-5296b7a802f5'

# iam
IAM_PORT = 0
IAM_URL = ''
IAM_DB_PORT = 5436
IAM_DB_USERNAME = 'postgres'
IAM_DB_PASSWORD = 'postgres'
IAM_DB_NAME = 'iam-test'
IAM_DB_URL = 'postgresql://postgres:postgres@localhost:5436/iam-test'
```

### 6. Установка npm пакетов

```
npm i
```

### 7. Установка Docker

Выполните инструкции для своей OS [линк](https://docs.docker.com/compose/install/)

Затем

```
sudo snap install docker
sudo docker compose up -d
```

### 8. Глобальная установка nx

> Этот шаг можно пропустить. Но далее везде перед запуском любой `nx` команды, добавлять `npx`.
>
> Пример: не `nx run iam`, а `npx nx run iam`.

Для выполнения этого шага запустите

```
npm add --global nx@19.8.0
```

### 9. Настройка deb DBs

> Перед этим обязаательно выполните пункт 7 "Установка Docker"

Генерация prisma типов

```
nx run-many --target=prisma:generate
```

Необходимые миграция некоторых DBs

```
nx run iam:migration:dev
nx run highlight-extension:migration:dev
```

Сидинг DBs

```
nx run iam:seed:test
nx run highlight-extension:seed:test
nx run freq-words:seed
```

### 10. Запуск приложжений

Для запуска всех приложений сразу

```
nx run-many --target=start:dev
```

Для запуска одного приложения отдельно

```
nx run {app_name}:start:dev
```

`{app_name}` это: iam, highlight-extension, highlight-extension-fe и freq-words

#### Запуск расширенияя highlight-extension-fe в Chrome

> Для полноценной работы расширения обязательно запустите iam, highlight-extension и highlight-extension-fe

Откройте Chrome

В адрестную строку вставте `chrome://extensions/`

В правом верхнем углу активируйте `dev mode` с помошью toglle button

Среди появившихся кнопок нажмите `Load unpacked`

Выберите папку `dist/apps/highlight-extension-fe`

#### Запуск расширенияя highlight-extension-fe в Firefox

> Для полноценной работы расширения обязательно запустите iam, highlight-extension и highlight-extension-fe

Откройте Firefox

В адрестную строку вставте `about:debugging#/runtime/this-firefox`

Нажмите на кнопку `Load Temporary Add-on…`

Выбирите файл `dist/apps/highlight-extension-fe/manifest.json`

### 11. Настройка и запуск e2e тестов

#### Настройка test DBs

> Перед этим обязаательно выполните пункт 7 "Установка Docker"

Генерация prisma типов (можно пропустить если вы это сделали в 9-том пункте)

```
nx run-many --target=prisma:generate
```

Необходимые миграции некоторых DBs

```
nx run iam:migration:test
nx run highlight-extension:migration:test
```

Сидинг DBs

```
nx run iam:seed:test
nx run highlight-extension:seed:test
NODE_ENV=test nx run freq-words:seed
```

#### Запуск e2e тестов

Для запуска всех тестов сразу

```
nx run-many --target=test:e2e
```

Для запуска e2e тестов для каждого приложения по отдельности

```
nx run {app_name}-e2e:test:e2e
```

`{app_name}` это: iam, highlight-extension и freq-words
