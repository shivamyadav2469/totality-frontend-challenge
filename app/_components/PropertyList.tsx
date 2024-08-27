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

  const fetchWithRetry = async (url: string | URL | Request, options: RequestInit | undefined, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            if (i === retries - 1) {
                throw error;
            }
        }
    }
};

useEffect(() => {
  const fetchProperties = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
          const data = await fetchWithRetry("/api/PropertyListings", {
              signal: controller.signal,
          });

          if (Array.isArray(data.data)) {
              setProperties(data.data);
          } else {
              throw new Error("Unexpected response format");
          }
      } catch (error: unknown) {
          const errorMessage =
              error instanceof Error
                  ? error.message
                  : "An unexpected error occurred";
          setError(errorMessage);
      } finally {
          setLoading(false);
          clearTimeout(timeoutId);
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
                      <p className="text-gray-800 font-medium">
                        <strong>Bedrooms:</strong> {property.bedrooms}
                      </p>
                      <p className="text-gray-800 font-medium">
                        <strong>Amenities:</strong>{" "}
                        {property.amenities.join(", ")}
                      </p>
                    </div>
                    <Link
                      href={`/property/${property._id}`}
                      className="inline-block mt-4 text-sm font-medium text-blue-500 hover:underline"
                    >
                      View Details
                    </Link>
                  </CardBody>
                </CardContainer>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No properties found. Please adjust your filters and try again.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 mx-1 text-sm font-medium ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded-lg focus:outline-none hover:bg-blue-400`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyList;
