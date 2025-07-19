import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 
import dishRoutes from './src/routes/dishRoutes.js'; 
import authRoutes from './src/routes/authRoutes.js'; 
import { authenticate } from './src/middlewares/auth.js'; 
import { db, initDB } from './src/models/db.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('', cors());

app.use(express.json()); 

app.get('/', (req, res) => res.send('API Home Chef rodando'));

app.use('/api/auth', authRoutes);

app.use('/api/dishes', authenticate, dishRoutes);

initDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Servidor rodando na porta ${PORT}`)
  );
}).catch((err) => {
  console.error('Erro ao inicializar o banco:', err);
});
