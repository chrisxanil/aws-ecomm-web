import { db } from '../database/db.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice, featured } = req.query;
    const products = await db.getProducts({ category, search, sort, minPrice, maxPrice, featured });

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
};

export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (!isNaN(idOrSlug)) {
      product = await db.getProductById(idOrSlug);
    } else {
      product = await db.getProductBySlug(idOrSlug);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const reviews = await db.getReviewsByProductId(product.id);

    return res.json({
      success: true,
      product: {
        ...product,
        reviews
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, category_id, category_name, price, original_price, stock, description, image_url, badge, is_featured, features } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and description are required.'
      });
    }

    const defaultImg = 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80';
    const newProduct = await db.createProduct({
      name,
      category_id: category_id || 1,
      category_name: category_name || 'Neural Processors & TPUs',
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : null,
      stock: parseInt(stock || 25, 10),
      description,
      image_url: image_url || defaultImg,
      badge: badge || null,
      is_featured: Boolean(is_featured),
      features: features || {}
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await db.updateProduct(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await db.deleteProduct(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or already removed.'
      });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await db.getCategories();
    return res.json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
};

export const addProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required.'
      });
    }

    const review = await db.createReview({
      productId: id,
      userId: req.user.id,
      userName: req.user.name,
      rating: parseInt(rating, 10),
      comment
    });

    return res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      review
    });
  } catch (err) {
    next(err);
  }
};

