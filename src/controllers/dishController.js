import { db } from '../models/db.js';
import { v4 as uuid } from 'uuid';

const isPrecoValido = (preco) => typeof preco === 'number' && preco > 0;
const sendServerError = (res, error) => {
  console.error('Erro:', error);
  res.status(500).json({ message: 'Erro interno do servidor' });
};
export const getAllDishes = async (req, res) => {
  try {
    await db.read();
    res.json(db.data.dishes || []);
  } catch (error) {
    sendServerError(res, error);
  }
};

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

export const createDish = async (req, res) => {
  try {
    const { nome, descricao, preco, categoria, disponivel } = req.body;

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
      disponivel: disponivel ?? true,
    };

    await db.read();
    db.data.dishes.push(newDish);
    await db.write();
    res.status(201).json(newDish);
  } catch (error) {
    sendServerError(res, error);
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, categoria, disponivel } = req.body;

    await db.read();
    const dish = db.data.dishes.find((d) => d.id === id);

    if (!dish) {
      return res.status(404).json({ message: 'Prato não encontrado' });
    }

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

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    await db.read();

    const index = db.data.dishes.findIndex((d) => d.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Prato não encontrado' });
    }

    db.data.dishes.splice(index, 1);
    await db.write();
    res.status(204).end();
  } catch (error) {
    sendServerError(res, error);
  }
};

export const searchDish = async (req, res) => {
  try {
    const { nome = '', categoria = '' } = req.query;
    await db.read();

    const results = db.data.dishes.filter((d) =>
      d.nome.toLowerCase().includes(nome.toLowerCase()) &&
      d.categoria.toLowerCase().includes(categoria.toLowerCase())
    );

    res.json(results);
  } catch (error) {
    sendServerError(res, error);
  }
};

export async function atualizarDisponibilidade(req, res) {
  const { id } = req.params;
  const { disponivel } = req.body;

  try {
    const result = await prisma.dish.update({
      where: { id: Number(id) },
      data: { disponivel: Boolean(disponivel) },
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao atualizar disponibilidade:', error);
    res.status(500).json({ error: 'Erro ao atualizar disponibilidade' });
  }
;}



