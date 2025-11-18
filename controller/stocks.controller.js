const prisma = require('../db');

// GET /stocks?search=xxx
exports.listStocks = async (req, res) => {
  try {
    const { search } = req.query;

    const stocks = await prisma.stock.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      message: 'Stocks fetched',
      data: stocks,
    });
  } catch (error) {
    console.error('listStocks error:', error);
    return res.status(500).json({
      message: 'Failed to fetch stocks',
      code: 'STOCK_LIST_ERROR',
    });
  }
};

// GET /stocks/:id
exports.getStockById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const stock = await prisma.stock.findUnique({
      where: { id },
    });

    if (!stock) {
      return res.status(404).json({
        message: 'Stock not found',
        code: 'STOCK_NOT_FOUND',
      });
    }

    return res.json({
      message: 'Stock fetched',
      data: stock,
    });
  } catch (error) {
    console.error('getStockById error:', error);
    return res.status(500).json({
      message: 'Failed to fetch stock',
      code: 'STOCK_DETAIL_ERROR',
    });
  }
};

// POST /stocks
exports.createStock = async (req, res) => {
  try {
    const { name, sku, description, quantity, price, imageUrl } = req.body;

    if (!name || !sku) {
      return res.status(400).json({
        message: 'name and sku are required',
        code: 'VALIDATION_ERROR',
      });
    }

    const stock = await prisma.stock.create({
      data: {
        name,
        sku,
        description: description ?? null,
        quantity: quantity ?? 0,
        price: price ?? null,
        imageUrl: imageUrl ?? null,
        // 没有 ownerId 了
      },
    });

    return res.status(201).json({
      message: 'Stock created',
      data: stock,
    });
  } catch (error) {
    console.error('createStock error:', error);

    if (error.code === 'P2002') {
      // 唯一约束（sku 重复）
      return res.status(409).json({
        message: 'SKU already exists',
        code: 'SKU_EXISTS',
      });
    }

    return res.status(500).json({
      message: 'Failed to create stock',
      code: 'STOCK_CREATE_ERROR',
    });
  }
};

// PATCH /stocks/:id
exports.updateStock = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, sku, description, quantity, price, imageUrl } = req.body;

    const existing = await prisma.stock.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        message: 'Stock not found',
        code: 'STOCK_NOT_FOUND',
      });
    }

    const updated = await prisma.stock.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(sku !== undefined && { sku }),
        ...(description !== undefined && { description }),
        ...(quantity !== undefined && { quantity }),
        ...(price !== undefined && { price }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    return res.json({
      message: 'Stock updated',
      data: updated,
    });
  } catch (error) {
    console.error('updateStock error:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        message: 'SKU already exists',
        code: 'SKU_EXISTS',
      });
    }

    return res.status(500).json({
      message: 'Failed to update stock',
      code: 'STOCK_UPDATE_ERROR',
    });
  }
};

// DELETE /stocks/:id
exports.deleteStock = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.stock.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        message: 'Stock not found',
        code: 'STOCK_NOT_FOUND',
      });
    }

    await prisma.stock.delete({ where: { id } });

    return res.json({
      message: 'Stock deleted',
      data: { id },
    });
  } catch (error) {
    console.error('deleteStock error:', error);
    return res.status(500).json({
      message: 'Failed to delete stock',
      code: 'STOCK_DELETE_ERROR',
    });
  }
};
