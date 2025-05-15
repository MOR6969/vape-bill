import { Brand } from '../types';

export const ELFBAR_BRAND: Brand = {
  id: 'elfbar',
  name: 'ELFBAR',
  image: '/images/elfbar-seeklogo.png',
  flavors: [
    {
      id: 'bc10000',
      name: 'BC10000',
      image: '/images/BC10000.jpg',
      variants: [
        { id: 'apple-ice-5', name: 'Apple Ice 5%', quantity: 0, price: 0 },
        { id: 'blue-razz-ice-5', name: 'Blue Razz Ice 5%', quantity: 0, price: 0 },
        { id: 'blueberry-ice-5', name: 'Blueberry Ice 5%', quantity: 0, price: 0 },
        { id: 'cherry-watermelon-5', name: 'Cherry Watermelon 5%', quantity: 0, price: 0 },
        { id: 'grape-cherry-5', name: 'Grape Cherry 5%', quantity: 0, price: 0 },
        { id: 'grape-ice-5', name: 'Grape Ice 5%', quantity: 0, price: 0 },
        { id: 'lemon-lime-5', name: 'Lemon Lime 5%', quantity: 0, price: 0 },
        { id: 'peach-ice-5', name: 'Peach Ice 5%', quantity: 0, price: 0 },
        { id: 'peach-mango-5', name: 'Peach Mango 5%', quantity: 0, price: 0 },
        { id: 'strawberry-ice-5', name: 'Strawberry Ice 5%', quantity: 0, price: 0 },
        { id: 'tobacco-5', name: 'Tobacco 5%', quantity: 0, price: 0 },
        { id: 'watermelon-ice-5', name: 'Watermelon Ice 5%', quantity: 0, price: 0 }
      ]
    },
    {
      id: 'shisha-luxe',
      name: 'E-Shisha Luxe 30000',
      image: '/images/E-SHISHA_LUXE_30000.png',
      variants: [
        { id: 'double-apple-0-5', name: 'Double Apple 0.5%', quantity: 0, price: 0 },
        { id: 'frozen-blueberry-0-5', name: 'Frozen Blueberry 0.5%', quantity: 0, price: 0 },
        { id: 'lemon-mint-0-5', name: 'Lemon Mint 0.5%', quantity: 0, price: 0 },
        { id: 'love-dream-0-5', name: 'Love Dream 0.5%', quantity: 0, price: 0 },
        { id: 'mango-ice-0-5', name: 'Mango Ice 0.5%', quantity: 0, price: 0 },
        { id: 'melon-mint-0-5', name: 'Melon Mint 0.5%', quantity: 0, price: 0 },
        { id: 'peach-ice-0-5', name: 'Peach Ice 0.5%', quantity: 0, price: 0 },
        { id: 'saudi-fruit-mix-0-5', name: 'Saudi Fruit Mix 0.5%', quantity: 0, price: 0 },
        { id: 'watermelon-mint-0-5', name: 'Watermelon Mint 0.5%', quantity: 0, price: 0 }
      ]
    },
    {
      id: 'iceking',
      name: 'Ice King',
      image: '/images/ELFBAR_ICE_KING_30000.jpg',
      variants: [
        { id: 'blackberry-cranberry-5', name: 'Blackberry Cranberry 5%', quantity: 0, price: 0 },
        { id: 'blue-razz-ice-5', name: 'Blue Razz Ice 5%', quantity: 0, price: 0 },
        { id: 'blueberry-ice-5', name: 'Blueberry Ice 5%', quantity: 0, price: 0 },
        { id: 'cherry-watermelon-5', name: 'Cherry Watermelon 5%', quantity: 0, price: 0 },
        { id: 'double-apple-5', name: 'Double Apple 5%', quantity: 0, price: 0 },
        { id: 'grape-ice-5', name: 'Grape Ice 5%', quantity: 0, price: 0 },
        { id: 'kiwi-passion-fruit-guava-5', name: 'Kiwi Passion Fruit Guava 5%', quantity: 0, price: 0 },
        { id: 'mixed-berry-5', name: 'Mixed Berry 5%', quantity: 0, price: 0 },
        { id: 'peach-ice-5', name: 'Peach Ice 5%', quantity: 0, price: 0 },
        { id: 'watermelon-ice-5', name: 'Watermelon Ice 5%', quantity: 0, price: 0 }
      ]
    }
  ]
};

export const SIERRA_BRAND: Brand = {
  id: 'sierra',
  name: 'SIERRA',
  image: '/images/logo.png',
  flavors: [
    {
      id: 'premium-mint',
      name: 'Premium Mint',
      image: '/images/logo.png',
      variants: [
        { id: 'cool-mint', name: 'Cool Mint', quantity: 0, price: 0 },
        { id: 'fresh-mint', name: 'Fresh Mint', quantity: 0, price: 0 },
        { id: 'ice-mint', name: 'Ice Mint', quantity: 0, price: 0 }
      ]
    },
    {
      id: 'fruit-mix',
      name: 'Fruit Mix',
      image: '/images/logo.png',
      variants: [
        { id: 'tropical-mix', name: 'Tropical Mix', quantity: 0, price: 0 },
        { id: 'berry-mix', name: 'Berry Mix', quantity: 0, price: 0 },
        { id: 'citrus-mix', name: 'Citrus Mix', quantity: 0, price: 0 }
      ]
    },
    {
      id: 'special-blend',
      name: 'Special Blend',
      image: '/images/logo.png',
      variants: [
        { id: 'golden-blend', name: 'Golden Blend', quantity: 0, price: 0 },
        { id: 'royal-blend', name: 'Royal Blend', quantity: 0, price: 0 },
        { id: 'diamond-blend', name: 'Diamond Blend', quantity: 0, price: 0 },
        { id: 'platinum-blend', name: 'Platinum Blend', quantity: 0, price: 0 }
      ]
    }
  ]
};

export const ALL_BRANDS = [
  ELFBAR_BRAND,
  SIERRA_BRAND
]; 