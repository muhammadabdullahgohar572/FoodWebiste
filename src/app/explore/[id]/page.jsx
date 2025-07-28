"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodItemDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/coutromer/${id}`);
        const data = await response.json();

        if (data.success) {
          setRestaurant(data.restaurant);
          const foodsWithNumericPrices = data.foods.map((food) => ({
            ...food,
            price: Number(food.price),
          }));
          setFoodItems(foodsWithNumericPrices);

          // Initialize quantities with default value 1
          const initialQuantities = {};
          foodsWithNumericPrices.forEach((food) => {
            initialQuantities[food._id] = 1; // Always start with 1
          });
          setQuantities(initialQuantities);
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

  const handleQuantityChange = (foodId, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setQuantities((prev) => ({
        ...prev,
        [foodId]: Math.max(1, numValue), // Ensure minimum quantity is 1
      }));
    }
  };

  const addToCart = (foodItem) => {
    const existingItem = cart.find((item) => item.food._id === foodItem._id);
    const quantity = quantities[foodItem._id] || 1; // Default to 1 if not set

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.food._id === foodItem._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { food: foodItem, quantity }];
    }

    setCart(newCart);
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success(
      existingItem
        ? `Added ${quantity} more ${foodItem.name} to cart!`
        : `${foodItem.name} added to cart!`,
      { position: "top-right", autoClose: 2000 }
    );
  };

  const removeFromCart = (foodId) => {
    const updatedCart = cart.filter((item) => item.food._id !== foodId);
    setCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.info("Item removed from cart", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        return total + item.food.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const isItemInCart = (foodId) => {
    return cart.some((item) => item.food._id === foodId);
  };

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
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-orange-600 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to restaurants
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {restaurant.imagePath && (
                <div className="w-full md:w-1/3">
                  <img
                    src={restaurant.imagePath}
                    alt={restaurant.restaurantName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4">
                  {restaurant.restaurantName}
                </h1>
                <div className="space-y-2">
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
                      <span className="font-medium">Email:</span>{" "}
                      {restaurant.email}
                    </p>
                  )}
                </div>
                {restaurant.description && (
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">About</h2>
                    <p className="text-gray-700">{restaurant.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Menu</h2>

            {foodItems.length === 0 ? (
              <p className="text-gray-600">No food items available</p>
            ) : (
              <div className="space-y-6">
                {foodItems.map((food) => (
                  <div
                    key={food._id}
                    className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 pb-6 last:border-0"
                  >
                    {food.imagePath && (
                      <div className="w-full sm:w-1/4">
                        <img
                          src={food.imagePath}
                          alt={food.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{food.name}</h3>
                          <p className="text-gray-600 mt-1">
                            {food.description}
                          </p>
                        </div>
                        <span className="text-orange-600 font-medium">
                          $
                          {typeof food.price === "number"
                            ? food.price.toFixed(2)
                            : Number(food.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {food.category && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                            {food.category}
                          </span>
                        )}
                        {food.isVeg && (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                            Vegetarian
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                food._id,
                                quantities[food._id] - 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={quantities[food._id] <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantities[food._id]}
                            onChange={(e) =>
                              handleQuantityChange(food._id, e.target.value)
                            }
                            className="w-12 text-center border-x border-gray-300 py-1"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                food._id,
                                quantities[food._id] + 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        {isItemInCart(food._id) ? (
                          <button
                            onClick={() => removeFromCart(food._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                          >
                            Remove from Cart
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(food)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
          <h2 className="text-2xl font-bold mb-6">Your Order</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.food._id}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div>
                      <h3 className="font-medium">{item.food.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × $
                        {typeof item.food.price === "number"
                          ? item.food.price.toFixed(2)
                          : Number(item.food.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.food._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>

                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemDetails;