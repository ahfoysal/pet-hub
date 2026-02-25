// Hotel food management related types

export const FOOD_TYPE_OPTIONS = ["VEGAN", "NON_VEGAN", "RAW", "DRY", "WET"] as const;
export const FOOD_FOR_OPTIONS = ["HUMAN", "PET", "BOTH"] as const;

export type FoodTypeEnum = (typeof FOOD_TYPE_OPTIONS)[number];
export type FoodForEnum = (typeof FOOD_FOR_OPTIONS)[number];

export interface HotelFood {
  id: string;
  hotelProfileId: string;
  foodType: FoodTypeEnum;
  foodFor: FoodForEnum;
  name: string;
  images: string[];
  ingredients: string[];
  description: string;
  price: number;
  numberOfServing: number;
  gramPerServing: number;
  petCategory: string;
  petBreed: string;
  calories: number;
  protein: number;
  fat: number;
  minAge: number | null;
  maxAge: number | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodApiResponse {
  success: boolean;
  message: string;
  data?: HotelFood;
}

export interface FoodsApiResponse {
  success: boolean;
  message: string;
  data?: HotelFood[];
}

export interface FoodDeleteResponse {
  success: boolean;
  message: string;
  data?: {
    foodId: string;
    foodName: string;
  };
}
