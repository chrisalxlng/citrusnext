package com.chrisalxlng.citrusbackend.models;

import lombok.Data;

@Data
public class Ingredient {

  String groceryId;
  double quantity;

  public Ingredient(String groceryId, double quantity) {
    this.groceryId = groceryId;
    this.quantity = quantity;
  }
}
