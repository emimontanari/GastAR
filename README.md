# gastAR

Aplicación web para gestión de gastos personales con arquitectura monorepo.

## Stack Tecnológico

### Frontend (`apps/web`)

- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.2.0
- **UI Library**: Radix UI components (Accordion, Dialog, Dropdown, Select, Toast, etc.)
- **Styling**: Tailwind CSS 4.1.9 con tailwindcss-animate
- **Forms**: React Hook Form 7.60.0 + Zod 3.25.76
- **Authentication**: Supabase SSR 0.8.0
- **Date Handling**: date-fns 4.1.0
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React 0.454.0
- **Analytics**: Vercel Analytics 1.3.1
- **Theme**: next-themes 0.4.6

### Backend (`apps/api`)

- **Framework**: NestJS 11.0.1
- **Runtime**: Node.js >= 18
- **Language**: TypeScript 5.7.3
- **Testing**: Jest 30.0.0
- **Port**: 4000 (configurado en `apps/api/src/main.ts:13`)

### Shared Packages

- `@repo/ui`: Biblioteca de componentes React compartidos
- `@repo/eslint-config`: Configuración de ESLint compartida
- `@repo/typescript-config`: Configuración de TypeScript compartida

### Build Tools

- **Monorepo**: Turborepo 2.7.2
- **Package Manager**: pnpm 9.0.0
- **Linting**: ESLint 9.x
- **Formatting**: Prettier 3.7.4

## Estructura del Proyecto

```
gastAR/
├── apps/
│   ├── web/              # Aplicación Next.js
│   │   ├── app/          # App Router
│   │   ├── components/   # Componentes React
│   │   ├── lib/          # Utilidades y helpers
│   │   └── public/       # Assets estáticos
│   └── api/              # API NestJS
│       └── src/          # Código fuente
│           ├── app.controller.ts
│           ├── app.module.ts
│           ├── app.service.ts
│           └── main.ts
├── packages/
│   ├── ui/               # Componentes compartidos
│   ├── eslint-config/    # Configuración ESLint
│   └── typescript-config/# Configuración TypeScript
└── turbo.json            # Configuración Turborepo
```

## Prerrequisitos

- Node.js >= 18
- pnpm 9.0.0

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd gastAR

# Instalar dependencias
pnpm install
```

## Configuración

### Variables de Entorno

#### Frontend (apps/web/.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Vercel Analytics (opcional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

#### Backend (apps/api/.env)

```env
# Configuración del servidor
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Scripts Disponibles

### Root Level

```bash
# Desarrollo (inicia todos los workspaces)
pnpm dev

# Build (construye todos los workspaces)
pnpm build

# Lint (ejecuta linting en todos los workspaces)
pnpm lint

# Format (formatea código con Prettier)
pnpm format

# Type checking (verifica tipos TypeScript)
pnpm check-types
```

### Frontend (apps/web)

```bash
# Desarrollo
cd apps/web
pnpm dev          # Inicia en http://localhost:3000

# Build
pnpm build        # Genera build de producción
pnpm start        # Inicia servidor de producción

# Linting y type checking
pnpm lint
pnpm check-types
```

### Backend (apps/api)

```bash
# Desarrollo
cd apps/api
pnpm dev          # Inicia con watch mode en http://localhost:4000

# Build
pnpm build        # Compila TypeScript

# Producción
pnpm start:prod   # Inicia servidor de producción

# Testing
pnpm test         # Ejecuta tests unitarios
pnpm test:watch   # Tests en modo watch
pnpm test:cov     # Tests con coverage
pnpm test:e2e     # Tests end-to-end

# Debug
pnpm start:debug  # Inicia con debugger

# Linting y type checking
pnpm lint
pnpm check-types
```

### UI Package (packages/ui)

```bash
cd packages/ui
pnpm generate:component  # Genera un nuevo componente React
pnpm lint
pnpm check-types
```

## Desarrollo

### Iniciar Entorno Completo

```bash
# Desde la raíz del proyecto
pnpm dev
```

Esto iniciará:

- Frontend en `http://localhost:3000`
- Backend en `http://localhost:4000`

### Desarrollar Apps Específicas

```bash
# Solo frontend
pnpm dev --filter=web

# Solo backend
pnpm dev --filter=api
```

## API Endpoints

El backend NestJS corre en `http://localhost:4000` con CORS habilitado para `http://localhost:3000`.

### Endpoints Disponibles

#### Health Check

```
GET /
Response: "Hello World!"
```

> **Nota**: La API está en desarrollo inicial. Más endpoints serán documentados a medida que se implementen.

### Configuración CORS

El servidor API está configurado para aceptar requests desde:

- Origin: `http://localhost:3000`
- Credentials: Habilitado

Ver configuración en `apps/api/src/main.ts:8-11`.

## Build

### Build de Producción

```bash
# Build completo
pnpm build

# Build específico
pnpm build --filter=web
pnpm build --filter=api
```

### Outputs de Build

- **Frontend**: `.next/` (Next.js output)
- **Backend**: `dist/` (TypeScript compilado)

## Características del Monorepo

### Turborepo

Este proyecto usa Turborepo para:

- **Builds incrementales**: Solo reconstruye lo que cambió
- **Caching inteligente**: Cachea resultados de builds y tests
- **Ejecución paralela**: Ejecuta tareas en paralelo cuando es posible
- **Dependencias optimizadas**: Respeta el grafo de dependencias

### Workspaces con pnpm

Los workspaces están definidos en `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## Herramientas de Desarrollo

### TypeScript

- Versión: 5.9.2 (root), 5.7.3 (api)
- Configuraciones compartidas en `packages/typescript-config`

### ESLint

- Versión: 9.x
- Configuraciones compartidas en `packages/eslint-config`
- Incluye: eslint-config-prettier

### Prettier

- Versión: 3.7.4
- Formatea automáticamente: TypeScript, TSX, Markdown

## Componentes UI Disponibles

El proyecto incluye una suite completa de componentes Radix UI:

- Accordion, Alert Dialog, Avatar, Checkbox
- Dialog, Dropdown Menu, Hover Card, Label
- Menubar, Navigation Menu, Popover, Progress
- Radio Group, Scroll Area, Select, Separator
- Slider, Switch, Tabs, Toast, Toggle, Tooltip
- Carousel (Embla)
- Command Palette (cmdk)
- Drawer (Vaul)
- OTP Input

## Licencia

UNLICENSED (Privado)

## Soporte

Para issues y preguntas, contactar al equipo de desarrollo.
