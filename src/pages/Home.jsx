import React, { useState } from "react";
import banner from "../assets/banner.png";
import FiltersSidebar from "../components/FiltersSidebar";
import AllProducts from "../components/AllProducts";
import palmVideo from "../assets/video.mp4";

const Home = () => {
  const [filters, setFilters] = useState({
    availability: "all",
    price: { min: "", max: "" },
    categories: "all",
    color: "all",
    search: "", // Added search property to track search terms
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // console.log("Applied filters:", newFilters);
  };

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 md:px-10 mb-10 md:mb-20">
        {/* Responsive Banner Section */}
        <div className="rounded-[25px] overflow-hidden max-sm:mt-15 max-sm:rounded-xl">
          <video
            src={palmVideo}
            autoPlay
            muted
            loop
            playsInline
            className="rounded-[25px] w-full h-auto object-cover"
          />
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row mt-10 sm:mt-28 md:mt-20 lg:mt-20">
          <FiltersSidebar onFilterChange={handleFilterChange} />
          <AllProducts filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Home;
