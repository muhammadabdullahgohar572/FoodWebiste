"use client";
import { useEffect, useState } from "react";

const CardData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setData(JSON.parse(cartData));
    }
  }, []);

  const removeItem = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    localStorage.setItem("cart", JSON.stringify(newData));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const newData = [...data];
    newData[index].quantity = newQuantity;
    setData(newData);
    localStorage.setItem("cart", JSON.stringify(newData));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateTotal = () => {
    return data.reduce((total, item) => {
      return total + (item.food.price * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>
      
      {data.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <img 
                  src={item.food.imagePath} 
                  alt={item.food.name} 
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.food.name}</h2>
                <p className="text-gray-600 mb-2">{item.food.description}</p>
                <p className="text-lg font-medium">${item.food.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded">
                  <button 
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold">${(item.food.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Total:</h3>
              <p className="text-xl font-bold">${calculateTotal()}</p>
            </div>
            
            <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardData;