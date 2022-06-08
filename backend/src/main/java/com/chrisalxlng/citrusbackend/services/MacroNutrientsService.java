package com.chrisalxlng.citrusbackend.services;

import java.util.Arrays;
import org.springframework.stereotype.Service;
import com.chrisalxlng.citrusbackend.models.MacroNutrients;

@Service
public class MacroNutrientsService {
  final int CARBOHYDRATES_CALORIES_FACTOR = 4;
  final int FATS_CALORIES_FACTOR = 9;
  final int PROTEINS_CALORIES_FACTOR = 4;

  final double CARBOHYDRATES_HIGH_BREAKPOINT = 0.7;
  final double CARBOHYDRATES_LOW_BREAKPOINT = 0.25;
  final double FATS_HIGH_BREAKPOINT = 0.35;
  final double FATS_LOW_BREAKPOINT = 0.25;
  final double PROTEINS_HIGH_BREAKPOINT = 0.3;
  final double PROTEINS_LOW_BREAKPOINT = 0.08;

  double getCarbohydratesInCalories(double carbohydrates) {
    return carbohydrates * CARBOHYDRATES_CALORIES_FACTOR;
  }

  double getFatsInCalories(double fats) {
    return fats * FATS_CALORIES_FACTOR;
  }

  double getProteinsInCalories(double proteins) {
    return proteins * PROTEINS_CALORIES_FACTOR;
  }

  double getCaloriesPer100(MacroNutrients macroNutrientsPer100) {
    double carbohydratesInCalories = 
      getCarbohydratesInCalories(macroNutrientsPer100.getCarbohydrates());
    double fatsInCalories = 
      getFatsInCalories(macroNutrientsPer100.getFats());
    double proteinsInCalories = 
      getProteinsInCalories(macroNutrientsPer100.getProteins());

    double caloriesPer100 = Math.round(carbohydratesInCalories + fatsInCalories + proteinsInCalories);

    return caloriesPer100;
  }

  int getCalories(MacroNutrients macroNutrientsPer100, int portionSize) {
    double caloriesPer100 = getCaloriesPer100(macroNutrientsPer100);
    int calories = (int) (caloriesPer100 / 100 * portionSize);

    return calories;
  }

  String[] getMacroTags(MacroNutrients macroNutrientsPer100, int portionSize) {
    int calories = getCalories(macroNutrientsPer100, portionSize);
    double carbohydratesInCalories = 
      getCarbohydratesInCalories(macroNutrientsPer100.getCarbohydrates());
    double fatsInCalories = 
      getFatsInCalories(macroNutrientsPer100.getFats());
    double proteinsInCalories = 
      getProteinsInCalories(macroNutrientsPer100.getProteins());

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
}
