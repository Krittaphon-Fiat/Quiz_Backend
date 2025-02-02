import { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/getCartWithTotal')
      .then((response) => {
        setCartData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error);
        setLoading(false);
      });
  }, []);

  const handleCheckout = () => {
    const userId = 'someUserId';

    axios.delete('http://localhost:3001/clearAllCarts', { data: { userId } })
      .then((response) => {
        console.log(response.data.message);
        setCartData([]);
      })
      .catch((error) => {
        console.error('Error clearing cart:', error);
      });
  };

  if (loading) return <div className="text-center mt-10 text-2xl">Loading...</div>;

  if (cartData.length === 0) return <div className="text-center mt-10 text-xl">Your cart is empty.</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Your Shopping Cart</h1>

      {cartData.map((cart) => (
        <div key={cart._id} className="bg-white shadow-xl rounded-lg p-8 mb-8">
          <div className="space-y-6">
            {cart.products.map((product) => (
              <div key={product._id} className="flex items-center justify-between border-b pb-6 mb-6">
                <div className="flex items-center">
                  <img
                    src={`http://localhost:3001${product.image}`}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-700">{product.name}</h3>
                    <p className="text-gray-500">Price: ${product.price}</p>
                    <p className="text-gray-500">Quantity: {product.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-gray-800">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <div className="font-semibold text-lg text-gray-800">
              <p>Price Before Discount: ${cart.total.totalPriceBeforeDiscount}</p>
              <p>Discount: -${cart.total.totalDiscount}</p>
              <p>Total After Discount: ${cart.total.totalPriceAfterDiscount}</p>
            </div>

            <button 
              onClick={handleCheckout}
              className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
