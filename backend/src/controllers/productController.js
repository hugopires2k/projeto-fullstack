const Product = require('../models/Product');

async function createProduct(req, res) {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'Name, description, price e category são obrigatórios.' });
    }

    const product = await Product.create({ name, description, price, category, stock });

    return res.status(201).json({
      message: 'Produto criado com sucesso.',
      product
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar produto.', error: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar produtos.', error: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar produto.', error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { name, description, price, category, stock, active } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    product.active = active ?? product.active;

    await product.save();

    return res.status(200).json({ message: 'Produto atualizado com sucesso.', product });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar produto.', error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    return res.status(200).json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover produto.', error: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
