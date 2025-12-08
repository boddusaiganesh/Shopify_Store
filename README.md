# Shopify Data Ingestion & Insights Service

A production-ready multi-tenant SaaS platform for Shopify merchants to ingest, analyze, and visualize their store data
with real-time insights.

🔗 **GitHub Repository**: https://github.com/boddusaiganesh/Shopify_Store   
🚀 **Live Demo**: https://shopify-insights.netlify.app  
🔌 **Backend API**: https://shopify-insights-api-hmqx.onrender.com

## ✨ Features

### Core Features

- ✅ **Email Authentication** - Secure JWT-based authentication
- ✅ **Multi-Tenant Architecture** - Isolated data for each Shopify store
- ✅ **Real-Time Data Sync** - Scheduled syncing every 6 hours + manual sync
- ✅ **Shopify Webhooks** - Real-time updates for orders, customers, and events
- ✅ **Custom Events Tracking** - Cart abandonment, checkout started
- ✅ **PostgreSQL Database** - Production-ready relational database
- ✅ **Date Range Filtering** - Analyze data for custom date ranges
- ✅ **Beautiful Dashboard** - Modern, responsive UI with charts

### Analytics & Insights

- 📊 Total customers, orders, and revenue
- 📈 Orders trend with customizable date ranges
- 👥 Top 5 customers by spend
- 💰 Revenue tracking
- 📉 Visual charts and graphs

## Architecture

```mermaid
graph TB
    User[👤 User] -->|Email Auth| Web[Next.js Frontend]
    Web -->|JWT Token| API[Express.js API]
    API -->|Prisma ORM| DB[(PostgreSQL)]
    API -->|Admin API| Shopify[Shopify Store]
    Shopify -->|Webhooks| API
    Scheduler[Cron Scheduler] -->|Every 6hrs| API
    API -->|Sync Data| Shopify
    
    style Web fill:#3b82f6
    style API fill:#10b981
    style DB fill:#f59e0b
    style Shopify fill:#8b5cf6
```

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Scheduling**: node-cron
- **HTTP Client**: axios

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

### Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Render PostgreSQL (or any PostgreSQL provider)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Shopify development store (free)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd shopify-ingestion-service

# Install dependencies
npm install

# Setup backend environment
cd apps/api
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Setup database
npx prisma generate
npx prisma db push

# Setup frontend environment
cd ../web
cp .env.example .env.local
# Edit .env.local if needed

# Return to root and start both servers
cd ../..
npm run dev
```

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

### First Time Setup

1. Open http://localhost:3000
2. Create an account (email + password)
3. Add your Shopify store credentials
4. Click "Sync Data" to import your data

See the Quick Start section above for setup instructions.

## 📡 API Endpoints

### Authentication (Public)

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login with email/password
GET    /api/auth/me                Get current user info (requires auth)
```

### Tenants (Protected)

```
POST   /api/tenants                Create new tenant/store
GET    /api/tenants                List user's tenants
GET    /api/tenants/:id            Get tenant details
```

### Data Ingestion (Protected)

```
POST   /api/ingest/products        Import products from Shopify
POST   /api/ingest/customers       Import customers from Shopify
POST   /api/ingest/orders          Import orders from Shopify
POST   /api/sync/:tenantId         Full sync (all data)
```

### Analytics & Insights (Protected)

```
GET    /api/insights/summary?tenantId=UUID
       → Total customers, orders, revenue

GET    /api/insights/top-customers?tenantId=UUID
       → Top 5 customers by spend

GET    /api/insights/orders-trend?tenantId=UUID&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
       → Orders trend with date filtering
```

### Webhooks (Public - for Shopify)

```
POST   /api/webhooks/orders/create        Order created webhook
POST   /api/webhooks/customers/create     Customer created webhook
POST   /api/webhooks/carts/abandoned      Cart abandoned webhook
POST   /api/webhooks/checkouts/create     Checkout started webhook
```

All protected endpoints require: `Authorization: Bearer <JWT_TOKEN>`

## 🗄️ Database Schema

```sql
User
├── id (UUID, PK)
├── email (String, Unique)
├── password (String, Hashed)
├── name (String?)
└── tenants (Relation)

Tenant
├── id (UUID, PK)
├── storeName (String)
├── storeUrl (String, Unique)
├── accessToken (String)
├── userId (UUID, FK → User)
├── products (Relation)
├── customers (Relation)
├── orders (Relation)
├── events (Relation)
└── syncLogs (Relation)

Product
├── id (UUID, PK)
├── shopifyId (String)
├── title (String)
├── bodyHtml (String?)
├── vendor (String?)
├── productType (String?)
├── tenantId (UUID, FK → Tenant)
└── Unique(shopifyId, tenantId)

Customer
├── id (UUID, PK)
├── shopifyId (String)
├── firstName (String?)
├── lastName (String?)
├── email (String?)
├── phone (String?)
├── totalSpent (Decimal?)
├── ordersCount (Int?)
├── tenantId (UUID, FK → Tenant)
├── orders (Relation)
└── Unique(shopifyId, tenantId)

Order
├── id (UUID, PK)
├── shopifyId (String)
├── orderNumber (Int?)
├── totalPrice (Decimal?)
├── currency (String?)
├── processedAt (DateTime?)
├── tenantId (UUID, FK → Tenant)
├── customerId (UUID?, FK → Customer)
└── Unique(shopifyId, tenantId)

CustomEvent
├── id (UUID, PK)
├── eventType (String) // 'cart_abandoned', 'checkout_started', etc.
├── eventData (JSON)
├── customerId (String?)
├── customerEmail (String?)
├── shopifyId (String?)
├── tenantId (UUID, FK → Tenant)
└── createdAt (DateTime)

SyncLog
├── id (UUID, PK)
├── syncType (String) // 'products', 'customers', 'orders', 'full'
├── status (String) // 'success', 'failed', 'in_progress'
├── itemsCount (Int?)
├── errorMessage (String?)
├── startedAt (DateTime)
├── completedAt (DateTime?)
└── tenantId (UUID, FK → Tenant)
```

## 🎯 Assumptions & Design Decisions

### Authentication

- Implemented JWT-based email authentication
- Passwords are hashed using bcryptjs
- Tokens expire after 7 days
- OAuth flow could be added for production

### Data Sync Strategy

- **Scheduled Sync**: Automatic sync every 6 hours using cron
- **Manual Sync**: Users can trigger sync on-demand
- **Webhooks**: Real-time updates for critical events
- **Incremental Sync**: Future enhancement (currently full sync)

### Multi-Tenancy

- Complete data isolation using `tenantId`
- Each user can manage multiple Shopify stores
- Tenant ownership verified on every request

### Shopify Integration

- Uses Shopify Admin API (REST)
- Requires Admin API access token (Custom App)
- Supports Shopify API version 2023-10
- Pagination handling for large datasets (future enhancement)

## 🚧 Known Limitations

### Current Limitations

1. **Pagination**: Only fetches first 250 items per resource (Shopify limit)
2. **Rate Limiting**: No rate limiting implemented yet
3. **Bulk Operations**: Large syncs may be slow
4. **Error Recovery**: Basic error handling (needs improvement)
5. **Caching**: No caching layer (Redis recommended)

### Security Considerations

- Access tokens stored encrypted in production (recommended)
- CORS configured for specific origins
- Input validation needed for all endpoints
- Rate limiting should be added
- API key rotation not implemented

