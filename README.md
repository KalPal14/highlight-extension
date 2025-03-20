# Установка

1. Установка ubuntu VM, если вы используете Windows (опционально)

   multipass launch --name my-vm-22 22.04 --cpus 2 --mem 2G --disk 10G

   multipass shell my-vm-22

2. Клонирование приложения

   git clone https://github.com/KalPal14/focus-learn-flow.git

   cd focus-learn-flow/

3. Установка nvm

   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
   или
   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

4. Добавте след в корень проекта файлы .env.dev и env.test

   TODO: добавить файлы

5. Настройка node и npm

   nvm install 20.16.0

   nvm use 20.16.0

6. npm i

7. Запустить базы данных

   1. Установить docker https://docs.docker.com/compose/install/
   2. sudo snap install docker

   3. sudo docker compose up -d

8. Установка nx. Можно пропустить этот шаг, но далее везде где у меня команда начинается с nx, добавлять перед npx. Пример: у меня nx run iam:start:dev, у вас npx nx iam:run:dev

   npm add --global nx@19.8.0

9. Сгенерировать prisma типы

   nx run-many --target=prisma:generate

10. Необходимая миграция некоторых бд

nx run iam:migration:dev
nx run highlight-extension:migration:dev

## Запуск

1. Необязательно (заполнение тестовых данных)

   TODO: скопировать с e2e

2. Запуск

   nx run {project_name}

   или все сразу nx run-many --target=start:dev

## Запустить расширение

TODO: Расписать процесс для chrome и firefox

## Запуск e2e тестов

1. Для начало нужно заполнить тестовую БД

   1. Необходимые миграции

      nx run iam:migration:test
      nx run highlight-extension:migration:test

   2. Заполнение баз

      nx run iam:seed:test
      nx run highlight-extension:seed:test
      NODE_ENV=test freq-words:seed

2. Запуск

   Всех тестов сразу nx run-many --target=test:e2e
   По отдельности nx run {app_name}-e2e:test:e2e
