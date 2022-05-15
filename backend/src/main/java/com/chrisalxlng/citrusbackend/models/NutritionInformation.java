package com.chrisalxlng.citrusbackend.models;

import lombok.Data;

@Data
public class NutritionInformation {

  double calories;
  double carbohydrates;
  double fats;
  double proteins;

  public NutritionInformation(
    double calories,
    double carbohydrates,
    double fats,
    double proteins
  ) {
    this.calories = calories;
    this.carbohydrates = carbohydrates;
    this.fats = fats;
    this.proteins = proteins;
  }
}
