FROM node:18 as builder
WORKDIR /home/app
COPY ./api/package*.json ./
COPY ./api/tsconfig.json ./
COPY ./api/openapi.yaml ./
RUN yarn install
COPY ./api/src ./src
RUN yarn build

FROM node:18 as runner
WORKDIR /home/app
COPY --from=builder /home/app/package*.json ./
COPY --from=builder /home/app/dist ./dist
COPY --from=builder /home/app/openapi.yaml ./
RUN yarn add cross-env dotenv ts-node
EXPOSE 8080
CMD ["yarn","start:prod"]