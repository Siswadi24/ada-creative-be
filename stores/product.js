import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);

  const setProducts = (data) => {
    products.value = data;
  };

  const findBySlug = (slug) =>
    products.value.find((item) => item.slug === slug);

  return { products, setProducts, findBySlug };
});