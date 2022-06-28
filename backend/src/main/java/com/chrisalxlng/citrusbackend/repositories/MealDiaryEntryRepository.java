package com.chrisalxlng.citrusbackend.repositories;

import com.chrisalxlng.citrusbackend.models.MealDiaryEntry;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MealDiaryEntryRepository
  extends MongoRepository<MealDiaryEntry, String> {
  Optional<MealDiaryEntry> findMealDiaryEntryById(String id);
  Optional<MealDiaryEntry> findMealDiaryEntryByDate(Date date);
  List<MealDiaryEntry> findMealDiaryEntriesByUserId(String userId);
}
