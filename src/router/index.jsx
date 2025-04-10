import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../pages/About";
import ProductDetail from "../pages/ProductDetails"
import CartPage from "../pages/Cart"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "/product-details/:id", element: <ProductDetail /> },
      { path: "cart", element: <CartPage /> },
    ],
  },
]);

export default router;