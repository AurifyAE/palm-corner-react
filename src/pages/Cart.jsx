import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Delete as DeleteIcon } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCartItems = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );
    setCartItems(savedCartItems);
    console.log(savedCartItems)
  }, []);

  const handleDelete = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart");
  };

  const handleEnquire = () => {
    toast.success("Your request has been submitted");
  };

  return (
    <div className="max-w-[80%] max-sm:max-w-[100%] mt-24 max-sm:mt-5 mx-auto max-sm:px-6 lg:px-8 pt-20 pb-16 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Cart Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Cart</h1>
        <h2 className="text-lg sm:text-xl text-orange-500 font-semibold">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </h2>
      </div>

      {cartItems.length > 0 ? (
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