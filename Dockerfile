# Build
FROM node:8 as build
WORKDIR /app

COPY .babelrc ./
COPY package.json package-lock.json ./
COPY webpack.common.js webpack.prod.js ./
RUN npm i

COPY ThirdParty ./ThirdParty
COPY Source ./Source
COPY config.json ./

RUN npm run build

# Run
FROM nginx:alpine
WORKDIR /app

COPY --from=build /app/Build /usr/share/nginx/html

EXPOSE 80
