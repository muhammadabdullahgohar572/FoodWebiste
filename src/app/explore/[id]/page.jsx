"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const FoodItemDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/coutromer/${id}`);
        const data = await response.json();

        if (data.success) {
          setRestaurant(data.restaurant);
          setFoodItems(data.foods);
        } else {
          setError(data.error || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="mb-4 inline-block text-orange-600 hover:underline"
        >
          &larr; Back to restaurants
        </Link>

        {/* Restaurant Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {restaurant.restaurantName}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Contact Information
              </h2>
              <p className="text-gray-700">
                <span className="font-medium">Address:</span>{" "}
                {restaurant.location}, {restaurant.city}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span>{" "}
                {restaurant.contactNo}
              </p>
              {restaurant.email && (
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {restaurant.email}
                </p>
              )}
            </div>
          </div>

          {restaurant.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700">{restaurant.description}</p>
            </div>
          )}
        </div>

        {/* Food Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>

          {foodItems.length === 0 ? (
            <p className="text-gray-600">No food items available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodItems.map((food) => (
                <div
                  key={food._id}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{food.name}</h3>
                      <p className="text-gray-600 mt-1">{food.description}</p>
                    </div>
                    <span className="text-orange-600 font-medium">
                      ${food.price}
                    </span>
                  </div>
                  {food.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                      {food.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemDetails;
