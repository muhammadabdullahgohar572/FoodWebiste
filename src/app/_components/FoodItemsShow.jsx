"use client";
import { useEffect, useState } from "react";

const AddFoodItemsShow = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("restaurantUser"));
        if (!user?._id) {
          throw new Error("No restaurant user found in localStorage");
        }

        console.log("Fetching data for restaurant ID:", user._id);
        
        const response = await fetch(`http://localhost:3000/api/Foods/${user._id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.message || "Failed to fetch food items");
        }

        const data = await response.json();
        console.log("Received data:", data);
        setFoodItems(data);
        
      } catch (err) {
        console.error("Full fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading menu items...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>
      
      {foodItems.length === 0 ? (
        <p className="text-center">No menu items available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.imagePath} 
                  alt={item.foodName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/food-placeholder.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{item.foodName}</h2>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                    ${item.price}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddFoodItemsShow;