"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddFoodItemsShow = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    foodName: "",
    price: "",
    imagePath: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("restaurantUser"));
      if (!user?._id) {
        throw new Error("No restaurant user found in localStorage");
      }

      const response = await fetch(`/api/Foods/${user._id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch food items");
      }

      const data = await response.json();
      setFoodItems(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (!confirmDelete) return;

      const response = await fetch(`/api/Foods/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast.success("Item deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });

      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditClick = (item) => {
    router.push(`../restaurant/dashbored/${item._id}`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>

      {foodItems.length === 0 ? (
        <p className="text-center">No menu items available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.imagePath || "/images/food-placeholder.jpg"}
                  alt={item.foodName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/food-placeholder.jpg";
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
                <div className="mt-4 flex space-x-2">
                  <Link href={`../restaurant/dashbored/${item._id}`}>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddFoodItemsShow;
