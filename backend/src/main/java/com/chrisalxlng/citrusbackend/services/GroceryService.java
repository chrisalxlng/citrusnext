package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.Grocery;
import com.chrisalxlng.citrusbackend.models.NutritionInformation;
import com.chrisalxlng.citrusbackend.models.Unit;
import com.chrisalxlng.citrusbackend.repositories.GroceryRepository;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class GroceryService {

  private final GroceryRepository groceryRepository;

  public List<Grocery> getAllGroceries() {
    List<Grocery> groceries = groceryRepository.findAll();

    if (!groceries.isEmpty()) {
      return groceries;
    } else return null;
  }

  public Grocery getGroceryById(String id) {
    Optional<Grocery> groceryEntry = groceryRepository.findGroceryById(id);

    if (groceryEntry.isPresent()) {
      return groceryEntry.get();
    } else {
      log.error("Error accessing grocery: Grocery not found");
      return null;
    }
  }

  public List<Grocery> getGroceriesByUserId(String userId) {
    List<Grocery> groceries = groceryRepository.findGroceriesByUserId(userId);

    if (!groceries.isEmpty()) {
      return groceries;
    } else return null;
  }

  public Grocery createGrocery(
    String title,
    Unit unit,
    int portionSize,
    boolean includeInDishes,
    NutritionInformation nutritionInformation,
    String userId
  ) {
    Grocery grocery = new Grocery(
      title,
      unit,
      portionSize,
      includeInDishes,
      nutritionInformation,
      userId
    );

    groceryRepository.insert(grocery);
    log.info("Grocery " + grocery.getTitle() + " created");
    return grocery;
  }

  public Grocery updateGrocery(
    String id,
    String title,
    Unit unit,
    int portionSize,
    boolean includeInDishes,
    NutritionInformation nutritionInformation,
    String userId
  ) {
    Optional<Grocery> groceryEntry = groceryRepository.findGroceryById(id);

    if (groceryEntry.isPresent()) {
      Grocery grocery = groceryEntry.get();
      grocery.setTitle(title);
      grocery.setUnit(unit);
      grocery.setPortionSize(portionSize);
      grocery.setIncludeInDishes(includeInDishes);
      grocery.setNutritionInformation(nutritionInformation);
      grocery.setUserId(userId);
      groceryRepository.save(grocery);
      log.info("Grocery " + grocery.getTitle() + " updated");
      return grocery;
    } else {
      log.error("Error updating grocery: Grocery not found");
      return null;
    }
  }

  public Grocery deleteGrocery(String id) {
    Optional<Grocery> groceryEntry = groceryRepository.findGroceryById(id);

    if (groceryEntry.isPresent()) {
      Grocery grocery = groceryEntry.get();
      groceryRepository.deleteById(id);
      log.info("Grocery " + grocery.getTitle() + " deleted");
      return grocery;
    } else {
      log.error("Error deleting grocery: Grocery not found");
      return null;
    }
  }
}
