package com.chrisalxlng.citrusbackend.models;

import lombok.Data;

@Data
public class GroceryResponse {
  private String id;
  private String title;
  private int iconId;
  private Unit unit;
  private int portionSize;
  private int calories;
  private MacroNutrients macroNutrientsPer100;
  private String[] macroNutrientTags; 
  private String userId;

  public GroceryResponse(
    String id,
    String title,
    int iconId,
    Unit unit,
    int portionSize,
    int calories,
    MacroNutrients macroNutrientsPer100,
    String[] macroNutrientTags,
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
    this.userId = userId;
  }
}
