package com.chrisalxlng.citrusbackend.models;

import java.util.Date;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class MealDiaryEntry {

  @Id
  private String id;

  private Date date;
  private Meal[] meals;
  private String userId;

  public MealDiaryEntry(Date date, Meal[] meals, String userId) {
    this.date = date;
    this.meals = meals;
    this.userId = userId;
  }
}
