package com.chrisalxlng.citrusbackend.models;

import lombok.Data;

@Data
public class MacroNutrients {
  double carbohydrates;
  double fats;
  double proteins;

  public MacroNutrients(
    double carbohydrates,
    double fats,
    double proteins
  ) {
    this.carbohydrates = carbohydrates;
    this.fats = fats;
    this.proteins = proteins;
  }
}
