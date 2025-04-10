import React, { useState } from "react";
import banner from "../assets/banner.png";
import FiltersSidebar from "../components/FiltersSidebar";
import AllProducts from "../components/AllProducts";
import palmLogo from "../assets/palmLogo.png";

const Home = () => {
  const [filters, setFilters] = useState({
    availability: "all",
    price: { min: "", max: "" },
    categories: "all",
    color: "all",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log(newFilters);
  };

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 md:px-10 mb-10 md:mb-20">
        {/* Responsive Banner Section */}
        <div className="relative">
          <div className="w-full">
            <img 
              src={banner} 
              alt="Banner" 
              className="inverted-radius w-full h-auto" 
            />
          </div>
          <img
            src={palmLogo}
            alt="Palm Logo"
            className="absolute w-40 sm:w-60 md:w-80 -bottom-20 max-sm:-bottom-10 md:-bottom-30 ml-4 sm:ml-6 md:ml-10"
          />
        </div>
        
        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row mt-20 sm:mt-28 md:mt-40 lg:mt-60">
          <FiltersSidebar onFilterChange={handleFilterChange} />
          <AllProducts filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Home;