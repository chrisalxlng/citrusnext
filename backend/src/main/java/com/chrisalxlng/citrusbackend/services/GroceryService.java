package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.Grocery;
import com.chrisalxlng.citrusbackend.models.GroceryResponse;
import com.chrisalxlng.citrusbackend.models.MacroNutrients;
import com.chrisalxlng.citrusbackend.models.Unit;
import com.chrisalxlng.citrusbackend.repositories.GroceryRepository;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class GroceryService {

  private final GroceryRepository groceryRepository;
  private final MacroNutrientsService macroNutrientsService;

  public List<GroceryResponse> getAllGroceries() {
    List<Grocery> groceries = groceryRepository.findAll();

    if (!groceries.isEmpty()) {
      List<GroceryResponse> groceriesResponse= groceries.stream()
        .map(grocery -> {
          int calories = 
            macroNutrientsService.getCalories(
              grocery.getMacroNutrientsPer100(), 
              grocery.getPortionSize()
            );
          String[] macroNutrientTags = macroNutrientsService.getMacroTags(
            grocery.getMacroNutrientsPer100(), 
            grocery.getPortionSize()
          );
          GroceryResponse groceryResponse = new GroceryResponse(
            grocery.getId(), 
            grocery.getTitle(), 
            grocery.getIconId(), 
            grocery.getUnit(), 
            grocery.getPortionSize(), 
            calories, 
            grocery.getMacroNutrientsPer100(), 
            macroNutrientTags, 
            grocery.getUserId()
          );

          return groceryResponse;
        }).collect(Collectors.toList());

      return groceriesResponse;
    } else return Collections.emptyList();
  }

  public GroceryResponse getGroceryById(String id) {
    Optional<Grocery> groceryEntry = groceryRepository.findGroceryById(id);

    if (groceryEntry.isPresent()) {
      int calories = 
        macroNutrientsService.getCalories(
          groceryEntry.get().getMacroNutrientsPer100(), 
          groceryEntry.get().getPortionSize()
        );
      String[] macroNutrientTags = macroNutrientsService.getMacroTags(
        groceryEntry.get().getMacroNutrientsPer100(), 
        groceryEntry.get().getPortionSize()
      );
      GroceryResponse grocery = new GroceryResponse(
        groceryEntry.get().getId(),
        groceryEntry.get().getTitle(), 
        groceryEntry.get().getIconId(), 
        groceryEntry.get().getUnit(), 
        groceryEntry.get().getPortionSize(), 
        calories, 
        groceryEntry.get().getMacroNutrientsPer100(), 
        macroNutrientTags, 
        groceryEntry.get().getUserId()
      );
      return grocery;
    } else {
      log.error("Error accessing grocery: Grocery not found");
      return null;
    }
  }

  public List<GroceryResponse> getGroceriesByUserId(String userId) {
    List<Grocery> groceries = groceryRepository.findGroceriesByUserId(userId);

    if (!groceries.isEmpty()) {
      List<GroceryResponse> groceriesResponse= groceries.stream()
        .map(grocery -> {
          int calories = 
            macroNutrientsService.getCalories(
              grocery.getMacroNutrientsPer100(), 
              grocery.getPortionSize()
            );
          String[] macroNutrientTags = macroNutrientsService.getMacroTags(
            grocery.getMacroNutrientsPer100(), 
            grocery.getPortionSize()
          );
          GroceryResponse groceryResponse = new GroceryResponse(
            grocery.getId(), 
            grocery.getTitle(), 
            grocery.getIconId(), 
            grocery.getUnit(), 
            grocery.getPortionSize(), 
            calories, 
            grocery.getMacroNutrientsPer100(), 
            macroNutrientTags, 
            grocery.getUserId()
          );

          return groceryResponse;
        }).collect(Collectors.toList());

      return groceriesResponse;
    } else return Collections.emptyList();
  }

  public Grocery createGrocery(
    String title,
    int iconId,
    Unit unit,
    int portionSize,
    MacroNutrients macroNutrientsPer100,
    String userId
  ) {
    Grocery grocery = new Grocery(
      title,
      iconId,
      unit,
      portionSize,
      macroNutrientsPer100,
      userId
    );

    groceryRepository.insert(grocery);
    log.info("Grocery " + grocery.getTitle() + " created");
    return grocery;
  }

  public Grocery updateGrocery(
    String id,
    String title,
    int iconId,
    Unit unit,
    int portionSize,
    MacroNutrients macroNutrientsPer100,
    String userId
  ) {
    Optional<Grocery> groceryEntry = groceryRepository.findGroceryById(id);

    if (groceryEntry.isPresent()) {
      Grocery grocery = groceryEntry.get();
      grocery.setTitle(title);
      grocery.setIconId(iconId);
      grocery.setUnit(unit);
      grocery.setPortionSize(portionSize);
      grocery.setMacroNutrientsPer100(macroNutrientsPer100);
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
