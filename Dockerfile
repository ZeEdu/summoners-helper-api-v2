
# syntax=docker/dockerfile:1

# ==========================================================
# Workspace base
# ==========================================================
FROM node:22-bookworm-slim AS workspace-base

WORKDIR /workspace

ENV NX_DAEMON=false

# Install workspace dependencies before copying the application source.
COPY package*.json ./
COPY libs ./libs

RUN npm ci --include=dev --no-audit --no-fund

COPY . .


# ==========================================================
# Development: API and Admin
# ==========================================================
FROM workspace-base AS workspace-dev

ARG DDRAGON_VERSION
ARG DDRAGON_LOCALE=pt_BR

ENV DDRAGON_VERSION=${DDRAGON_VERSION} \
    DDRAGON_LOCALE=${DDRAGON_LOCALE} \
    NODE_ENV=development

RUN npm run prepare:ddragon

EXPOSE 3000 4200

CMD ["npx", "nx", "run-many", "--target=serve", "--projects=api,admin", "--parallel=2"]


# ==========================================================
# API: Production build
# ==========================================================
FROM workspace-base AS api-build

ARG DDRAGON_VERSION
ARG DDRAGON_LOCALE=pt_BR

ENV NODE_ENV=production \
    DDRAGON_VERSION=${DDRAGON_VERSION} \
    DDRAGON_LOCALE=${DDRAGON_LOCALE}

# Download Data Dragon assets before compiling the API.
RUN npm run prepare:ddragon

# Webpack generates main.js, package.json and package-lock.json.
RUN npx nx run api:build --skip-nx-cache


# ==========================================================
# API: Production runtime
# ==========================================================
FROM node:22-bookworm-slim AS api-production

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Copy only the compiled application and its generated manifest.
COPY --from=api-build /workspace/dist/apps/api/ ./

# Install only runtime dependencies.
RUN npm ci --omit=dev --no-audit --no-fund

EXPOSE 3000

CMD ["node", "main.js"]


# ==========================================================
# Admin: Production build
# ==========================================================
FROM workspace-base AS admin-build

ENV NODE_ENV=production

RUN npx nx build admin --configuration=production --skip-nx-cache


# ==========================================================
# Admin: Production runtime
# ==========================================================
FROM nginx:alpine AS admin-production

# Angular SPA configuration.
RUN printf '%s\n' \
    'server {' \
    '    listen 80;' \
    '    server_name _;' \
    '    root /usr/share/nginx/html;' \
    '    index index.html;' \
    '    location / {' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '}' \
    > /etc/nginx/conf.d/default.conf

COPY --from=admin-build \
    /workspace/dist/apps/admin/browser/ \
    /usr/share/nginx/html/

EXPOSE 80

# ==========================================================
# Combined API + Admin production runtime
# ==========================================================
FROM api-production AS api-admin-production

# Copy Angular production build into the NestJS static directory.
COPY --from=admin-build \
    /workspace/dist/apps/admin/browser/ \
    ./admin/

# ==========================================================
# Mobile Web: Production build
# ==========================================================
FROM workspace-base AS mobile-web-build

WORKDIR /workspace/apps/mobile

ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}

# EXPO_PUBLIC_* variables must be available during this build.
RUN npx expo export --platform web --output-dir dist


# ==========================================================
# Mobile Web: Production runtime
# ==========================================================
FROM nginx:alpine AS mobile-web

COPY docker/nginx/mobile-web.conf /etc/nginx/conf.d/default.conf

COPY --from=mobile-web-build \
    /workspace/apps/mobile/dist/ \
    /usr/share/nginx/html/

EXPOSE 80
