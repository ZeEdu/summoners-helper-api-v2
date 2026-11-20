# Shared Nx workspace image for local API/Admin development and Expo Web export.
FROM node:22-bookworm-slim AS workspace-base

WORKDIR /workspace
ENV NX_DAEMON=false

# Install workspace dependencies before copying source to improve layer caching.
# A root package-lock.json is preferred; npm install is a fallback for the
# provided repository snapshot, which did not contain a root lockfile.
COPY package*.json ./
COPY libs ./libs

RUN if [ -f package-lock.json ]; then \
      npm ci --include=dev --no-audit --no-fund; \
    else \
      npm install --include=dev --no-audit --no-fund; \
    fi

COPY . .

# API/Admin development image. Data Dragon files are not needed by the web bundle.
FROM workspace-base AS workspace-dev
ARG DDRAGON_VERSION
ARG DDRAGON_LOCALE=pt_BR
ENV DDRAGON_VERSION=${DDRAGON_VERSION} \
    DDRAGON_LOCALE=${DDRAGON_LOCALE} \
    NODE_ENV=development
RUN npm run prepare:ddragon
EXPOSE 3000 4200
CMD ["npx", "nx", "run-many", "--target=serve", "--projects=api,admin", "--parallel=2"]

# Export Expo/React Native for Web as a static site. EXPO_PUBLIC_* variables,
# when used by the app, must be provided at build time because they are bundled.
FROM workspace-base AS mobile-web-build
WORKDIR /workspace/apps/mobile
RUN npx expo export --platform web --output-dir dist

# Serve the static Expo export with Nginx (no Node/Metro server at runtime).
FROM nginx:alpine AS mobile-web
COPY docker/nginx/mobile-web.conf /etc/nginx/conf.d/default.conf
COPY --from=mobile-web-build /workspace/apps/mobile/dist/ /usr/share/nginx/html/
EXPOSE 80
