import express from 'express'
import {
  getAllDishes,
  createDish,
  updateDish,
  deleteDish,
  searchDish,
  getDishById,
  atualizarDisponibilidade
} from '../controllers/dishController.js'

const router = express.Router()

router.patch('/:id/disponibilidade', atualizarDisponibilidade)

router.get('/', getAllDishes)
router.get('/search', searchDish)
router.get('/:id', getDishById) 
router.post('/', createDish)
router.put('/:id', updateDish)
router.delete('/:id', deleteDish)


export default router