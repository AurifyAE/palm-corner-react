import React, { useState, useEffect } from "react";
import { getFilterCounts } from "../api/api";

export default function FiltersSidebar({ onFilterChange, className = "" }) {
  // Filter section expansion state
  const [expandedSections, setExpandedSections] = useState({
    availability: true,
    price: true,
    categories: true,
    color: true,
  });

  // Mobile view state
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Filter values state
  const [filters, setFilters] = useState({
    availability: "all", // 'all' or 'inStock'
    price: { min: "", max: "" },
    categories: "all", // 'all' or specific category ID
    color: "all", // 'all' or specific color name
    search: "", // New search filter
  });
  // Data states
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [stockStatus, setStockStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  // Effect to filter options based on search term
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      // Filter categories based on search term
      const matchedCategories = categories.filter(
        (cat) => cat.id === "all" || cat.name.toLowerCase().includes(term)
      );
      setFilteredCategories(matchedCategories);

      // Filter colors based on search term
      const matchedColors = colors.filter(
        (color) => color.id === "all" || color.name.toLowerCase().includes(term)
      );
      setFilteredColors(matchedColors);

      // Auto-expand sections that have matching items
      if (matchedCategories.length > 1) {
        setExpandedSections((prev) => ({ ...prev, categories: true }));
      }

      if (matchedColors.length > 1) {
        setExpandedSections((prev) => ({ ...prev, color: true }));
      }
    } else {
      // If no search term, show all options
      setFilteredCategories(categories);
      setFilteredColors(colors);
    }
  }, [searchTerm, categories, colors]);

  // Fetch filter data from the unified endpoint
  const fetchFilterData = async () => {
    setLoading(true);
    try {
      const response = await getFilterCounts();
      const {
        categories: apiCategories,
        colors: apiColors,
        stockStatus: apiStockStatus,
      } = response.data.data;

      // Format categories data
      const formattedCategories = [
        {
          id: "all",
          name: "All",
          count: apiCategories.reduce((sum, cat) => sum + cat.count, 0),
        },
        ...(apiCategories || []).map((category) => ({
          id: category.categoryId,
          name: category.categoryName,
          count: category.count,
        })),
      ];

      // console.log(formattedCategories)

      // Format colors data
      const formattedColors = [
        {
          id: "all",
          name: "All",
          color: "",
          count: apiColors.reduce((sum, color) => sum + color.count, 0),
        },
        ...(apiColors || []).map((color) => ({
          id: color.colorName,
          name: color.colorName,
          hexCode: color.hexCode,
          count: color.count,
        })),
      ];

      // Format stock status data
      const inStockCount =
        apiStockStatus.find((status) => status.inStock)?.count || 0;

      setCategories(formattedCategories);
      setColors(formattedColors);
      setFilteredCategories(formattedCategories);
      setFilteredColors(formattedColors);
      setStockStatus([
        {
          id: "all",
          name: "All",
          count: apiStockStatus.reduce((sum, status) => sum + status.count, 0),
        },
        { id: "inStock", name: "In Stock", count: inStockCount },
      ]);
    } catch (error) {
      console.error("Error fetching filter data:", error);
      // Set default values if API fails
      setCategories([{ id: "all", name: "All", count: 0 }]);
      setColors([{ id: "all", name: "All", color: "", count: 0 }]);
      setStockStatus([{ id: "all", name: "All", count: 0 }]);
      setFilteredCategories([{ id: "all", name: "All", count: 0 }]);
      setFilteredColors([{ id: "all", name: "All", color: "", count: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Handle checkbox change
  const handleFilterChange = (filterType, value, displayName = null) => {
    // Create a new object to avoid direct mutation
    const updatedFilters = {
      ...filters,
      [filterType]: value,
    };
  
    // For categories, store both the ID and the display name
    if (filterType === "categories" && value !== "all") {
      updatedFilters.categoryName = displayName || value;
    } else if (filterType === "categories" && value === "all") {
      updatedFilters.categoryName = null; // Clear the name when "all" is selected
    }
  
    // Update local state
    setFilters(updatedFilters);
  
    // Notify parent component of the change
    onFilterChange(updatedFilters);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Update the search term in filters and notify parent component
    const updatedFilters = {
      ...filters,
      search: value,
    };

    setFilters(updatedFilters);

    // Debounce search to avoid too many API calls
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onFilterChange(updatedFilters);
    }, 500);
  };

  // Handle price input change
  const handlePriceChange = (type, value) => {
    const updatedFilters = {
      ...filters,
      price: {
        ...filters.price,
        [type]: value,
      },
    };

    setFilters(updatedFilters);
    // Debounce price changes to avoid too many API calls
    clearTimeout(window.priceTimeout);
    window.priceTimeout = setTimeout(() => {
      onFilterChange(updatedFilters);
    }, 500);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const resetFilters = {
      availability: "all",
      price: { min: "", max: "" },
      categories: "all",
      color: "all",
      search: "",
    };

    setFilters(resetFilters);
    setSearchTerm("");
    onFilterChange(resetFilters);
  };

  // Toggle mobile filter visibility
  const toggleMobileFilters = () => {
    setIsMobileExpanded(!isMobileExpanded);
  };

  // Checkbox with checkmark component
  const Checkbox = ({ selected, onClick, color = null }) => {
    return (
      <div
        className={`h-5 w-5 mr-2 relative flex items-center justify-center cursor-pointer
          ${color ? `rounded-full` : "rounded"} 
          ${selected && !color ? "bg-orange-500" : ""} 
          ${!selected && !color ? "border border-gray-300" : ""}
          ${
            selected && color
              ? "ring-2 ring-offset-1 ring-gray-400"
              : "border border-[#FFFFFF]"
          }
        `}
        style={color ? { backgroundColor: color } : {}}
        onClick={onClick}
      >
        {selected && (
          <svg
            className={`h-3 w-3 ${
              color && (color === "#000000" || color === "#0000ff")
                ? "text-white"
                : "text-white"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    );
  };

  // Generate filter section header
  const FilterSectionHeader = ({ title, section }) => (
    <div
      className="flex justify-between items-center py-2 border-b-2 border-[#E6E6E6] cursor-pointer"
      onClick={() => toggleSection(section)}
    >
      <h3 className="font-medium">{title}</h3>
      <svg
        className={`h-5 w-5 text-gray-500 transform ${
          expandedSections[section] ? "rotate-180" : ""
        }`}
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
  );

  // Get applied filters for display
  const getAppliedFilters = () => {
    const applied = [];

    if (filters.categories !== "all") {
      const category = categories.find((c) => c.id === filters.categories);
      if (category) {
        applied.push({
          type: "categories",
          id: category.id,
          name: category.name,
        });
      }
    }

    if (filters.color !== "all") {
      const color = colors.find((c) => c.id === filters.color);
      if (color) {
        applied.push({
          type: "color",
          id: color.id,
          name: color.name,
          hexCode: color.hexCode,
        });
      }
    }

    if (filters.availability !== "all") {
      applied.push({
        type: "availability",
        id: "inStock",
        name: "In Stock",
      });
    }

    if (filters.search) {
      applied.push({
        type: "search",
        id: "searchTerm",
        name: `"${filters.search}"`,
      });
    }

    return applied;
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return getAppliedFilters().length;
  };

  if (loading) {
    return (
      <div
        className={`bg-[#F7F5F3] w-full p-4 rounded-md flex justify-center items-center h-64 ${className}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0069B4]"></div>
      </div>
    );
  }

  // Content for filters
  const filtersContent = (
    <>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border-none bg-[#FFFFFF] rounded-lg text-md outline-none focus:outline-none focus:ring-0"
            placeholder="Search Filters"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => {
                setSearchTerm("");
                handleFilterChange("search", "");
              }}
            >
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="mb-4">
        <FilterSectionHeader title="Availability" section="availability" />

        {expandedSections.availability && (
          <div className="mt-2">
            {stockStatus.map((status) => (
              <div
                key={status.id}
                className="flex items-center justify-between mb-2 p-1"
              >
                <div className="flex items-center">
                  <Checkbox
                    selected={filters.availability === status.id}
                    onClick={() =>
                      handleFilterChange("availability", status.id)
                    }
                  />
                  <span className="text-sm">{status.name}</span>
                </div>
                <span className="text-sm text-gray-500">{status.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Filter */}
      {filteredCategories.length > 1 && (
        <div className="mb-4">
          <FilterSectionHeader title="Categories" section="categories" />

          {expandedSections.categories && (
            <div className="mt-2 max-h-60 overflow-y-auto">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between mb-2 p-1"
                >
                  <div className="flex items-center">
                    <Checkbox
                      selected={filters.categories === category.id}
                      onClick={() =>
                        handleFilterChange("categories", category.id, category.name)
                      }
                    />
                    <span className="truncate text-sm">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-1 flex-shrink-0">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Color Filter */}
      {filteredColors.length > 1 && (
        <div className="mb-4">
          <FilterSectionHeader title="Color" section="color" />

          {expandedSections.color && (
            <div className="mt-2 overflow-y-auto">
              {filteredColors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center mb-2 p-1">
                    <Checkbox
                      selected={filters.color === color.id}
                      onClick={() => handleFilterChange("color", color.id)}
                      color={color.hexCode}
                    />
                    <span
                      className={`truncate ${
                        filters.color === color.id ? "text-sm" : "text-sm"
                      }`}
                    >
                      {color.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 ml-1 flex-shrink-0">
                    {color.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Applied Filters */}
      <div className="mt-6">
        <h3 className="font-medium mb-2">Applied filters</h3>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <span
            className="text-orange-500 text-sm cursor-pointer mb-2 md:mb-0"
            onClick={clearAllFilters}
          >
            Clear all
          </span>
          <div className="flex flex-wrap gap-2">
            {/* Show all applied filters dynamically */}
            {getAppliedFilters().length > 0 ? (
              getAppliedFilters().map((filter) => (
                <div
                  key={filter.type + filter.id}
                  className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs"
                >
                  {filter.type === "color" && (
                    <div
                      className="h-3 w-3 mr-1 rounded-full"
                      style={{ backgroundColor: filter.hexCode }}
                    ></div>
                  )}
                  <span className="truncate max-w-20">{filter.name}</span>
                  <svg
                    className="h-4 w-4 ml-1 text-gray-500 cursor-pointer flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => {
                      if (filter.type === "search") {
                        setSearchTerm("");
                      }
                      handleFilterChange(
                        filter.type,
                        filter.type === "search" ? "" : "all"
                      );
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              ))
            ) : (
              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs">
                <span>All Categories</span>
                <svg
                  className="h-4 w-4 ml-1 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button - Visible only on small screens */}
      <div className="md:hidden w-full mb-4 flex justify-between items-center">
        <button
          onClick={toggleMobileFilters}
          className="bg-[#F7941E] text-white px-4 py-2 rounded-md flex items-center w-40 justify-center"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 bg-white text-orange-500 rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* Desktop View - Always visible on medium screens and up */}
      <div
        className={`hidden md:block bg-[#F7F5F3] w-72 p-4 rounded-md ${className}`}
      >
        {filtersContent}
      </div>

      {/* Mobile View - Conditionally visible based on state */}
      {isMobileExpanded && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-center items-start overflow-y-auto pt-4">
          <div className="bg-[#F7F5F3] w-11/12 p-4 rounded-md max-h-screen overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={toggleMobileFilters} className="text-gray-500">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {filtersContent}
            <div className="mt-6 flex justify-center">
              <button
                onClick={toggleMobileFilters}
                className="bg-orange-500 text-white px-6 py-2 rounded-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}