import express from 'express'
import {
  getAllDishes,
  createDish,
  updateDish,
  deleteDish,
  searchDish,
  getDishById,
} from '../controllers/dishController.js'

const router = express.Router()

router.get('/', getAllDishes)
router.get('/search', searchDish)
router.get('/:id', getDishById) // <- nova rota
router.post('/', createDish)
router.put('/:id', updateDish)
router.delete('/:id', deleteDish)

export default router