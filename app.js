// Este é o ponto de entrada principal da aplicação Express

import express from 'express'; // Framework web para Node.js
import cors from 'cors'; // ✅ Importação do CORS
import dotenv from 'dotenv'; // Carrega variáveis de ambiente do arquivo .env
import dishRoutes from './src/routes/dishRoutes.js'; // Rotas dos pratos
import authRoutes from './src/routes/authRoutes.js'; // Rotas de autenticação
import { authenticate } from './src/middlewares/auth.js'; // Middleware de autenticação JWT
import { db, initDB } from './src/models/db.js'; // Conexão com banco de dados

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Define a porta da aplicação

// ✅ Habilita CORS para todas as origens (ideal para dev local)
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('', cors());
// Ou para restringir a um domínio específico:
// app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json()); // Permite que o Express lide com JSON no corpo das requisições

// Rota raiz simples para teste de funcionamento da API
app.get('/', (req, res) => res.send('API Home Chef rodando'));

// Rotas públicas (registro e login)
app.use('/api/auth', authRoutes);

// Rotas protegidas - requerem autenticação com JWT
app.use('/api/dishes', authenticate, dishRoutes);

// Inicializa o banco e depois inicia o servidor
initDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Servidor rodando na porta ${PORT}`)
  );
}).catch((err) => {
  console.error('Erro ao inicializar o banco:', err);
});
