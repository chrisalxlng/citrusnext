package com.chrisalxlng.citrusbackend.models;

import lombok.Data;

@Data
public class IngredientResponse {

  GroceryResponse grocery;
  double quantity;

  public IngredientResponse(GroceryResponse grocery, double quantity) {
    this.grocery = grocery;
    this.quantity = quantity;
  }
}
