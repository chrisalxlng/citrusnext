package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.Grocery;
import com.chrisalxlng.citrusbackend.models.MacroNutrients;
import com.chrisalxlng.citrusbackend.models.Unit;
import com.chrisalxlng.citrusbackend.repositories.GroceryRepository;
import java.util.Arrays;
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

  final int CARBOHYDRATES_CALORIES_FACTOR = 4;
  final int FATS_CALORIES_FACTOR = 9;
  final int PROTEIN_CALORIES_FACTOR = 4;

  final double CARBOHYDRATES_HIGH_BREAKPOINT = 0.7;
  final double CARBOHYDRATES_LOW_BREAKPOINT = 0.25;
  final double FATS_HIGH_BREAKPOINT = 0.35;
  final double FATS_LOW_BREAKPOINT = 0.25;
  final double PROTEINS_HIGH_BREAKPOINT = 0.3;
  final double PROTEINS_LOW_BREAKPOINT = 0.08;

  String[] getMacroTags(
    int calories, 
    double carbohydratesInCalories, 
    double fatsInCalories, 
    double proteinsInCalories
  ) {
    double highCarbTagQuotient = (carbohydratesInCalories / calories) - CARBOHYDRATES_HIGH_BREAKPOINT;
    double lowCarbTagQuotient = CARBOHYDRATES_LOW_BREAKPOINT - (carbohydratesInCalories / calories);
    double highFatTagQuotient = (fatsInCalories / calories) - FATS_HIGH_BREAKPOINT;
    double lowFatTagQuotient = FATS_LOW_BREAKPOINT - (fatsInCalories / calories);
    double highProteinTagQuotient = (proteinsInCalories / calories) - PROTEINS_HIGH_BREAKPOINT;
    double lowProteinTagQuotient = PROTEINS_LOW_BREAKPOINT - (proteinsInCalories / calories);

    class MacroTagBreakpoint {
      String key;
      double quotient;

      MacroTagBreakpoint(String key, double quotient) {
        this.key = key;
        this.quotient = quotient;
      }
    }

    MacroTagBreakpoint[] tagBreakpoints = {
      new MacroTagBreakpoint("high_carb", highCarbTagQuotient),
      new MacroTagBreakpoint("low_carb", lowCarbTagQuotient),
      new MacroTagBreakpoint("high_fat", highFatTagQuotient),
      new MacroTagBreakpoint("low_fat", lowFatTagQuotient),
      new MacroTagBreakpoint("high_protein", highProteinTagQuotient),
      new MacroTagBreakpoint("low_protein", lowProteinTagQuotient),
    };    

    MacroTagBreakpoint[] filteredTagBreakpoints = 
      Arrays.stream(tagBreakpoints)
            .filter(tag -> tag.quotient > 0)
            .toArray(size -> new MacroTagBreakpoint[size]);

    MacroTagBreakpoint[] sortedTagBreakpoints = filteredTagBreakpoints;
    Arrays.sort(sortedTagBreakpoints, (tag1, tag2) -> (tag1.quotient < tag2.quotient) ? (1) : (-1));

    String[] filteredMacroTags = 
      Arrays.stream(sortedTagBreakpoints)
            .map(tag -> tag.key)
            .toArray(size -> new String[size]);
    String[] balancedMacroTag = {"balanced_macros"};
    
    String[] macroNutrientTags = (filteredMacroTags.length == 0) ? balancedMacroTag : filteredMacroTags;

    return macroNutrientTags;
  }

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
    int iconId,
    Unit unit,
    int portionSize,
    MacroNutrients macroNutrientsPer100,
    String userId
  ) {
    double carbohydratesInCalories = macroNutrientsPer100.getCarbohydrates() * CARBOHYDRATES_CALORIES_FACTOR;
    double fatsInCalories = macroNutrientsPer100.getFats() * FATS_CALORIES_FACTOR;
    double proteinsInCalories = macroNutrientsPer100.getProteins() * PROTEIN_CALORIES_FACTOR;

    double caloriesPer100Sum = Math.round(carbohydratesInCalories + fatsInCalories + proteinsInCalories);
    int caloriesPer100 = (int) caloriesPer100Sum;
    int calories = (int) (caloriesPer100Sum / 100 * portionSize);

    String[] macroNutrientTags = 
      getMacroTags(caloriesPer100, carbohydratesInCalories, fatsInCalories, proteinsInCalories);

    Grocery grocery = new Grocery(
      title,
      iconId,
      unit,
      portionSize,
      calories,
      macroNutrientsPer100,
      macroNutrientTags,
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
      double carbohydratesInCalories = macroNutrientsPer100.getCarbohydrates() * CARBOHYDRATES_CALORIES_FACTOR;
      double fatsInCalories = macroNutrientsPer100.getFats() * FATS_CALORIES_FACTOR;
      double proteinsInCalories = macroNutrientsPer100.getProteins() * PROTEIN_CALORIES_FACTOR;

      double caloriesPer100Sum = Math.round(carbohydratesInCalories + fatsInCalories + proteinsInCalories);
      int caloriesPer100 = (int) caloriesPer100Sum;
      int calories = (int) (caloriesPer100Sum / 100 * portionSize);

      String[] macroNutrientTags = 
        getMacroTags(caloriesPer100, carbohydratesInCalories, fatsInCalories, proteinsInCalories);

      Grocery grocery = groceryEntry.get();
      grocery.setTitle(title);
      grocery.setUnit(unit);
      grocery.setPortionSize(portionSize);
      grocery.setCalories(calories);
      grocery.setMacroNutrientsPer100(macroNutrientsPer100);
      grocery.setMacroNutrientTags(macroNutrientTags);
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
