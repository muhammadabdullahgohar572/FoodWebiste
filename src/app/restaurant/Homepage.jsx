"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiStar, FiClock } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const HomePage = () => {
  // Sample data - replace with your actual API data
  const sampleRestaurants = [
    {
      id: 1,
      name: "Tasty Bites",
      cuisine: "Indian",
      rating: 4.5,
      deliveryTime: "30-45 min",
      image: "/images/restaurant1.jpg",
      location: "Downtown",
    },
    {
      id: 2,
      name: "Burger Palace",
      cuisine: "American",
      rating: 4.2,
      deliveryTime: "20-35 min",
      image: "/images/restaurant2.jpg",
      location: "Midtown",
    },
    {
      id: 3,
      name: "Sushi World",
      cuisine: "Japanese",
      rating: 4.7,
      deliveryTime: "25-40 min",
      image: "/images/restaurant3.jpg",
      location: "Uptown",
    },
    {
      id: 4,
      name: "Pasta Haven",
      cuisine: "Italian",
      rating: 4.3,
      deliveryTime: "35-50 min",
      image: "/images/restaurant4.jpg",
      location: "Downtown",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [filteredRestaurants, setFilteredRestaurants] = useState(sampleRestaurants);
  const [locations, setLocations] = useState(["All"]);
  const [loading, setLoading] = useState(false);

  // In a real app, you would fetch this data from your API
  useEffect(() => {
    // Extract unique locations from restaurants
    const uniqueLocations = ["All", ...new Set(sampleRestaurants.map(r => r.location))];
    setLocations(uniqueLocations);
  }, []);

  // Filter restaurants based on search term and location
  useEffect(() => {
    setLoading(true);
    let results = sampleRestaurants;

    // Filter by location
    if (selectedLocation !== "All") {
      results = results.filter(restaurant => 
        restaurant.location === selectedLocation
      );
    }

    // Filter by search term (name or cuisine)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(term) || 
        restaurant.cuisine.toLowerCase().includes(term)
      );
    }

    setFilteredRestaurants(results);
    setLoading(false);
  }, [searchTerm, selectedLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you might trigger an API call here
    toast.info(`Searching for "${searchTerm}" in ${selectedLocation}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-orange-500 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Discover the best food in your city
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Location Select */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-500" />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Search Input */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for restaurants or cuisines..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-sm transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedLocation === "All" ? "All Restaurants" : `Restaurants in ${selectedLocation}`}
          </h2>
          <p className="text-gray-600">
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? "result" : "results"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

    
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default HomePage;