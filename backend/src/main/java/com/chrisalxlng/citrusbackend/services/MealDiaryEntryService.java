package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.Meal;
import com.chrisalxlng.citrusbackend.models.MealDiaryEntry;
import com.chrisalxlng.citrusbackend.repositories.MealDiaryEntryRepository;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class MealDiaryEntryService {

  private final MealDiaryEntryRepository mealDiaryEntryRepository;

  public List<MealDiaryEntry> getAllEntries() {
    List<MealDiaryEntry> entries = mealDiaryEntryRepository.findAll();

    if (!entries.isEmpty()) {
      return entries;
    } else return null;
  }

  public MealDiaryEntry getEntryById(String id) {
    Optional<MealDiaryEntry> entry = mealDiaryEntryRepository.findMealDiaryEntryById(
      id
    );

    if (entry.isPresent()) {
      return entry.get();
    } else {
      log.error("Error accessing mealDiaryEntry: MealDiaryEntry not found");
      return null;
    }
  }

  public List<MealDiaryEntry> getEntriesByUserId(String userId) {
    List<MealDiaryEntry> entries = mealDiaryEntryRepository.findMealDiaryEntriesByUserId(
      userId
    );

    if (!entries.isEmpty()) {
      return entries;
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
