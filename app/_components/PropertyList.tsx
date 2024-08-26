"use client";
import React, { useEffect, useReducer } from "react";
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

interface State {
  properties: Property[];
  filteredProperties: Property[];
  error: string | null;
  loading: boolean;
  selectedCity: string;
  selectedPriceRange: { min: number; max: number } | null;
  currentPage: number;
}

const initialState: State = {
  properties: [],
  filteredProperties: [],
  error: null,
  loading: true,
  selectedCity: "",
  selectedPriceRange: null,
  currentPage: 1,
};

type Action =
  | { type: "SET_PROPERTIES"; payload: Property[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CITY"; payload: string }
  | { type: "SET_PRICE_RANGE"; payload: { min: number; max: number } | null }
  | { type: "SET_CURRENT_PAGE"; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PROPERTIES":
      return { ...state, properties: action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CITY":
      return { ...state, selectedCity: action.payload, currentPage: 1 };
    case "SET_PRICE_RANGE":
      return { ...state, selectedPriceRange: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}

const PropertyList: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchProperties = async (retryCount = 3, delay = 1000) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch("/api/PropertyListings");
        const responseText = await response.text();
        if (!response.ok) {
          let errorMessage = "Failed to fetch properties";
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (jsonError) {
            errorMessage += ": " + responseText;
          }
          throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        if (Array.isArray(data.data)) {
          dispatch({ type: "SET_PROPERTIES", payload: data.data });
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes("FUNCTION_INVOCATION_TIMEOUT") &&
            retryCount > 0
          ) {
            console.warn("Retrying fetch due to timeout...");
            setTimeout(() => fetchProperties(retryCount - 1, delay * 2), delay);
          } else {
            dispatch({ type: "SET_ERROR", payload: error.message });
          }
        } else {
          dispatch({ type: "SET_ERROR", payload: "An unknown error occurred" });
        }
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = state.properties;

      if (state.selectedCity) {
        filtered = filtered.filter(
          (property) => property.location === state.selectedCity
        );
      }

      if (state.selectedPriceRange) {
        filtered = filtered.filter(
          (property) =>
            property.price >= state.selectedPriceRange!.min &&
            property.price <= state.selectedPriceRange!.max
        );
      }

      dispatch({ type: "SET_PROPERTIES", payload: filtered });
    };

    applyFilters();
  }, [state.properties, state.selectedCity, state.selectedPriceRange]);

  const paginatedProperties = state.filteredProperties.slice(
    (state.currentPage - 1) * ITEMS_PER_PAGE,
    state.currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(state.filteredProperties.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {state.loading ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin relative">
            <div className="absolute inset-0 border-4 border-t-4 border-transparent border-r-blue-600 border-solid rounded-full"></div>
          </div>
        </div>
      ) : state.error ? (
        <p className="text-center text-red-600 font-semibold">{state.error}</p>
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
            <div className="flex items-center space-x-4">
              <label
                htmlFor="city"
                className="text-lg font-medium text-gray-800"
              >
                City:
              </label>
              <select
                id="city"
                value={state.selectedCity}
                onChange={(e) =>
                  dispatch({ type: "SET_CITY", payload: e.target.value })
                }
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
                  state.selectedPriceRange
                    ? `${state.selectedPriceRange.min}-${state.selectedPriceRange.max}`
                    : ""
                }
                onChange={(e) => {
                  const [min, max] = e.target.value
                    .split("-")
                    .map(Number) as [number, number];
                  dispatch({
                    type: "SET_PRICE_RANGE",
                    payload: min !== undefined && max !== undefined ? { min, max } : null,
                  });
                }}
                className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prices</option>
                {PRICE_RANGES.map((range) => (
                  <option
                    key={range.label}
                    value={`${range.min}-${range.max}`}
                  >
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-5">
            {paginatedProperties.map((property) => (
              <Link key={property._id} href={`/property/${property._id}`}>
                <CardContainer className="h-72">
                  <CardBody>
                    <CardItem>
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="object-cover w-full h-40 rounded-lg mb-2"
                      />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {property.title}
                      </h3>
                      <p className="text-gray-700">
                        {property.location}
                      </p>
                      <p className="text-blue-500 font-semibold">
                        ₹{property.price} per night
                      </p>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => dispatch({ type: "SET_CURRENT_PAGE", payload: index + 1 })}
                  className={`px-4 py-2 rounded-lg ${
                    state.currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
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
