import { Link } from "react-router-dom";
import palmLogo from "../assets/palmLogo.png";
import { ShoppingBag, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);

  useEffect(() => {
    // Read initial cart items on mount
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartCount(cartItems.length);
    };

    // First load
    updateCartCount();

    // Listen for custom events from same tab
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Listen for storage events from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "cartItems") {
        updateCartCount();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const aboutContent = `At Palm Corner Events, we
    go beyond expectations to
    create unforgettable event
    experiences. Our expert
    team seamlessly transforms
    empty venues into vibrant,
    engaging spaces that foster
    connections and bring your
    vision to life. Let us turn
    your ideas into extraordinary
    events`;

  const contactContent = `Palm Corner Events LLC
    Warehouse no:13, Al Sajja, 
    Sharjah, UAE.

    +971 653 66 706, 
    info@palmcornerevents.com`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileAbout = () => {
    setIsMobileAboutOpen(!isMobileAboutOpen);
    // Close the other dropdown if open
    if (!isMobileAboutOpen && isMobileContactOpen) {
      setIsMobileContactOpen(false);
    }
  };

  const toggleMobileContact = () => {
    setIsMobileContactOpen(!isMobileContactOpen);
    // Close the other dropdown if open
    if (!isMobileContactOpen && isMobileAboutOpen) {
      setIsMobileAboutOpen(false);
    }
  };

  return (
    <header className="fixed top-0 md:top-6 left-0 w-full bg-transparent z-50 p-4">
      <nav className="flex justify-between items-center max-w-full md:max-w-[95%] lg:max-w-[90%] xl:max-w-[80%] mx-auto bg-[#FFFAED] px-4 md:px-8 lg:px-12 py-3 rounded-xl">
        <a href="/" className="flex-shrink-0">
          <img
            src={palmLogo}
            alt="Palm Corner"
            className="w-28 md:w-32 lg:w-40 h-8 md:h-10 lg:h-12"
          />
        </a>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <a href="/cart" className="mr-4">
            <div className="relative flex items-center">
              <ShoppingBag className="w-5 h-5 text-gray-800" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </a>
          <button onClick={toggleMobileMenu} className="text-gray-800">
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-row space-x-4 lg:space-x-12 xl:space-x-28 items-center">
          <div className="flex flex-row space-x-4 md:space-x-8 lg:space-x-16 xl:space-x-36">
            <div
              className="relative font-poppins font-semibold text-sm md:text-base"
              onMouseEnter={() => setIsAboutHovered(true)}
              onMouseLeave={() => setIsAboutHovered(false)}
            >
              About Us
              {isAboutHovered && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#F9B462] p-5 rounded-b-[15%] shadow-lg z-50">
                  <p className="text-[14px] text-black whitespace-pre-line">
                    {aboutContent}
                  </p>
                </div>
              )}
            </div>
            <div
              className="relative font-poppins font-semibold text-sm md:text-base"
              onMouseEnter={() => setIsContactHovered(true)}
              onMouseLeave={() => setIsContactHovered(false)}
            >
              Contact Us
              {isContactHovered && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#F9B462] p-5 rounded-b-[15%] shadow-lg z-50">
                  <p className="text-[14px] text-black font-semibold whitespace-pre-line">
                    {contactContent}
                  </p>
                </div>
              )}
            </div>
          </div>
          <a href="/cart">
            <div className="relative flex items-center">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </a>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FFFAED] border-t border-gray-200 py-2 shadow-lg">
          {/* About Us Section with Dropdown */}
          <div className="border-b border-gray-100">
            <button
              className="flex items-center justify-between w-full px-6 py-3"
              onClick={toggleMobileAbout}
            >
              <span className="font-poppins font-semibold text-base">
                About Us
              </span>
              {isMobileAboutOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {isMobileAboutOpen && (
              <div className="px-6 py-3 bg-[#F9B462] mx-4 mb-3 rounded-lg">
                <p className="text-sm text-black whitespace-pre-line">
                  {aboutContent}
                </p>
              </div>
            )}
          </div>

          {/* Contact Us Section with Dropdown */}
          <div className="border-b border-gray-100">
            <button
              className="flex items-center justify-between w-full px-6 py-3"
              onClick={toggleMobileContact}
            >
              <span className="font-poppins font-semibold text-base">
                Contact Us
              </span>
              {isMobileContactOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {isMobileContactOpen && (
              <div className="px-6 py-3 bg-[#F9B462] mx-4 mb-3 rounded-lg">
                <p className="text-sm text-black font-semibold whitespace-pre-line">
                  {contactContent}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
