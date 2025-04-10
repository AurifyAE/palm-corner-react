import axiosInstance from '../axios/axiosInstance';

// Get all products with filters
// export const getAllProducts = async (params = {}) => {
//     try {
//         // Build query string from params
//         const queryParams = new URLSearchParams();

//         if (params.page) queryParams.append('page', params.page);
//         if (params.limit) queryParams.append('limit', params.limit);
//         if (params.availability === 'inStock') queryParams.append('inStock', true);
//         if (params.minPrice) queryParams.append('minPrice', Number(params.minPrice));
//         if (params.maxPrice) queryParams.append('maxPrice', Number(params.maxPrice));
//         if (params.color && params.color !== 'all') queryParams.append('color', params.color);

//         const queryString = queryParams.toString();
//         const url = `/products${queryString ? `?${queryString}` : ''}`;

//         const response = axiosInstance.get(url);

//         if (!response.ok) {
//             throw new Error(`Failed to fetch products: ${response.status}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error("Error in getAllProducts:", error);
//         throw error;
//     }
// };

export const getAllProducts = ({
    minPrice,
    maxPrice,
    stock,
    color,
    page,
    limit
} = {}) => {
    return axiosInstance.get('/products', {
        params: {
            minPrice,
            maxPrice,
            stock,
            color,
            page,
            limit
        }
    });
};

// Get filter counts for categories, colors, and stock status
export const getFilterCounts = () => {
    return axiosInstance.get('/products/counts');
};


// Get Product Details
export const getProductDetails = (id) => {
    return axiosInstance.get(`/products/${id}`);
};


// /products?minPrice=150&maxPrice=250&stock=true&color=Red&page=1&limit=5