package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.DishResponse;
import com.chrisalxlng.citrusbackend.models.Meal;
import com.chrisalxlng.citrusbackend.models.MealDiaryEntry;
import com.chrisalxlng.citrusbackend.models.MealDiaryEntryResponse;
import com.chrisalxlng.citrusbackend.models.MealResponse;
import com.chrisalxlng.citrusbackend.repositories.MealDiaryEntryRepository;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class MealDiaryEntryService {

  private final MealDiaryEntryRepository mealDiaryEntryRepository;
  private final DishService dishService;

  public List<MealDiaryEntryResponse> getAllEntries() {
    List<MealDiaryEntry> entries = mealDiaryEntryRepository.findAll();

    if (!entries.isEmpty()) {
      List<MealDiaryEntryResponse> entriesResponse = entries.stream().map(entry -> {
        List<Meal> meals = Arrays.asList(entry.getMeals());
        MealResponse[] mealsResponse = meals.stream().map(meal -> {
          DishResponse dishResponse = dishService.getDishById(meal.getDishId());
          MealResponse mealResponse = new MealResponse(dishResponse, meal.getQuantity());

          return mealResponse;
        }).toArray(size -> new MealResponse[size]);

        MealDiaryEntryResponse mealDiaryEntryResponse = 
          new MealDiaryEntryResponse(entry.getId(), entry.getDate(), mealsResponse, entry.getUserId());

        return mealDiaryEntryResponse;
      }).collect(Collectors.toList());
      return entriesResponse;
    } else return null;
  }

  public MealDiaryEntryResponse getEntryById(String id) {
    Optional<MealDiaryEntry> entry = mealDiaryEntryRepository.findMealDiaryEntryById(
      id
    );

    if (entry.isPresent()) {
      MealDiaryEntry diaryEntry = entry.get();
      List<Meal> mealsList = Arrays.asList(diaryEntry.getMeals());
      MealResponse[] mealsResponse = mealsList.stream().map(meal -> {
        DishResponse dishResponse = dishService.getDishById(meal.getDishId());
        MealResponse mealResponse = new MealResponse(dishResponse, meal.getQuantity());

        return mealResponse;
      }).toArray(size -> new MealResponse[size]);
      MealDiaryEntryResponse mealDiaryEntryResponse = 
        new MealDiaryEntryResponse(diaryEntry.getId(), diaryEntry.getDate(), mealsResponse, diaryEntry.getUserId());

      return mealDiaryEntryResponse;
    } else {
      log.error("Error accessing mealDiaryEntry: MealDiaryEntry not found");
      return null;
    }
  }

  public MealDiaryEntryResponse getEntryByDate(Date date) {
    Optional<MealDiaryEntry> entry = mealDiaryEntryRepository.findMealDiaryEntryByDate(
      date
    );

    if (entry.isPresent()) {
      MealDiaryEntry diaryEntry = entry.get();
      List<Meal> mealsList = Arrays.asList(diaryEntry.getMeals());
      MealResponse[] mealsResponse = mealsList.stream().map(meal -> {
        DishResponse dishResponse = dishService.getDishById(meal.getDishId());
        MealResponse mealResponse = new MealResponse(dishResponse, meal.getQuantity());

        return mealResponse;
      }).toArray(size -> new MealResponse[size]);
      MealDiaryEntryResponse mealDiaryEntryResponse = 
        new MealDiaryEntryResponse(diaryEntry.getId(), diaryEntry.getDate(), mealsResponse, diaryEntry.getUserId());

      return mealDiaryEntryResponse;
    } else {
      log.error("Error accessing mealDiaryEntry: MealDiaryEntry not found");
      return null;
    }
  }

  public List<MealDiaryEntryResponse> getEntriesByUserId(String userId) {
    List<MealDiaryEntry> entries = mealDiaryEntryRepository.findMealDiaryEntriesByUserId(
      userId
    );

    if (!entries.isEmpty()) {
      List<MealDiaryEntryResponse> entriesResponse = entries.stream().map(entry -> {
        List<Meal> meals = Arrays.asList(entry.getMeals());
        MealResponse[] mealsResponse = meals.stream().map(meal -> {
          DishResponse dishResponse = dishService.getDishById(meal.getDishId());
          MealResponse mealResponse = new MealResponse(dishResponse, meal.getQuantity());

          return mealResponse;
        }).toArray(size -> new MealResponse[size]);

        MealDiaryEntryResponse mealDiaryEntryResponse = 
          new MealDiaryEntryResponse(entry.getId(), entry.getDate(), mealsResponse, entry.getUserId());

        return mealDiaryEntryResponse;
      }).collect(Collectors.toList());
      return entriesResponse;
    } else return null;
  }

  public MealDiaryEntry createEntry(Date date, Meal[] meals, String userId) {
    MealDiaryEntry entry = new MealDiaryEntry(date, meals, userId);

    mealDiaryEntryRepository.insert(entry);
    log.info("MealDiaryEntry created");
    return entry;
  }

  public MealDiaryEntry updateEntry(
    String id,
    Date date,
    Meal[] meals,
    String userId
  ) {
    Optional<MealDiaryEntry> entry = mealDiaryEntryRepository.findMealDiaryEntryById(
      id
    );

    if (entry.isPresent()) {
      MealDiaryEntry mealDiaryEntry = entry.get();
      mealDiaryEntry.setDate(date);
      mealDiaryEntry.setMeals(meals);
      mealDiaryEntry.setUserId(userId);
      mealDiaryEntryRepository.save(mealDiaryEntry);
      log.info("MealDiaryEntry updated");
      return mealDiaryEntry;
    } else {
      log.error("Error updating mealDiaryEntry: MealDiaryEntry not found");
      return null;
    }
  }

  public MealDiaryEntry deleteEntry(String id) {
    Optional<MealDiaryEntry> entry = mealDiaryEntryRepository.findMealDiaryEntryById(
      id
    );

    if (entry.isPresent()) {
      MealDiaryEntry mealDiaryEntry = entry.get();
      mealDiaryEntryRepository.deleteById(id);
      log.info("MealDiaryEntry deleted");
      return mealDiaryEntry;
    } else {
      log.error("Error deleting mealDiaryEntry: MealDiaryEntry not found");
      return null;
    }
  }
}
