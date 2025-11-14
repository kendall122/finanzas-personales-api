# 📘 Finanzas Personales API – Proyecto 2

Backend desarrollado con NestJS, PostgreSQL (Supabase) y el patrón de diseño Builder, como continuación del Dashboard de Finanzas Personales del Proyecto 1 del curso de Diseño de Bases de Datos.

## 🧩 Descripción General

Esta API permite que un usuario:

- Gestione transacciones (ingresos y gastos).
- Cree y administre metas de ahorro.
- Obtenga un resumen financiero construido mediante el patrón Builder.
- Se autentique mediante JWT.
- Utilice la documentación interactiva generada con Swagger.

Este backend será desplegado en Azure como parte del proyecto.

## 🏗️ Tecnologías Utilizadas

| Tecnología | Uso |
| --- | --- |
| NestJS | Arquitectura modular del backend |
| TypeScript | Tipado estático y robustez |
| PostgreSQL (Supabase) | Base de datos |
| TypeORM | ORM para entidades y migraciones |
| JWT | Autenticación |
| Swagger / OpenAPI | Documentación del API |
| Azure App Service | Despliegue final |

## 🧱 Arquitectura del Proyecto

El sistema está construido con una arquitectura modular:

```text
src/
├── auth/
├── users/
├── transactions/
├── goals/
├── dashboard/
│   └── builder/
├── common/
└── config/
```

**Patrón de diseño utilizado: Builder**

Se aplica en el módulo `dashboard/` para construir un objeto complejo llamado `DashboardSummary`, el cual combina:

- Totales de ingresos
- Totales de gastos
- Balance final
- Estado y avance de metas de ahorro
- Cantidad de transacciones
- Otros datos del dashboard

El uso del Builder permite:

- Construir el resumen paso a paso
- Extender métricas sin romper código
- Mantener el cálculo desacoplado
- Proveer un endpoint `/dashboard/summary` limpio y mantenible

## 📌 Endpoints Principales

**🔐 Autenticación**

- `POST /auth/register` – Registrar usuario
- `POST /auth/login` – Iniciar sesión (JWT)
- `GET /auth/me` – Obtener perfil autenticado

**💸 Transacciones**

- `GET /transactions`
- `POST /transactions`
- `GET /transactions/:id`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

**🎯 Metas de Ahorro**

- `GET /goals`
- `POST /goals`
- `PATCH /goals/:id/contribute`

**📊 Dashboard**

- `GET /dashboard/summary` – Construido con Builder

La documentación completa estará disponible en Swagger en `http://localhost:3000/api`.

## 🛠️ Instalación y Ejecución Local

1. Clonar el repositorio

   ```bash
   git clone https://github.com/kendall122/finanzas-personales-api.git
   cd finanzas-personales-api
   ```

2. Instalar dependencias

   ```bash
   npm install
   ```

3. Configurar variables de entorno

   Copiar el archivo de ejemplo:

   ```bash
   cp .env.example .env
   ```

   Editar los valores según Supabase:

   ```env
   DATABASE_URL=postgresql://usuario:password@host:5432/database
   JWT_SECRET=supersecreto123
   PORT=3000
   ```

4. Ejecutar en desarrollo

   ```bash
   npm run start:dev
   ```

## 🔐 Variables de Entorno (`.env`)

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | URL de conexión a PostgreSQL (Supabase) |
| `JWT_SECRET` | Clave secreta para firmar tokens |
| `PORT` | Puerto de ejecución del servidor |

## 🚀 Despliegue en Azure

El proyecto se desplegará utilizando Azure App Service con:

- Pipeline de despliegue automático opcional (CI/CD)
- Variables de entorno seguras en el panel de Azure
- Instancia vinculada a la base de datos de Supabase

La URL final del despliegue se incluirá aquí cuando esté lista.

## 👥 Autores del Proyecto

- Kendall Montero
- (Agregar nombres de tus compañeros si aplica)

## 📚 Licencia

Este proyecto es únicamente para fines académicos.
