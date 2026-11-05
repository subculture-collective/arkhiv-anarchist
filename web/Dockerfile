FROM node:24-alpine AS build
WORKDIR /src
COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . ./
ARG VITE_PUBLIC_URL=https://anarchist-archive.subcult.tv
ARG VITE_CORRECTION_CONTACT=info@subcult.tv
ENV VITE_PUBLIC_URL=$VITE_PUBLIC_URL VITE_CORRECTION_CONTACT=$VITE_CORRECTION_CONTACT
RUN pnpm run build

FROM nginx:1.31.7-alpine@sha256:892bb2152464f0c5d8972593a5f5afaf8054552580b699d95f8ff4af08c2d33d
COPY --from=build /src/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
