# geoPlataforma

Sitio estático servido con Node.js + Express para despliegue en plataformas como Render, Railway, Fly.io, Heroku o contenedor Docker.

## Requisitos

- Node.js 20+ (ver `.nvmrc`)

## Ejecutar en local

```bash
npm install
npm start
```

Aplicación disponible en: `http://localhost:3000`

- Home: `http://localhost:3000/` (redirige a `http://localhost:3000/index.html`)
- Healthcheck: `http://localhost:3000/health`

## Scripts

- `npm start`: inicia servidor de producción
- `npm run dev`: inicia servidor en modo desarrollo

## Despliegue en Node.js (sin Docker)

Comando de build:

```bash
npm install
```

Comando de start:

```bash
npm start
```

La app toma el puerto desde `PORT` (si no existe, usa `3000`).

## Estructura de carpetas

```text
src/
  server.js
public/
  pages/
  assets/
    css/
    js/
    data/
    media/
legacy/
```

## Despliegue con Docker

Build de imagen:

```bash
docker build -t geoplataforma .
```

Run local:

```bash
docker run -p 3000:3000 geoplataforma
```
