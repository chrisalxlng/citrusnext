package com.chrisalxlng.citrusbackend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Grocery {

  @Id
  private String id;

  private String title;
  private int iconId;
  private Unit unit;
  private int portionSize;
  private int calories;
  private MacroNutrients macroNutrientsPer100;
  private String[] macroNutrientTags; 
  private String userId;

  public Grocery(
    String title,
    int iconId,
    Unit unit,
    int portionSize,
    int calories,
    MacroNutrients macroNutrientsPer100,
    String[] macroNutrientTags,
    String userId
  ) {
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
