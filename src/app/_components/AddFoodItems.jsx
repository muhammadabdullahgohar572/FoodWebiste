"use client";
import { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddFoodItems = () => {
  const [formData, setFormData] = useState({
    foodName: "",
    price: "",
    imagePath: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.foodName.trim()) newErrors.foodName = "Food name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a positive number";
    if (!formData.imagePath.trim())
      newErrors.imagePath = "Image path is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage("");

  if (validateForm()) {
    setIsSubmitting(true);
    try {
      const Idget = JSON.parse(localStorage.getItem("restaurantUser"));
      const res_id = Idget._id;
      
      const response = await fetch("http://localhost:3000/api/Foods/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodName: formData.foodName,
          price: formData.price,
          imagePath: formData.imagePath,
          description: formData.description,
          res_id: res_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add food item');
      }

      const result = await response.json();
      
      toast.success(result.message || "Food item added successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      setFormData({
        foodName: "",
        price: "",
        imagePath: "",
        description: "",
      });
    } catch (error) {
      toast.error(error.message || "Error adding food item");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
};

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Food Item</h1>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="foodName" className="block text-gray-700 mb-2">
            Food Name
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
          />
          {errors.foodName && (
            <p className="text-red-500 text-sm mt-1">{errors.foodName}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 mb-2">
            Price ($)
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
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="imagePath" className="block text-gray-700 mb-2">
            Image URL
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
          />
          {errors.imagePath && (
            <p className="text-red-500 text-sm mt-1">{errors.imagePath}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description
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
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Food Item"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddFoodItems;
