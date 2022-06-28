package com.chrisalxlng.citrusbackend.models;

import java.util.Date;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class MealDiaryEntryResponse {
  
  private String id;
  private Date date;
  private MealResponse[] meals;
  private String userId;

  public MealDiaryEntryResponse(String id, Date date, MealResponse[] meals, String userId) {
    this.id = id;
    this.date = date;
    this.meals = meals;
    this.userId = userId;
  }
}
