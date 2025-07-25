"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFoodItemsShow = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    foodName: "",
    price: "",
    imagePath: "",
    description: ""
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
      // Show confirmation dialog
      const confirmDelete = window.confirm("Are you sure you want to delete this item?");
      if (!confirmDelete) return;

      const response = await fetch(`/api/Foods/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast.success("Item deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      fetchData(); // Refresh the list
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setEditForm({
      foodName: item.foodName,
      price: item.price,
      imagePath: item.imagePath,
      description: item.description
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/Foods/${editingItem}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      toast.success("Item updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      setEditingItem(null);
      fetchData(); // Refresh the list
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center py-8">Loading menu items...</div>;
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
                {editingItem === item._id ? (
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <input
                      type="text"
                      name="foodName"
                      value={editForm.foodName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      name="price"
                      value={editForm.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      name="imagePath"
                      value={editForm.imagePath}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <div className="flex space-x-2">
                      <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
                        Save
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingItem(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold">{item.foodName}</h2>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                    <div className="mt-4 flex space-x-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddFoodItemsShow;