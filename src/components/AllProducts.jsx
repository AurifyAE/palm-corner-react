import React, { useState, useEffect } from "react";
import { getAllProducts } from "../api/api";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  title,
  colors,
  price,
  stock,
  description,
  _id,
  category,
  sku,
}) => {
  const navigate = useNavigate();

  // Get default color and its images
  const defaultColor = colors?.find((color) => color.isDefault) || colors?.[0];
  const defaultImage =
    defaultColor?.images?.find((img) => img.isDefault) ||
    defaultColor?.images?.[0];

  // Handle product click to navigate to product details page
  const handleProductClick = () => {
    navigate(`/product-details/${_id}`);
  };

  return (
    <div className="relative mb-8 sm:mb-10 md:mb-12 w-full">
      <div
        className="bg-white p-3 sm:p-4 flex items-center justify-center h-64 max-sm:h-52 md:h-80 w-full rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleProductClick}
      >
        <img
          src={defaultImage?.url}
          alt={title}
          className="max-h-40 sm:max-h-48 md:max-h-52 object-contain"
        />
      </div>
      <div
        className="mt-2"
        onClick={handleProductClick}
        style={{ cursor: "pointer" }}
      >
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
          {title}
        </h3>
        {colors && colors.length > 0 && (
          <div
            className="flex mt-1 space-x-2 flex-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full cursor-pointer mb-1 border-1 border-gray-300"
                style={{ backgroundColor: color.hexCode }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AllProducts = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({});

  // Prepare search parameters when filters change
  useEffect(() => {
    const newParams = {};

    // Handle search term
    if (filters?.search) {
      newParams.search = filters.search;
    }

    // Handle availability filter
    if (filters?.availability) {
      if (filters.availability === "inStock") {
        newParams.stock = true;
      } else if (filters.availability === "outOfStock") {
        newParams.stock = false;
      }
    }

    // Handle price filters
    if (filters?.price?.min) {
      newParams.minPrice = filters.price.min;
    }

    if (filters?.price?.max) {
      newParams.maxPrice = filters.price.max;
    }

    // Fix: Handle category filter - adapt based on what API expects
    if (filters?.categories && filters.categories !== "all") {
      // Try with categoryId first (most likely what the API expects)
      newParams.categoryId = filters.categories;

      // Alternative parameter names - uncomment if needed based on API
      // newParams.category = filters.categories;  // Or just "category"
      // newParams.category_id = filters.categories;  // Or with underscore
    }

    // Handle color filter
    if (filters?.color && filters.color !== "" && filters.color !== "all") {
      newParams.color = filters.color;
    }

    console.log("Applied filters:", filters);
    console.log("Search params for API:", newParams);

    setSearchParams(newParams);
    setCurrentPage(1); // Reset to first page on filter change
  }, [filters]);

  // Fetch products when page, limit, or search params change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, productsPerPage, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Initialize API parameters with pagination values
      const apiParams = {
        page: currentPage,
        limit: productsPerPage,
        ...searchParams,
        search: searchParams.search,
      };

      console.log("Sending API request with params:", apiParams);

      const response = await getAllProducts(apiParams);
      console.log("API response:", response);

      // Check the structure of the response and extract products correctly
      let productData = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        productData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        productData = response.data;
      }

      setProducts(productData);

      // Set total products from pagination info if available
      let total = 0;
      if (response?.pagination?.total) {
        total = response.pagination.total;
      } else if (response?.data?.pagination?.total) {
        total = response.data.pagination.total;
      } else {
        // If no pagination info, estimate based on whether we got a full page
        total =
          productData.length < productsPerPage
            ? (currentPage - 1) * productsPerPage + productData.length
            : currentPage * productsPerPage + 1; // At least one more page
      }

      setTotalProducts(total);

      // Calculate and set total pages
      const pages = Math.ceil(total / productsPerPage);
      setTotalPages(pages > 0 ? pages : 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleProductsPerPageChange = (value) => {
    setProductsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate pagination indicators
  const startIndex =
    products.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0;
  const endIndex = products.length > 0 ? startIndex + products.length - 1 : 0;

  return (
    <div className="w-full px-4 max-sm:px-0 lg:px-8 mx-auto max-w-full sm:max-w-[10%] md:max-w-[85%] lg:max-w-[80%]">
      <div className="flex flex-wrap gap-3 sm:gap-6 items-center border-[#E6E6E6] border-b-2 pb-4">
        <h2 className="text-lg sm:text-xl font-bold">All Collection</h2>
        <div className="bg-[rgba(236,135,15,0.1)] rounded-xl px-3 sm:px-4 py-1">
          <h2 className="text-[#EC870F] font-semibold text-xs sm:text-sm">
            {totalProducts > 1
              ? `${totalProducts} Products`
              : `${totalProducts} Product`}
          </h2>
        </div>
        {filters.search && (
          <div className="bg-[rgba(0,105,180,0.1)] rounded-xl px-3 sm:px-4 py-1">
            <h2 className="text-[#0069B4] font-semibold text-xs sm:text-sm">
              Search: "{filters.search}"
            </h2>
          </div>
        )}
        {filters.categories && filters.categories !== "all" && (
          <div className="bg-[rgba(0,105,180,0.1)] rounded-xl px-3 sm:px-4 py-1">
            <h2 className="text-[#0069B4] font-semibold text-xs sm:text-sm">
              Category: {filters.categoryName || filters.categories}
            </h2>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#0069B4]"></div>
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            {filters.search
              ? `No results for "${filters.search}". Try a different search term or adjust your filters.`
              : "Try adjusting your filters to find products."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 max-sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-3 gap-y-4 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 mt-6 sm:mt-8 md:mt-12">
          {Array.isArray(products) ? (
            products.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))
          ) : (
            <div className="text-center py-8 sm:py-12 col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Error loading products
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                Product data is not in the expected format.
              </p>
            </div>
          )}
        </div>
      )}

      {products && products.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 mb-4 gap-4">
          <div className="text-xs sm:text-sm text-gray-500">
            Showing {startIndex}-{endIndex} of {totalProducts} products
          </div>

          <div className="flex items-center gap-2">
            {/* Pagination Controls */}
            <button
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center ${
                currentPage > 1
                  ? "border-black cursor-pointer"
                  : "border-[#E6E6E6] cursor-not-allowed"
              }`}
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              <svg
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  currentPage > 1 ? "text-black" : "text-[#E6E6E6]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Page indicator */}
            <div className="text-xs sm:text-sm font-medium">
              {currentPage} of {totalPages}
            </div>

            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-black">Show</span>
              <div className="relative">
                <select
                  className="px-2 sm:px-4 py-1 rounded-md bg-[#0069B4] text-white text-xs sm:text-sm font-semibold appearance-none pr-6 sm:pr-8"
                  value={productsPerPage}
                  onChange={(e) =>
                    handleProductsPerPageChange(Number(e.target.value))
                  }
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={36}>36</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2 text-white">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-black">Per page</span>
            </div>

            <button
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center ${
                currentPage < totalPages
                  ? "border-black cursor-pointer"
                  : "border-[#E6E6E6] cursor-not-allowed"
              }`}
              onClick={() => handlePageChange("next")}
              disabled={currentPage >= totalPages}
            >
              <svg
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  currentPage < totalPages ? "text-black" : "text-[#E6E6E6]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
