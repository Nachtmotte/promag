FROM node:16-alpine as builder
WORKDIR /react
COPY . .
RUN yarn
RUN yarn run build

FROM nginx:1.23.3-alpine as production
ENV NODE_ENV production
COPY --from=builder /react/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]