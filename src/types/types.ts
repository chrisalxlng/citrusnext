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

export type CreateGrocery = {
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  macroNutrientsPer100: {
    carbohydrates: number;
    fats: number;
    proteins: number;
  };
  userId: string;
};

export type UpdateGrocery = {
  id: string;
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  macroNutrientsPer100: {
    carbohydrates: number;
    fats: number;
    proteins: number;
  };
  userId: string;
};

export type Grocery = {
  id: string;
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  calories: number;
  macroNutrientsPer100: {
    carbohydrates: number;
    fats: number;
    proteins: number;
  };
  macroNutrientTags: MacroNutrientTag[];
  userId: string;
};

export type CreateDish = {
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  ingredients: { groceryId: string; quantity: number }[];
  userId: string;
};

export type UpdateDish = {
  id: string;
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  ingredients: { groceryId: string; quantity: number }[];
  userId: string;
};

export type DishForm = {
  id: string;
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  ingredients: { grocery: Grocery; quantity: number }[];
  userId: string;
};

export type Dish = {
  id: string;
  title: string;
  iconId: number;
  unit: Unit;
  portionSize: number;
  calories: number;
  macroNutrientsPer100: {
    carbohydrates: number;
    fats: number;
    proteins: number;
  };
  macroNutrientTags: MacroNutrientTag[];
  ingredients: { grocery: Grocery; quantity: number }[];
  userId: string;
};

export type Ingredient = {
  grocery: Grocery;
  quantity: number;
};
