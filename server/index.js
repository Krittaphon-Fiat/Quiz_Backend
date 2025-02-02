const express = require('express')
const mongoose = require('mongoose')
const cors =require('cors')
const ProductModel = require('./models/Product')
const multer = require('multer')
const path = require('path');
const Cart = require('./models/Cart')
require('dotenv').config()
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads') 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))  
    }
})

const upload = multer({ storage: storage })

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dbURI = process.env.MONGO;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'API for managing products and cart operations'
    },
    servers: [
      {
        url: 'http://localhost:3001'
      }
    ]
  },
  apis: ['index.js'] // Path to the file containing API documentation
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     description: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 */

app.get('/', (req, res) => {
    ProductModel.find()
    .then(products => res.json(products))
    .catch(err => res.json(err))
})

/**
 * @swagger
 * /getProduct/{id}:
 *   get:
 *     description: Get product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */

app.get('/getProduct/:id' , (req,res) => {
    const id = req.params.id;
    ProductModel.findById({_id:id})
    .then(products => res.json(products))
    .catch(err => res.json(err))
})

/**
 * @swagger
 * /updateProduct/{id}:
 *   put:
 *     description: Update a product
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *       - name: productImg
 *         in: formData
 *         type: file
 *       - name: name
 *         in: body
 *         required: true
 *         description: Product name
 *       - name: price
 *         in: body
 *         required: true
 *         description: Product price
 *       - name: desc
 *         in: body
 *         required: true
 *         description: Product description
 *     responses:
 *       200:
 *         description: Product updated
 */

app.put("/updateProduct/:id", upload.single('productImg'), (req, res) => {
    const id = req.params.id;
    const { name, price, desc } = req.body;
    const updateData = { name, price, desc };

    if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
    }

    ProductModel.findByIdAndUpdate(id, updateData, { new: true })
        .then(product => res.json(product))
        .catch(err => res.json(err));
});

/**
 * @swagger
 * /deleteProduct/{id}:
 *   delete:
 *     description: Delete a product
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */

app.delete('/deleteProduct/:id', (req, res) =>{
    const id = req.params.id;
    ProductModel.findByIdAndDelete({_id: id}) 
    .then(result => res.json({ message: "Deleted Successfully", result }))
    .catch(err => res.json(err))
})

/**
 * @swagger
 * /createProduct:
 *   post:
 *     description: Create a new product
 *     parameters:
 *       - name: productImg
 *         in: formData
 *         type: file
 *       - name: name
 *         in: body
 *         required: true
 *         description: Product name
 *       - name: price
 *         in: body
 *         required: true
 *         description: Product price
 *       - name: desc
 *         in: body
 *         required: true
 *         description: Product description
 *     responses:
 *       201:
 *         description: Product created
 */

app.post("/createProduct", upload.single('productImg'), (req, res) => {
    const newProduct = new ProductModel({
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        image: req.file ? `/uploads/${req.file.filename}` : null 
    })

    newProduct.save()
        .then(product => res.json(product))
        .catch(err => res.json(err))
})

/**
 * @swagger
 * /addToCart:
 *   post:
 *     description: Add a product to the cart
 *     parameters:
 *       - name: userId
 *         in: body
 *         required: true
 *         description: User ID
 *       - name: productId
 *         in: body
 *         required: true
 *         description: Product ID
 *       - name: quantity
 *         in: body
 *         required: true
 *         description: Quantity of the product
 *       - name: price
 *         in: body
 *         required: true
 *         description: Price of the product
 *       - name: image
 *         in: body
 *         required: true
 *         description: Product image URL
 *       - name: name
 *         in: body
 *         required: true
 *         description: Product name
 *     responses:
 *       200:
 *         description: Product added to cart
 */

app.post('/addToCart', async (req, res) => {
    const { userId, productId, quantity, price, image, name } = req.body;
  
    try {
 
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({
          userId,
          products: [{
            productId,
            quantity,
            price,
            image,
            name
          }]
        });
      } else {
        const existingProductIndex = cart.products.findIndex(item => item.productId === productId);
  
        if (existingProductIndex >= 0) {
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          cart.products.push({
            productId,
            quantity,
            price,
            image,
            name
          });
        }
      }
  
      await cart.save();
      res.status(200).json({ message: 'Product added to cart', cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

/**
 * @swagger
 * /getCart:
 *   get:
 *     description: Get all carts
 *     responses:
 *       200:
 *         description: A list of all carts
 */

  app.get('/getCart', (req, res) => {
    Cart.find()  
        .then(cartData => {
            res.json({ data: cartData });  
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error fetching cart data', error: err });
        });
});

/**
 * @swagger
 * /clearAllCarts:
 *   delete:
 *     description: Clear all carts
 *     responses:
 *       200:
 *         description: All carts cleared successfully
 *       500:
 *         description: Error clearing all carts
 */

app.delete('/clearAllCarts', (req, res) => {
    Cart.deleteMany()  
      .then(() => {
        res.json({ message: 'All carts cleared successfully!' });
      })
      .catch((err) => {
        res.status(500).json({ error: 'Error clearing all carts', err });
      });
  });

  /**
 * @swagger
 * /products:
 *   get:
 *     description: Get paginated products
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination (default: 1)
 *         required: false
 *         type: integer
 *       - name: limit
 *         in: query
 *         description: Number of products per page (default: 6)
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: A list of products
 */


  app.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const totalCount = await ProductModel.countDocuments();
        const products = await ProductModel.find().skip(skip).limit(limit);

        res.json({ products, totalCount });
    } catch (error) {
        res.status(500).json({ error: "Error fetching products", error });
    }
});

/**
 * @swagger
 * /getCartWithTotal:
 *   get:
 *     description: Get cart data with total value and discounts
 *     responses:
 *       200:
 *         description: Cart data with total value and discount applied
 *       500:
 *         description: Error fetching cart data
 */

app.get('/getCartWithTotal', async (req, res) => {
  try {
      const carts = await Cart.find();

      const calculateTotal = (cart) => {
          let productMap = {};
          let totalPriceBeforeDiscount = 0;
          let totalDiscount = 0;
          let total = 0;

          cart.products.forEach((product) => {
              if (!productMap[product.productId]) {
                  productMap[product.productId] = { product, quantity: product.quantity };
              }
          });

          let uniqueProducts = Object.values(productMap);
          
          totalPriceBeforeDiscount = uniqueProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

          let discountRates = { 2: 0.1, 3: 0.2, 4: 0.3, 5: 0.4, 6: 0.5, 7: 0.6 };
          
          while (uniqueProducts.some(item => item.quantity > 0)) {
              let discountGroup = uniqueProducts.filter(item => item.quantity > 0).slice(0, 7); 
              let groupSize = discountGroup.length;
              let discount = discountRates[groupSize] || 0;

              let groupPrice = discountGroup.reduce((sum, item) => sum + item.product.price, 0);
              let discountAmount = groupPrice * discount;

              totalDiscount += discountAmount;
              total += groupPrice - discountAmount;

              discountGroup.forEach(item => item.quantity -= 1);
          }

          return {
              totalPriceBeforeDiscount: totalPriceBeforeDiscount.toFixed(2),
              totalDiscount: totalDiscount.toFixed(2),
              totalPriceAfterDiscount: (totalPriceBeforeDiscount - totalDiscount).toFixed(2),
          };
      };

      const updatedCarts = carts.map(cart => ({
          ...cart.toObject(),
          total: calculateTotal(cart)
      }));

      res.json({ success: true, data: updatedCarts });
  } catch (error) {
      console.error("Error fetching cart data:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

  
app.listen(3001, () => {
    console.log("Server is Running.")
})