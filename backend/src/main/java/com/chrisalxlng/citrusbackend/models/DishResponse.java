package com.chrisalxlng.citrusbackend.models;

import lombok.Data;

@Data
public class DishResponse {
  private String id;
  private String title;
  private int iconId;
  private Unit unit;
  private int portionSize;
  private int calories;
  private MacroNutrients macroNutrientsPer100;
  private String[] macroNutrientTags;
  private IngredientResponse[] ingredients;
  private String userId;

  public DishResponse(
    String id,
    String title,
    int iconId,
    Unit unit,
    int portionSize,
    int calories,
    MacroNutrients macroNutrientsPer100,
    String[] macroNutrientTags,
    IngredientResponse[] ingredients,
    String userId
  ) {
    this.id = id;
    this.title = title;
    this.iconId = iconId;
    this.unit = unit;
    this.portionSize = portionSize;
    this.calories = calories;
    this.macroNutrientsPer100 = macroNutrientsPer100;
    this.macroNutrientTags = macroNutrientTags;
    this.ingredients = ingredients;
    this.userId = userId;
  }
}
