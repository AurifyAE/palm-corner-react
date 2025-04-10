import React, { useState, useRef, useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";
import { getProductDetails } from "../api/api";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// Image Carousel Component with Swiper (unchanged)
const ImageCarousel = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailsRef = useRef(null);
  const mainSwiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (thumbnailsRef.current && thumbnailsRef.current.swiper) {
      const swiper = thumbnailsRef.current.swiper;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
      swiper.on("slideChange", () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      });
      return () => {
        swiper.off("slideChange");
      };
    }
  }, [thumbsSwiper]);

  const handleThumbnailPrev = () => {
    if (thumbnailsRef.current && !isBeginning) {
      thumbnailsRef.current.swiper.slidePrev();
    }
  };

  const handleThumbnailNext = () => {
    if (thumbnailsRef.current && !isEnd) {
      thumbnailsRef.current.swiper.slideNext();
    }
  };

  const handleThumbnailClick = (index) => {
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideTo(index);
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative">
      <Swiper
        spaceBetween={10}
        navigation={false}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        ref={mainSwiperRef}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="mb-4 bg-[#BFBEBE] rounded-3xl p-4 h-96 max-sm:h-86"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-center h-full"
          >
            <img
              src={image.url}
              alt={`Product image ${index + 1}`}
              className="h-full max-w-full object-contain mx-auto py-10"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="relative flex items-center">
        {images.length > 3 && (
          <button
            className={`absolute left-0 z-10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border ${
              isBeginning
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-800"
            } transform -translate-y-1/2 top-1/2`}
            onClick={handleThumbnailPrev}
            disabled={isBeginning}
            aria-label="Previous thumbnails"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
        )}

        <div className="flex w-full px-12 md:px-20 gap-20">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={3}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
              1600: {
                slidesPerView: 6,
              },
            }}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[Navigation, Thumbs]}
            className="thumbnails-swiper w-full"
            ref={thumbnailsRef}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`cursor-pointer p-2 rounded ${
                    activeIndex === index
                      ? "border-2 border-[#0E76BC]"
                      : "border border-gray-300"
                  } w-20 h-20 flex items-center justify-center`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {images.length > 3 && (
          <button
            className={`absolute right-0 z-10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border ${
              isEnd
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-800"
            } transform -translate-y-1/2 top-1/2`}
            onClick={handleThumbnailNext}
            disabled={isEnd}
            aria-label="Next thumbnails"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
        )}
      </div>
    </div>
  );
};

// Color Selector Component (unchanged)
const ColorSelector = ({ colors, selectedColor, onColorSelect }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2 flex-wrap">
        <span className="font-medium mr-2 text-base sm:text-base md:text-base">
          Colors :
        </span>
        <span className="text-gray-500 text-sm sm:text-base">Choose Color</span>
      </div>

      <div className="flex space-x-2">
        {colors.map((color) => (
          <button
            key={color._id}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border cursor-pointer ${
              selectedColor === color._id
                ? "ring-2 ring-offset-1 ring-blue-500"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: color.hexCode }}
            onClick={() => onColorSelect(color._id)}
            aria-label={color.colorName}
          />
        ))}
      </div>
    </div>
  );
};

// Tab Component (with responsive text)
const ProductTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <>
      <div className="border-b border-gray-400 py-2">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-1 px-4 sm:px-6 md:px-10 text-sm sm:text-base ${
                activeTab === tab.id
                  ? "bg-[#0A588D] text-white rounded-[30px]"
                  : ""
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="py-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
};

// Specifications Component (with responsive text)
const Specifications = ({ specifications }) => {
  return (
    <div className="space-y-2">
      {specifications.map((spec, index) => (
        <div key={index} className="flex flex-wrap">
          <span className="font-medium w-24 sm:w-28 md:w-36 text-sm sm:text-base">
            {spec.key}:
          </span>
          <span className="text-sm sm:text-base">{spec.value}</span>
        </div>
      ))}
    </div>
  );
};

// Main Product Detail Component
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColorImages, setSelectedColorImages] = useState([]);

  // Function to get cart items from local storage
  const getCartItems = () => {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  };

  // Function to save cart items to local storage
  const saveCartItems = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  // Update the useEffect that fetches product details
  useEffect(() => {
    setLoading(true);
    getProductDetails(id)
      .then((response) => {
        if (response.data.success) {
          const productData = response.data.data;
          setProduct(productData);

          // Check cart for existing item
          const cartItems = getCartItems();
          const cartItem = cartItems.find(
            (item) => item.productId === productData._id
          );

          // Initialize color and quantity
          let initialColor;
          let initialQuantity = "";
          let initialImages = [];

          if (cartItem) {
            // Use saved values if exists in cart
            const savedColor = productData.colors.find(
              (color) => color._id === cartItem.color
            );

            if (savedColor) {
              initialColor = savedColor._id;
              initialImages = savedColor.images;
            } else {
              // Fallback to default color if saved color not found
              const defaultColor =
                productData.colors.find((color) => color.isDefault) ||
                productData.colors[0];
              initialColor = defaultColor._id;
              initialImages = defaultColor.images;
            }

            initialQuantity = cartItem.quantity;
          } else {
            // Use default values if not in cart
            const defaultColor =
              productData.colors.find((color) => color.isDefault) ||
              productData.colors[0];
            initialColor = defaultColor._id;
            initialImages = defaultColor.images;
          }

          setSelectedColor(initialColor);
          setSelectedColorImages(initialImages);
          setQuantity(initialQuantity);
        } else {
          setError("Failed to fetch product details");
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setError("An error occurred while fetching product details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Update images when selected color changes
    if (product) {
      const color = product.colors.find((color) => color._id === selectedColor);
      if (color) {
        setSelectedColorImages(color.images);
      }
    }
  }, [selectedColor, product]);

  const handleAddToCart = () => {
    if (!quantity || quantity <= 0) {
      // Show toast notification instead of alert
      toast.error("Please enter quantity", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Get current cart items
    const cartItems = getCartItems();

    // Find the selected color object to get its details
    const selectedColorObj = product.colors.find(
      (c) => c._id === selectedColor
    );

    // Get color name and selected image
    const colorName = selectedColorObj?.colorName || "";
    const colorHexCode = selectedColorObj?.hexCode || "";
    const imageUrl = selectedColorImages[0]?.url || "";

    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === product._id
    );

    if (existingItemIndex !== -1) {
      // Update quantity and color if product already exists
      cartItems[existingItemIndex].quantity = parseInt(quantity);
      cartItems[existingItemIndex].color = selectedColor;
      cartItems[existingItemIndex].colorName = colorName;
      cartItems[existingItemIndex].colorHexCode = colorHexCode;
      cartItems[existingItemIndex].image = imageUrl;
    } else {
      // Add new item if product doesn't exist
      cartItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        sku: product.sku,
        color: selectedColor,
        colorName: colorName,
        colorHexCode: colorHexCode,
        image: imageUrl,
        quantity: parseInt(quantity),
      });
    }

    // Save updated cart items
    saveCartItems(cartItems);

    // Dispatch event to notify other components about cart update
    window.dispatchEvent(new Event("cartUpdated"));

    // Show success toast
    toast.success("Product added to cart successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // console.log("Cart updated:", cartItems);
  };

  if (loading) {
    return (
      <div className="max-w-[80%] mx-auto px-4 py-8 mt-24 mb-24 flex justify-center items-center  h-[70vh]">
        <div className="text-base sm:text-lg md:text-xl">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[80%] mx-auto px-4 py-8 mt-24 mb-24 flex justify-center items-center  h-[70vh]">
        <div className="text-base sm:text-lg md:text-xl text-red-500">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  const breadcrumbPaths = [
    { label: "Home", url: "/" },
    { label: product.title, url: `/products/${product._id}` },
  ];

  const tabs = [
    {
      id: "description",
      label: "Description",
      content: (
        <p className="text-sm sm:text-base md:text-base">
          {product.description}
        </p>
      ),
    },
    {
      id: "specification",
      label: "Specification",
      content: <Specifications specifications={product.specifications} />,
    },
  ];

  return (
    <div className="max-w-[80%] max-sm:max-w-[100%] mx-auto px-4 max-sm:px-6 max-sm:mt-10 py-8 mt-24 mb-24">
      <Breadcrumbs paths={breadcrumbPaths} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images Section */}
        <div className="md:w-1/2">
          <ImageCarousel images={selectedColorImages} />
        </div>

        {/* Product Info Section */}
        <div className="md:w-1/2">
          <h1 className="text-xl sm:text-2xl font-medium mb-2 font-inter">
            {product.title}
          </h1>
          <p className="text-[#AAAAAA] text-sm sm:text-base mb-2 font-inter">
            SKU: {product.sku}
          </p>
          <p className="text-lg sm:text-xl font-medium text-[#F7941E] mb-4">
            ${product.price.toFixed(2)}
          </p>

          {/* Stock Status */}
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded text-sm sm:text-base ${
                product.stock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />

          {/* Quantity */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="font-medium mr-4 text-sm sm:text-base">
                Quantity:
              </span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || "")}
                placeholder="Enter Here"
                min="1"
                className="bg-[#D9D9D9] text-[#000] py-2 px-4 rounded-md w-28 max-sm:w-26 text-sm sm:text-base placeholder-[#B0A6A6] outline-none focus:outline-none focus:ring-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className={`border-2 cursor-pointer w-48 sm:w-60 py-2 sm:py-3 rounded-lg flex items-center justify-center mb-8 text-sm sm:text-base ${
              product.stock
                ? "bg-[#F7941E] border-[#F7941E] hover:bg-transparent hover:text-[#F7941E] text-[#FFFBF7]"
                : "bg-gray-300 border-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {product.stock ? "Add to cart" : "Out of Stock"}
          </button>

          {/* Product Details Tabs */}
          <ProductTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
