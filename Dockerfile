FROM node:20-alpine

WORKDIR /app
COPY backend/package.json backend/yarn.lock ./
COPY backend ./backend
COPY shared ./shared
# enter the backend folder
WORKDIR /app/backend
# build the project
RUN yarn install
RUN yarn build 
EXPOSE 3000
# run in production
CMD ["yarn" , "prod"]  
