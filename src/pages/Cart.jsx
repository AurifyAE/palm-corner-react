import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Delete as DeleteIcon } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { getProductDetails } from "../api/api";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        // Retrieve cart items from localStorage
        const savedCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        
        if (savedCartItems.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Check each product's availability via API
        const availableItems = await checkProductsAvailability(savedCartItems);
        
        // Update cart with only available products
        setCartItems(availableItems);
        
        // If some items were unavailable, update localStorage
        if (availableItems.length !== savedCartItems.length) {
          localStorage.setItem("cartItems", JSON.stringify(availableItems));
          window.dispatchEvent(new Event("cartUpdated"));
          toast.error("Some items in your cart are no longer available");
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
        toast.error("Error checking product availability");
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  // Function to check product availability through API using individual product endpoints
  const checkProductsAvailability = async (items) => {
    try {
      // Create an array of promises to check each product
      const availabilityPromises = items.map(async (item) => {
        try {
          // Call the individual product endpoint
          const response = await getProductDetails(item.productId);
          
          // If the API call succeeds, the product exists and is available
          return {
            ...item,
            isAvailable: true
          };
        } catch (error) {
          // If API call fails, product is unavailable
          console.log(`Product ${item.title} (ID: ${item.productId}) is no longer available`);
          return {
            ...item,
            isAvailable: false
          };
        }
      });

      // Wait for all product checks to complete
      const checkedItems = await Promise.all(availabilityPromises);
      
      // Filter out unavailable products
      return checkedItems.filter(item => item.isAvailable);
    } catch (error) {
      console.error("Error in batch checking product availability:", error);
      // Return original items if overall process fails
      return items;
    }
  };

  const handleDelete = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart");
  };

  const handleEnquire = () => {
    // Format cart items for WhatsApp message
    let message = "Hello, I would like to enquire about the following items:\n\n";
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. Product: ${item.title}\n`;
      message += `   SKU: ${item.sku}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      if (item.colorName) {
        message += `   Color: ${item.colorName}\n`;
      }
      message += "\n";
    });
    
    // Add a phone number where you want to receive enquiries
    const phoneNumber = "971507330747";
    
    // Encode the message for a URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp link
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappLink, "_blank");
    
    toast.success("Opening WhatsApp to send your enquiry");
  };

  return (
    <div className="max-w-[80%] max-sm:max-w-[100%] mt-24 max-sm:mt-5 mx-auto max-sm:px-6 lg:px-8 pt-20 pb-16 min-h-screen">
      
      {/* Cart Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Cart</h1>
        <h2 className="text-lg sm:text-xl text-orange-500 font-semibold">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Checking product availability...</p>
        </div>
      ) : cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Quantity</th>
                    <th className="pb-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4">
                        <Link
                          to={`/product-details/${item.productId}`}
                          className="flex items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="ml-4">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">
                              {item.sku}
                            </p>
                            {item.colorName && (
                              <p className="text-gray-500 text-sm">
                                Color: {item.colorName}
                              </p>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="py-4">{item.quantity}</td>
                      <td className="py-4">
                        <button
                          onClick={() => handleDelete(index)}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Remove item"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Item Cards */}
            <div className="md:hidden space-y-6">
              {cartItems.map((item, index) => (
                <div key={index} className="rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-3">
                      <Link
                        to={`/product-details/${item.productId}`}
                        className="flex space-x-3"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <h3 className="font-medium text-sm sm:text-base">
                            {item.title}
                          </h3>
                          <p className="text-gray-500 text-xs sm:text-sm mt-1">
                            {item.sku}
                          </p>
                          {item.colorName && (
                            <p className="text-gray-500 text-xs sm:text-sm">
                              Color: {item.colorName}
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Remove item"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                  <div className="mt-2 text-sm pl-20">
                    <span className="text-gray-600">Quantity: </span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 lg:mt-0 flex flex-col lg:items-end">
            <button
              onClick={handleEnquire}
              className="w-full sm:w-64 h-12 bg-[#F7941E] text-white font-medium rounded-lg 
                hover:bg-transparent hover:text-[#F7941E] hover:border-2 hover:border-[#F7941E] cursor-pointer"
            >
              Enquire Now
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-xl sm:text-2xl font-medium mb-3">Your cart is empty</h2>
          <p className="text-gray-600">Start adding items to your cart!</p>
        </div>
      )}
    </div>
  );
}