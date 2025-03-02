// src/services/api.ts
import { Product } from '../models/Product';

// Convert the response data to match the Product interface
const convertProductData = (apiData: any): Product[] => {
  return apiData.map((item: any) => ({
    id: item.id,
    name: item.title, // The API provides 'title' instead of 'name'
    price: item.price,
    category: item.category,
    type: '', // Add logic if you want to categorize products more specifically
    image: item.image,
    rating: item.rating?.rate,
    isNew: false, // Add logic for new products if applicable
    isPopular: item.rating?.rate > 4, // Assuming items with a rating > 4 are popular
    isFeatured: false, // Add logic for featured products if applicable
    isLimited: false, // Add logic for limited offers if applicable
    discountPrice: item.price * 0.9, // Example discount
    colors: [], // Example, modify this if applicable
  }));
};

export const getProducts = (): Promise<Product[]> => {
  return fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((data) => convertProductData(data));
};

export const getFeaturedProducts = (): Promise<Product[]> => {
  return fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((data) => {
      // Filter for featured products (you can modify the condition based on your requirements)
      return convertProductData(data).filter((product) => product.isFeatured);
    });
};

export const getNewArrivals = (): Promise<Product[]> => {
  return fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((data) => {
      // Filter for new arrivals (you can modify the condition based on your requirements)
      return convertProductData(data).filter((product) => product.isNew);
    });
};

export const getPopularProducts = (): Promise<Product[]> => {
  return fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((data) => {
      // Filter for popular products based on rating (example condition)
      return convertProductData(data).filter((product) => product.isPopular);
    });
};

export const getLimitedOffers = (): Promise<Product[]> => {
  return fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((data) => {
      // Filter for limited offers (you can modify the condition based on your requirements)
      return convertProductData(data).filter((product) => product.isLimited);
    });
};
