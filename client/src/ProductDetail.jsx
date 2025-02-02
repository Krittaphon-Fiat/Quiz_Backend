import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1); 

  useEffect(() => {
    axios.get(`http://localhost:3001/getProduct/${id}`)
      .then((result) => {
        setProduct(result.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  const addToCart = () => {
    const userId = 'someUserId';

    axios.post('http://localhost:3001/addToCart', {
      userId,
      productId: product._id,
      quantity,
      price: product.price,
      image: product.image,
      name: product.name,
    })
      .then(res => {
        alert("Product added to cart!");
        setIsAdded(true);
      })
      .catch(err => console.log('Error adding product to cart:', err));
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-75 bg-white rounded p-4 shadow-lg">
        <h2 className="text-center mb-4">{product.name}</h2>
        <div className="d-flex justify-content-center mb-4">
          <img
            src={`http://localhost:3001${product.image}`}
            alt={product.name}
            style={{
              height: '300px',
              width: 'auto',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>
        <div className="mb-3">
          <p><strong>Price:</strong> <span className="text-success">${product.price}</span></p>
          <p><strong>Description:</strong> {product.desc}</p>
        </div>

        <div className="d-flex align-items-center mb-3">
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
            disabled={quantity === 1}
          > - </button>
          
          <span className="mx-3">{quantity}</span>
          
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => setQuantity(prev => prev + 1)}
          > + </button>
        </div>

        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-primary" 
            onClick={addToCart} 
            disabled={isAdded}
          >
            {isAdded ? "Added to Cart" : "Add to Cart"}
          </button>
          <Link className="btn btn-secondary" to="/">
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
