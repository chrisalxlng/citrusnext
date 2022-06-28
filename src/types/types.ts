export enum Unit {
  Grams = 'g',
  Mililiters = 'ml',
}

export enum MacroNutrientTag {
  HIGH_CARBOHYDRATE = 'high_carb',
  LOW_CARBOHYDRATE = 'low_carb',
  HIGH_FAT = 'high_fat',
  LOW_FAT = 'low_fat',
  HIGH_PROTEIN = 'high_protein',
  LOW_PROTEIN = 'low_protein',
  BALANCED_MACROS = 'balanced_macros',
}

type MacroNutrients = {
  carbohydrates: number;
  fats: number;
  proteins: number;
};

type GroceryRequest = {
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  macroNutrientsPer100: MacroNutrients;
  userId: string;
};

export type GroceryResponse = {
  id: string;
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  calories: number;
  macroNutrientsPer100: MacroNutrients;
  macroNutrientTags: MacroNutrientTag[];
  userId: string;
};

export type CreateGrocery = GroceryRequest;

export type UpdateGrocery = CreateGrocery & { id: string };

type IngredientRequest = {
  groceryId: string;
  quantity: number;
};

export type IngredientResponse = {
  grocery: GroceryResponse;
  quantity: number;
};

type DishRequest = {
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  ingredients: IngredientRequest[];
  userId: string;
};

export type DishResponse = {
  id: string;
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  calories: number;
  macroNutrientsPer100: MacroNutrients;
  macroNutrientTags: MacroNutrientTag[];
  ingredients: IngredientResponse[];
  userId: string;
};

export type CreateDish = DishRequest;

export type UpdateDish = CreateDish & { id: string };

export type DishForm = {
  id?: string;
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  ingredients: IngredientResponse[];
  userId: string;
};

type MealRequest = {
  dishId: string;
  quantity: number;
};

export type MealResponse = {
  dish: DishResponse;
  quantity: number;
};

type MealDiaryEntryRequest = {
  date: Date;
  meals: MealRequest[];
  userId: string;
};

export type MealDiaryEntryResponse = {
  id: string;
  date: Date;
  meals: MealResponse[];
  userId: string;
};

export type CreateMealDiaryEntry = MealDiaryEntryRequest;

export type UpdateMealDiaryEntry = MealDiaryEntryRequest & { id: string };
