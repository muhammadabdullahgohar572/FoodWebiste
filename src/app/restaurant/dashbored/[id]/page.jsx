"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";

const EditAddFoodItems = ({ id: propId }) => {
  const router = useRouter();
  const params = useParams();

  const id = propId || params?.id;
  console.log("Editing food item with ID:", id);

  const [formData, setFormData] = useState({
    foodName: "",
    price: "",
    imagePath: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.foodName.trim()) newErrors.foodName = "Food name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (isNaN(formData.price)) newErrors.price = "Price must be a number";
    if (formData.price <= 0) newErrors.price = "Price must be positive";
    if (!formData.imagePath.trim())
      newErrors.imagePath = "Image path is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchFoodItem = async () => {
    try {
      if (!id) {
        throw new Error("No food item ID provided");
      }

      const response = await fetch(`/api/Foods/edit/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch food item");
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error("Invalid food item data received");
      }

      console.log(result);

      setFormData({
        foodName: result.data.foodName,
        price: result.data.price,
        imagePath: result.data.imagePath,
        description: result.data.description,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message);
      router.push("/restaurant/dashbored");
    } finally {
      setIsLoading(false);
    }
  };


  console.log(setFormData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("restaurantUser"));
      if (!user?._id) {
        throw new Error("No restaurant user found");
      }

      const payload = {
        ...formData,
        res_id: user._id,
      };

      const response = await fetch(
        id ? `/api/Foods/edit/${id}` : "/api/Foods",
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || id
            ? "Failed to update food item"
            : "Failed to create food item"
        );
      }

      toast.success(
        data.message ||
          (id
            ? "Food item updated successfully!"
            : "Food item created successfully!"),
        {
          position: "top-center",
          autoClose: 3000,
          transition: Bounce,
        }
      );

      setTimeout(() => {
        router.push("/restaurant/dashbored");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.message ||
          (id ? "Error updating food item" : "Error creating food item")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(async () => {
    
    if (id) {
      fetchFoodItem();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3">Loading food item details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Edit Food Item" : "Add New Food Item"}
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Food Name */}
        <div className="mb-4">
          <label htmlFor="foodName" className="block text-gray-700 mb-2">
            Food Name *
          </label>
          <input
            type="text"
            id="foodName"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.foodName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter food name"
            disabled={isSubmitting}
          />
          {errors.foodName && (
            <p className="text-red-500 text-sm mt-1">{errors.foodName}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter price"
            step="0.01"
            min="0"
            disabled={isSubmitting}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="imagePath" className="block text-gray-700 mb-2">
            Image URL *
          </label>
          <input
            type="text"
            id="imagePath"
            name="imagePath"
            value={formData.imagePath}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.imagePath ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter image URL"
            disabled={isSubmitting}
          />
          {errors.imagePath && (
            <p className="text-red-500 text-sm mt-1">{errors.imagePath}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter food description"
            disabled={isSubmitting}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {id ? "Updating..." : "Saving..."}
              </span>
            ) : (
              <span>{id ? "Update Food Item" : "Save Food Item"}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/restaurant/dashbored")}
            disabled={isSubmitting}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditAddFoodItems;
