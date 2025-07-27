"use client";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLocations = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coutromer/Location");
      const json = await res.json();
      setLocations(json);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLocation) params.append("location", selectedLocation);
      if (searchTerm) params.append("restaurantName", searchTerm);

      const res = await fetch(
        `http://localhost:3000/api/coutromer?${params.toString()}`
      );
      const json = await res.json();
      if (json.success) {
        setRestaurants(json.data);
      } else {
        console.error("Error:", json.error);
        setRestaurants([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setRestaurants([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  useEffect(() => {
    fetchLocations();
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-orange-500 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Discover the best food in your city
          </h1>

          <form onSubmit={handleSearch} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Location Dropdown */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="text-gray-500 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.071 4.929a10 10 0 11-14.142 0M12 11v10"
                    />
                  </svg>
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="text-gray-500 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for restaurants or cuisines..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

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
            {selectedLocation
              ? `Restaurants in ${selectedLocation}`
              : "All Restaurants"}
          </h2>
          <p className="text-gray-600">
            {restaurants.length}{" "}
            {restaurants.length === 1 ? "result" : "results"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Restaurant Grid */}
        {!loading && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Link href={`../explore/${restaurant._id}`} passHref>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {restaurant.restaurantName}
                    </h3>
                    <p className="text-gray-700">{restaurant.cuisineType}</p>
                    <p className="text-gray-600">
                      {restaurant.city}, {restaurant.location}
                    </p>
                    <p className="text-gray-600">{restaurant.contactNo}</p>
                    <div className="mt-3 inline-block text-orange-600 hover:underline">
                      View Details
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && restaurants.length === 0 && (
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
    </div>
  );
};

export default HomePage;