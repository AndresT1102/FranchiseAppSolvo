# 🏪 Franchise Management System

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)
![Azure](https://img.shields.io/badge/Azure-App%20Service-0078D4?logo=microsoftazure)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)

Sistema de gestión de franquicias desarrollado con ASP.NET Core 8.0 y React 19, desplegado en Azure App Service y Vercel.

## 🌐 Links de Producción

- **Frontend (Vercel)**: [https://franchise-app-solvo.vercel.app](https://franchise-app-solvo.vercel.app)
- **API Swagger (Azure)**: [https://franchiseappsolvo-api-gcdweygngaewdkem.brazilsouth-01.azurewebsites.net/swagger](https://franchiseappsolvo-api-gcdweygngaewdkem.brazilsouth-01.azurewebsites.net/swagger)
- **API Base URL**: `https://franchiseappsolvo-api-gcdweygngaewdkem.brazilsouth-01.azurewebsites.net/api`

---

## 📋 Descripción del Sistema

Sistema integral para la gestión de franquicias que permite administrar:
- **Franquicias**: Creación, edición y eliminación de franquicias
- **Sucursales**: Gestión de sucursales asociadas a cada franquicia
- **Productos**: Control de inventario con actualización de stock por sucursal

### Características Principales
✅ CRUD completo para franquicias, sucursales y productos  
✅ Validación de duplicados con mensajes específicos  
✅ Paginación en todas las vistas (10 elementos por página)  
✅ Estados de carga en todas las operaciones asíncronas  
✅ Manejo centralizado de errores con notificaciones visuales  
✅ Diseño responsivo con CSS modular  
✅ API documentada con Swagger  
✅ Base de datos relacional en Azure SQL Database  

---

## 🛠️ Requisitos Previos

### Backend
- **.NET SDK**: 8.0 o superior
- **SQL Server**: Azure SQL Database o SQL Server local
- **IDE recomendado**: Visual Studio 2022 o VS Code con extensión C#

### Frontend
- **Node.js**: 20.x o superior
- **npm**: 10.x o superior
- **Navegador moderno**: Chrome, Firefox, Edge (versiones recientes)

### Herramientas de Desarrollo
- **Git**: Para control de versiones
- **Entity Framework Core CLI**: Para migraciones de base de datos
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

## 🚀 Configuración e Instalación

### Backend - ASP.NET Core 8.0

#### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd FranchiseAppSolvo/backend/FranchiseApi
```

#### 2. Configurar la cadena de conexión
Crear `appsettings.Development.json` basado en `appsettings.example.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=FranchiseDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**Para Azure SQL Database**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:your-server.database.windows.net,1433;Initial Catalog=FranchiseDB;Persist Security Info=False;User ID=your-user;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

#### 3. Restaurar dependencias
```bash
dotnet restore
```

#### 4. Aplicar migraciones (ver sección "Migraciones")
```bash
dotnet ef database update
```

#### 5. Ejecutar la aplicación
```bash
dotnet run
```

La API estará disponible en:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

---

### Frontend - React 19 + Vite

#### 1. Navegar a la carpeta del frontend
```bash
cd frontend
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar variables de entorno
Crear `.env.local` para desarrollo:
```env
VITE_API_URL=http://localhost:5000/api
```

Para producción (`.env.production`):
```env
VITE_API_URL=https://franchiseappsolvo-api-gcdweygngaewdkem.brazilsouth-01.azurewebsites.net/api
```

#### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

#### 5. Compilar para producción
```bash
npm run build
```

Los archivos optimizados se generarán en `/dist`.

---

## 🗄️ Migraciones con Entity Framework Core

### Comandos Esenciales

#### Crear una nueva migración
```bash
cd backend/FranchiseApi
dotnet ef migrations add <NombreMigracion>
```

**Ejemplo**:
```bash
dotnet ef migrations add InitialCreate
dotnet ef migrations add AddProductStockField
```

#### Aplicar migraciones a la base de datos
```bash
dotnet ef database update
```

#### Ver todas las migraciones
```bash
dotnet ef migrations list
```

#### Revertir a una migración específica
```bash
dotnet ef database update <NombreMigracion>
```

**Ejemplo** (volver a la migración anterior):
```bash
dotnet ef database update InitialCreate
```

#### Eliminar la última migración (sin aplicar)
```bash
dotnet ef migrations remove
```

#### Generar script SQL de las migraciones
```bash
dotnet ef migrations script
dotnet ef migrations script -o migrations.sql
```

### Flujo de Trabajo Típico
1. Modificar modelos en `/Models` (ej: `Product.cs`)
2. Crear migración: `dotnet ef migrations add AddNewField`
3. Revisar archivos generados en `/Migrations`
4. Aplicar cambios: `dotnet ef database update`
5. Verificar con SQL Server Management Studio o Azure Data Studio

---

##  Arquitectura del Sistema

### Arquitectura Backend (ASP.NET Core)

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                      │
│              HTTP/HTTPS Requests (JSON)                 │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                 ASP.NET Core Web API                    │
├─────────────────────────────────────────────────────────┤
│  Controllers Layer                                      │
│  ├── FranchisesController.cs                           │
│  ├── BranchesController.cs                             │
│  └── ProductsController.cs                             │
├─────────────────────────────────────────────────────────┤
│  Middleware Layer                                       │
│  └── ErrorHandlingMiddleware.cs (Global Exception)     │
├─────────────────────────────────────────────────────────┤
│  DTOs Layer (Data Transfer Objects)                    │
│  ├── FranchiseDto.cs                                   │
│  ├── BranchDto.cs                                      │
│  └── ProductDto.cs                                     │
├─────────────────────────────────────────────────────────┤
│  Data Access Layer                                      │
│  └── ApplicationDbContext.cs (EF Core)                 │
├─────────────────────────────────────────────────────────┤
│  Models Layer (Domain Entities)                        │
│  ├── Franchise.cs                                      │
│  ├── Branch.cs                                         │
│  └── Product.cs                                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│           Azure SQL Database / SQL Server               │
│  ├── TBL_FRANCHISES                                    │
│  ├── TBL_BRANCHES                                      │
│  └── TBL_PRODUCTS                                      │
└─────────────────────────────────────────────────────────┘
```

### Arquitectura Frontend (React)

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Pages Layer                                            │
│  ├── Dashboard.jsx (Overview + Stats)                  │
│  ├── Franchises.jsx (CRUD + Pagination)                │
│  ├── Branches.jsx (CRUD + Pagination)                  │
│  └── Products.jsx (CRUD + Stock + Pagination)          │
├─────────────────────────────────────────────────────────┤
│  Components Layer                                       │
│  ├── layout/                                           │
│  │   ├── Layout.jsx                                    │
│  │   ├── Header.jsx                                    │
│  │   └── SideBar.jsx                                   │
│  ├── common/                                           │
│  │   ├── Table.jsx (Reusable)                          │
│  │   ├── Button.jsx (Loading States)                   │
│  │   ├── Modal.jsx                                     │
│  │   ├── Pagination.jsx                                │
│  │   ├── SearchBar.jsx                                 │
│  │   └── Card.jsx                                      │
│  └── stats/                                            │
│      └── StatsCard.jsx                                 │
├─────────────────────────────────────────────────────────┤
│  Services Layer                                         │
│  ├── api.js (Axios instance + interceptors)           │
│  └── franchiseService.js (API calls)                  │
├─────────────────────────────────────────────────────────┤
│  Utilities Layer                                        │
│  ├── errorHandler.js (Centralized error handling)     │
│  └── sweetAlert.js (Notifications wrapper)            │
├─────────────────────────────────────────────────────────┤
│  Hooks Layer                                            │
│  └── useApi.js (Custom hook for async operations)     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (via Axios)                    │
└─────────────────────────────────────────────────────────┘
```

### Diagrama de Base de Datos

```
┌─────────────────────────────────────────────────┐
│            TBL_FRANCHISES                       │
├─────────────────────────────────────────────────┤
│ PK  ID (int, IDENTITY)                         │
│     NAME (nvarchar(100), UNIQUE)               │
├─────────────────────────────────────────────────┤
│ Indexes:                                        │
│   - PK_FRANCHISES (ID)                         │
│   - UQ_FRANCHISE_NAME (NAME)                   │
└──────────────────┬──────────────────────────────┘
                   │ 1
                   │
                   │ N
┌──────────────────▼──────────────────────────────┐
│              TBL_BRANCHES                       │
├─────────────────────────────────────────────────┤
│ PK  ID (int, IDENTITY)                         │
│ FK  FRANCHISE_ID (int)                         │
│     NAME (nvarchar(100))                       │
├─────────────────────────────────────────────────┤
│ Indexes:                                        │
│   - PK_BRANCHES (ID)                           │
│   - FK_BRANCHES_FRANCHISE (FRANCHISE_ID)       │
│   - UQ_BRANCH_NAME_PER_FRANCHISE               │
│     (FRANCHISE_ID, NAME)                       │
└──────────────────┬──────────────────────────────┘
                   │ 1
                   │
                   │ N
┌──────────────────▼──────────────────────────────┐
│              TBL_PRODUCTS                       │
├─────────────────────────────────────────────────┤
│ PK  ID (int, IDENTITY)                         │
│ FK  BRANCH_ID (int)                            │
│     NAME (nvarchar(100))                       │
│     STOCK (int, NOT NULL, DEFAULT 0)           │
├─────────────────────────────────────────────────┤
│ Indexes:                                        │
│   - PK_PRODUCTS (ID)                           │
│   - FK_PRODUCTS_BRANCH (BRANCH_ID)             │
│   - UQ_PRODUCT_NAME_PER_BRANCH                 │
│     (BRANCH_ID, NAME)                          │
└─────────────────────────────────────────────────┘

Relaciones:
  TBL_FRANCHISES (1) ←→ (N) TBL_BRANCHES
  TBL_BRANCHES (1) ←→ (N) TBL_PRODUCTS

Cascade Delete:
  - Eliminar franquicia → elimina sucursales y productos
  - Eliminar sucursal → elimina productos
```

---

## 📂 Estructura del Proyecto

```
FranchiseAppSolvo/
│
├── backend/
│   └── FranchiseApi/
│       ├── Controllers/          # Endpoints REST
│       │   ├── FranchisesController.cs
│       │   ├── BranchesController.cs
│       │   └── ProductsController.cs
│       ├── Data/                 # DbContext
│       │   └── ApplicationDbContext.cs
│       ├── DTOs/                 # Data Transfer Objects
│       │   ├── FranchiseDto.cs
│       │   ├── BranchDto.cs
│       │   └── ProductDto.cs
│       ├── Middleware/           # Error handling global
│       │   └── ErrorHandlingMiddleware.cs
│       ├── Migrations/           # EF Core migrations
│       ├── Models/               # Entidades de dominio
│       │   ├── Franchise.cs
│       │   ├── Branch.cs
│       │   ├── Product.cs
│       │   └── ErrorResponse.cs
│       ├── Properties/
│       │   └── launchSettings.json
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── appsettings.Production.json
│       ├── FranchiseApi.csproj
│       └── Program.cs            # Configuración de servicios y middleware
│
├── frontend/
│   ├── public/                   # Archivos estáticos
│   ├── src/
│   │   ├── assets/               # Imágenes, iconos
│   │   ├── components/
│   │   │   ├── common/           # Componentes reutilizables
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   └── Card.jsx
│   │   │   ├── layout/           # Layout de la app
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── SideBar.jsx
│   │   │   └── stats/
│   │   │       └── StatsCard.jsx
│   │   ├── hooks/
│   │   │   └── useApi.js         # Custom hooks
│   │   ├── pages/                # Vistas principales
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Franchises.jsx
│   │   │   ├── Branches.jsx
│   │   │   └── Products.jsx
│   │   ├── services/
│   │   │   ├── api.js            # Configuración Axios
│   │   │   └── franchiseService.js
│   │   ├── styles/
│   │   │   └── variables.css     # Variables CSS globales
│   │   ├── utils/
│   │   │   ├── errorHandler.js   # Manejo centralizado de errores
│   │   │   └── sweetAlert.js     # Wrapper de SweetAlert2
│   │   ├── App.jsx               # Componente raíz
│   │   ├── App.css
│   │   ├── main.jsx              # Entry point
│   │   └── index.css
│   ├── .env.local                # Variables de entorno (desarrollo)
│   ├── .env.production           # Variables de entorno (producción)
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── FranchiseAppSolvo.sln         # Solución de Visual Studio
└── README.md                      # Este archivo
```

---

## 🌐 Endpoints de la API

### Franchises
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/franchises` | Obtener todas las franquicias |
| `GET` | `/api/franchises/{id}` | Obtener franquicia por ID |
| `POST` | `/api/franchises` | Crear nueva franquicia |
| `PUT` | `/api/franchises/{id}` | Actualizar franquicia |
| `DELETE` | `/api/franchises/{id}` | Eliminar franquicia |

### Branches
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/branches` | Obtener todas las sucursales |
| `GET` | `/api/branches/{id}` | Obtener sucursal por ID |
| `GET` | `/api/branches/franchise/{franchiseId}` | Sucursales por franquicia |
| `POST` | `/api/branches` | Crear nueva sucursal |
| `PUT` | `/api/branches/{id}` | Actualizar sucursal |
| `DELETE` | `/api/branches/{id}` | Eliminar sucursal |

### Products
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/products` | Obtener todos los productos |
| `GET` | `/api/products/{id}` | Obtener producto por ID |
| `GET` | `/api/products/branch/{branchId}` | Productos por sucursal |
| `POST` | `/api/products` | Crear nuevo producto |
| `PUT` | `/api/products/{id}` | Actualizar producto |
| `PUT` | `/api/products/{id}/stock` | Actualizar stock de producto |
| `DELETE` | `/api/products/{id}` | Eliminar producto |

**Probar endpoints**: [Swagger UI](https://franchiseappsolvo-api-gcdweygngaewdkem.brazilsouth-01.azurewebsites.net/swagger)

---

## 🧪 Pruebas

### Pruebas Manuales - Frontend
1. Navegar a cada página (Dashboard, Franchises, Branches, Products)
2. Verificar operaciones CRUD
3. Validar mensajes de error específicos (duplicados, validaciones)
4. Comprobar paginación y estados de carga
5. Probar responsividad en diferentes resoluciones

### Pruebas Manuales - Backend
1. Abrir [Swagger UI](https://franchiseappsolvo-api-gcdweygngaewdkem.brazilsouth-01.azurewebsites.net/swagger)
2. Probar cada endpoint con datos válidos e inválidos
3. Verificar códigos de estado HTTP (200, 201, 400, 404, 409, 500)
4. Validar estructura de respuestas JSON

---

## 🔧 Tecnologías Utilizadas

### Backend
- **ASP.NET Core 8.0** - Framework web
- **Entity Framework Core 8.0** - ORM
- **SQL Server / Azure SQL Database** - Base de datos
- **Swagger (Swashbuckle)** - Documentación de API

### Frontend
- **React 19.2.0** - Biblioteca UI
- **Vite 7.3.1** - Build tool
- **React Router 7.1.1** - Navegación
- **Axios 1.13.6** - Cliente HTTP
- **SweetAlert2 11.26.22** - Notificaciones

### DevOps
- **Azure App Service** - Hosting backend
- **Vercel** - Hosting frontend
- **Git** - Control de versiones
- **GitHub** - Repositorio remoto

---

## 👤 Autor: ANDRES DAVID TORRES VIERA

Desarrollado como parte de una prueba técnica para demostrar competencias en:
- Desarrollo full-stack con .NET y React
- Arquitectura de aplicaciones web
- Manejo de bases de datos relacionales
- Despliegue en plataformas cloud (Azure, Vercel)
- Buenas prácticas de desarrollo (separación de capas, manejo de errores, validaciones)

---

## 📝 Notas Adicionales

### Manejo de Errores
- **400 Bad Request**: Validaciones de datos (advertencia amarilla)
- **404 Not Found**: Recurso no encontrado (error rojo)
- **409 Conflict**: Duplicados (advertencia amarilla)
- **500 Internal Server Error**: Error del servidor (error rojo)

### Validaciones Implementadas
- Nombres únicos de franquicias a nivel global
- Nombres únicos de sucursales por franquicia
- Nombres únicos de productos por sucursal
- Stock no puede ser negativo
- Campos requeridos validados en frontend y backend

### Consideraciones de Seguridad
- Connection strings en archivos de configuración (no en código)
- CORS configurado solo para dominios específicos
- HTTPS habilitado en producción
- Variables de entorno para datos sensibles

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos y de evaluación técnica para la empresa Solvo Global.
