FROM node:20-alpine

# install python and build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base

# set working directory
WORKDIR /app

# copy only the relevant files for dependency installation
COPY backend/package.json backend/yarn.lock ./backend/

# install dependencies
WORKDIR /app/backend
RUN yarn install

# now copy the rest of the app code
WORKDIR /app
COPY backend ./backend
COPY shared ./shared

# build the project
WORKDIR /app/backend
RUN yarn build

EXPOSE 3000

# run in production
CMD ["sh", "-c", "yarn prisma:generate && yarn generate:migration && yarn prod"]