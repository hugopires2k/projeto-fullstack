# Projeto Fullstack — JWT + Mongoose + PWA

## Estrutura

```
backend/
  server.js
  src/
    config/db.js
    controllers/
      userController.js
      productController.js      ← nova entidade
    middlewares/
      authMiddleware.js
      roleMiddleware.js
    models/
      User.js
      Product.js                ← novo modelo
    routes/
      userRoutes.js
      productRoutes.js          ← novas rotas
frontend/
  index.html
  styles.css
  script.js
  manifest.json                 ← PWA
  sw.js                         ← Service Worker
```

## Nova entidade: Produto

Campos: `name`, `description`, `price`, `category`, `stock`, `active`

### Rotas de Produtos

| Método | Rota | Acesso |
|--------|------|--------|
| POST | /api/products | admin |
| GET | /api/products | autenticado |
| GET | /api/products/:id | autenticado |
| PUT | /api/products/:id | admin |
| DELETE | /api/products/:id | admin |

## Como executar localmente

```bash
cd backend
npm install
cp .env.example .env   # preencha MONGO_URI e JWT_SECRET
npm run dev
```

Acesse: http://localhost:3000

## Deploy

### MongoDB → MongoDB Atlas
1. Crie um cluster gratuito em https://cloud.mongodb.com
2. Crie um database user e libere o IP `0.0.0.0/0`
3. Copie a connection string para o `.env` como `MONGO_URI`

### Backend → Render
1. Suba o código no GitHub
2. Acesse https://render.com → New Web Service
3. Conecte o repositório
4. Root directory: `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Adicione as variáveis de ambiente: `MONGO_URI` e `JWT_SECRET`

### Frontend (PWA)
O frontend já é servido pelo próprio backend na rota `/`.
Não é necessário deploy separado.

Para instalar como PWA: abra o app no browser e clique em
"Instalar aplicativo" na barra de endereço (Chrome/Edge).
