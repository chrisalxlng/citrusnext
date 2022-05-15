package com.chrisalxlng.citrusbackend.models;

import lombok.Data;

@Data
public class Meal {

  String dishId;
  double quantity;

  public Meal(String dishId, double quantity) {
    this.dishId = dishId;
    this.quantity = quantity;
  }
}
