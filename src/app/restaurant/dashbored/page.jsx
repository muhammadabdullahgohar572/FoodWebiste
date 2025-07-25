"use client";
import AddFoodItems from "@/app/_components/AddFoodItems";
import AddFoodItemsShow from "@/app/_components/FoodItemsShow";
import { useState } from "react";

const Dashboard = () => {
  const [showAddItem, setShowAddItem] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowAddItem(true)}
          className={`px-4 py-2 rounded-lg font-medium ${
            showAddItem
              ? "bg-gray-200 text-gray-700"
              : "bg-orange-500 text-white hover:bg-orange-600"
          } transition-colors`}
        >
          Add Food
        </button>
        <button
          onClick={() => setShowAddItem(false)}
          className={`px-4 py-2 rounded-lg font-medium ${
            !showAddItem
              ? "bg-gray-200 text-gray-700"
              : "bg-orange-500 text-white hover:bg-orange-600"
          } transition-colors`}
        >
          Dashboard
        </button>
      </div>

      {showAddItem ? (
        <AddFoodItems />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Dashboard
          </h1>
         <AddFoodItemsShow/>
          {/* You can add dashboard content here */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;