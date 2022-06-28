package com.chrisalxlng.citrusbackend.models;

import lombok.Data;

@Data
public class MealResponse {
  
  DishResponse dish;
  double quantity;

  public MealResponse(DishResponse dish, double quantity) {
    this.dish = dish;
    this.quantity = quantity;
  }
}
