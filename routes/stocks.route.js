const express = require('express');
const router = express.Router();
const {
  listStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
} = require('../controller/stocks.controller');


router.get('/', listStocks);      // 列表
router.get('/:id', getStockById); // 详情
router.post('/', createStock);    // 新增
router.patch('/:id', updateStock);// 更新
router.delete('/:id', deleteStock);// 删除

module.exports = router;
