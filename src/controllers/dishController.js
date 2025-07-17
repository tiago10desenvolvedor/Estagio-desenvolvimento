import { db } from '../models/db.js';
import { v4 as uuid } from 'uuid';

// ✅ Melhoria: Função utilitária para validar preço
const isPrecoValido = (preco) => typeof preco === 'number' && preco > 0;

// ✅ Melhoria: função auxiliar para mensagens de erro padronizadas
const sendServerError = (res, error) => {
  console.error('Erro:', error); // Log do erro para facilitar debug
  res.status(500).json({ message: 'Erro interno do servidor' });
};

// Listar todos os pratos
export const getAllDishes = async (req, res) => {
  try {
    await db.read();
    res.json(db.data.dishes || []); // ✅ Melhoria: retorna array vazio se não houver pratos
  } catch (error) {
    sendServerError(res, error);
  }
};

// Buscar prato por ID
export const getDishById = async (req, res) => {
  try {
    const { id } = req.params;
    await db.read();
    const dish = db.data.dishes.find((d) => d.id === id);

    if (!dish) {
      return res.status(404).json({ message: 'Prato não encontrado' });
    }

    res.json(dish);
  } catch (error) {
    sendServerError(res, error);
  }
};

// Cadastrar novo prato
export const createDish = async (req, res) => {
  try {
    const { nome, descricao, preco, categoria, disponivel } = req.body;

    // ✅ Melhoria: Trim e validações mais robustas
    if (!nome?.trim() || !descricao?.trim() || preco === undefined || !categoria?.trim()) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes ou inválidos' });
    }

    if (!isPrecoValido(preco)) {
      return res.status(400).json({ message: 'Preço deve ser número maior que zero' });
    }

    const newDish = {
      id: uuid(),
      nome: nome.trim(),
      descricao: descricao.trim(),
      preco,
      categoria: categoria.trim(),
      disponivel: disponivel ?? true, // ✅ Melhoria: fallback mais explícito
    };

    await db.read();
    db.data.dishes.push(newDish);
    await db.write();
    res.status(201).json(newDish);
  } catch (error) {
    sendServerError(res, error);
  }
};

// Atualizar prato
export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, categoria, disponivel } = req.body;

    await db.read();
    const dish = db.data.dishes.find((d) => d.id === id);
    if (!dish) {
      return res.status(404).json({ message: 'Prato não encontrado' });
    }

    // ✅ Melhoria: Atualizações com trim e validações adicionais
    if (nome !== undefined) dish.nome = nome.trim();
    if (descricao !== undefined) dish.descricao = descricao.trim();
    if (categoria !== undefined) dish.categoria = categoria.trim();
    if (disponivel !== undefined) dish.disponivel = disponivel;

    if (preco !== undefined) {
      if (!isPrecoValido(preco)) {
        return res.status(400).json({ message: 'Preço deve ser número maior que zero' });
      }
      dish.preco = preco;
    }

    await db.write();
    res.json(dish);
  } catch (error) {
    sendServerError(res, error);
  }
};

// Deletar prato
export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    await db.read();

    const index = db.data.dishes.findIndex((d) => d.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Prato não encontrado' });
    }

    db.data.dishes.splice(index, 1); // ✅ Melhoria: splice é mais eficiente que recriar array
    await db.write();
    res.status(204).end();
  } catch (error) {
    sendServerError(res, error);
  }
};

// Buscar prato por nome ou categoria
export const searchDish = async (req, res) => {
  try {
    const { nome = '', categoria = '' } = req.query;
    await db.read();

    const results = db.data.dishes.filter((d) =>
      d.nome.toLowerCase().includes(nome.toLowerCase()) &&
      d.categoria.toLowerCase().includes(categoria.toLowerCase()) // ✅ Melhoria: permite busca parcial de categoria
    );

    res.json(results);
  } catch (error) {
    sendServerError(res, error);
  }
};
