package com.chrisalxlng.citrusbackend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Dish {

  @Id
  private String id;

  private String title;
  private int iconId;
  private Unit unit;
  private int portionSize;
  private Ingredient[] ingredients;
  private String userId;

  public Dish(
    String title,
    int iconId,
    Unit unit,
    int portionSize,
    Ingredient[] ingredients,
    String userId
  ) {
    this.title = title;
    this.iconId = iconId;
    this.unit = unit;
    this.portionSize = portionSize;
    this.ingredients = ingredients;
    this.userId = userId;
  }
}
