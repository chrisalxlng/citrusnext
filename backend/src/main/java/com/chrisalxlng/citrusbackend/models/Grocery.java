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
  private Unit unit;
  private int portionSize;
  private boolean includeInDishes;
  private NutritionInformation nutritionInformation;
  private String userId;

  public Grocery(
    String title,
    Unit unit,
    int portionSize,
    boolean includeInDishes,
    NutritionInformation nutritionInformation,
    String userId
  ) {
    this.title = title;
    this.unit = unit;
    this.portionSize = portionSize;
    this.includeInDishes = includeInDishes;
    this.nutritionInformation = nutritionInformation;
    this.userId = userId;
  }
}
