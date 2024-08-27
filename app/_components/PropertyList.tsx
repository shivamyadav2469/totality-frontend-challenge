"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Carousel from "./Carousel";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";

interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  amenities: string[];
  images: string[];
}

const CITIES = [
  "Goa, India",
  "Bangalore, India",
  "Jaipur, India",
  "Kochi, India",
  "Delhi, India",
  "Rishikesh, India",
  "Hyderabad, India",
  "Pune, India",
];

const PRICE_RANGES = [
  { label: "Up to ₹100", min: 0, max: 100 },
  { label: "₹100 to ₹200", min: 100, max: 200 },
  { label: "₹200 to ₹300", min: 200, max: 300 },
  { label: "₹300 to ₹400", min: 300, max: 400 },
  { label: "₹400 to ₹500", min: 400, max: 500 },
  { label: "₹500 to ₹1000", min: 500, max: 1000 },
];

const ITEMS_PER_PAGE = 6;

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
  // Example of optimizing a slow API call with async/await
  const fetchProperties = async (retries = 3) => {
    setLoading(true);
    try {
      const response = await fetch("/api/PropertyListings");
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch properties");
      }
  
      const data = await response.json();
  
      if (Array.isArray(data.data)) {
        setProperties(data.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      if (retries > 0) {
        // Retry the request
        setTimeout(() => fetchProperties(retries - 1), 2000); // Retry after 2 seconds
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  
  

    fetchProperties();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = properties;

      if (selectedCity) {
        filtered = filtered.filter(
          (property) => property.location === selectedCity
        );
      }

      if (selectedPriceRange) {
        filtered = filtered.filter(
          (property) =>
            property.price >= selectedPriceRange.min &&
            property.price <= selectedPriceRange.max
        );
      }

      setFilteredProperties(filtered);
      setCurrentPage(1);
    };

    applyFilters();
  }, [properties, selectedCity, selectedPriceRange]);

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Property Listings
      </h1> */}

      {loading ? (
       <div className="flex justify-center items-center min-h-screen bg-gray-100">
       <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin relative">
         <div className="absolute inset-0 border-4 border-t-4 border-transparent border-r-blue-600 border-solid rounded-full"></div>
       </div>
     </div>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      ) : (
        <>
          <Carousel />
          <div className="flex justify-center items-center mt-5 sm:mt-2">
            <div className="text-center">
              <h2 className="font-bold text-xl md:text-2xl lg:text-3xl mb-2 md:mb-4 lg:mb-6">
                Find Your Ideal Rental Property with Totallity Rentals
              </h2>
              <p className="text-sm mb-3">
                Discover unique rental options! From charming cabins nestled in
                the woods to elegant villas with private pools, Totallity
                Rentals has something for everyone.
                <p> Begin your search for the perfect property today!</p>
              </p>
            </div>
          </div>

          <div className="mb-8 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 mt-2">
            {/* City Selector */}
            <div className="flex items-center space-x-4">
              <label
                htmlFor="city"
                className="text-lg font-medium text-gray-800"
              >
                City:
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Cities</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Selector */}
            <div className="flex items-center space-x-4">
              <label
                htmlFor="price-range"
                className="text-lg font-medium text-gray-800"
              >
                Price Range:
              </label>
              <select
                id="price-range"
                value={
                  selectedPriceRange
                    ? `${selectedPriceRange.min}-${selectedPriceRange.max}`
                    : ""
                }
                onChange={(e) => {
                  const [min, max] = e.target.value.split("-").map(Number);
                  setSelectedPriceRange(min && max ? { min, max } : null);
                }}
                className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prices</option>
                {PRICE_RANGES.map((range) => (
                  <option key={range.label} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProperties.length > 0 ? (
              paginatedProperties.map((property) => (
                <CardContainer className="inter-var" key={property._id}>
                  <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto  h-auto rounded-xl p-6 border">
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      {property.title}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      {property.description}
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <img
                        src={
                          property.images[0] ||
                          "https://via.placeholder.com/300x200"
                        }
                        alt={property.title}
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      />
                    </CardItem>
                    <div className="mt-4">
                      <p className="text-gray-800 font-medium">
                        <strong>Location:</strong> {property.location}
                      </p>
                      <p className="text-gray-800 font-medium">
                        <strong>Price:</strong> ₹
                        {property.price.toLocaleString()}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-6 cursor-pointer">
                      <Link href={`/properties/${property._id}`}>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:outline-1"
                      >
                        Book Now →
                      </button>
                    </Link>
                      </div>
                    </div>
                  </CardBody>
                </CardContainer>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No properties available.
              </p>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <nav aria-label="Page navigation">
              <ul className="flex space-x-2">
                <li>
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.max(page - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600"
                      } hover:bg-blue-700 hover:text-white`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.min(page + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyList;
