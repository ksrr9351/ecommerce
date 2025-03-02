// src/models/Product.ts
export interface Product {
    id: number;
    name: string; // Renamed 'title' to 'name' as per your mapping logic
    price: number;
    title:string;
    category: string;
    type: string; // You can modify this based on your logic for categorizing products
    image: string;
    rating?: {
        rate: number;
        count: number; // Optional field that indicates how many ratings the product has
      };
    isNew: boolean; // Flag for new products
    isPopular: boolean; // Flag for popular products
    isFeatured: boolean; // Flag for featured products
    isLimited: boolean; // Flag for limited-time offers
    discountPrice: number; // Discounted price
    colors: string[]; // Array for colors, modify as needed
  }
  