# Build
FROM node:12-alpine as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY webpack.*.js .babelrc ./
COPY Resources ./Resources
COPY Source ./Source
COPY ThirdParty ./ThirdParty
COPY config.json ./
RUN npm run build


# Run
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY --from=build /app/Build /usr/share/nginx/html
