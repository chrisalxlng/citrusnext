package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.Dish;
import com.chrisalxlng.citrusbackend.models.DishResponse;
import com.chrisalxlng.citrusbackend.models.Ingredient;
import com.chrisalxlng.citrusbackend.models.IngredientResponse;
import com.chrisalxlng.citrusbackend.models.MacroNutrients;
import com.chrisalxlng.citrusbackend.models.Unit;
import com.chrisalxlng.citrusbackend.repositories.DishRepository;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class DishService {

  private final DishRepository dishRepository;
  private final MacroNutrientsService macroNutrientsService;
  private final GroceryService groceryService;

  IngredientResponse[] getIngredientResponses(Ingredient[] ingredients) {
    List<IngredientResponse> ingredientResponses =
      Stream.of(ingredients)
        .map(ingredient -> new IngredientResponse(
          groceryService.getGroceryById(ingredient.getGroceryId()), 
          ingredient.getQuantity()
        )).collect(Collectors.toList());

    return ingredientResponses.toArray(size -> new IngredientResponse[size]);
  }

  MacroNutrients getMacroNutrientsPer100(Ingredient[] ingredients) {
    class MacrosPer100OfIngredients {
      MacroNutrients macroNutrients;
      double quantity;

      MacrosPer100OfIngredients(MacroNutrients macroNutrients, double quantity) {
        this.macroNutrients = macroNutrients;
        this.quantity = quantity;
      }
    }

    List<MacrosPer100OfIngredients> macroNutrientsPer100List = Stream.of(ingredients).map(ingredient -> {
      MacroNutrients macroNutrients = 
        groceryService.getGroceryById(ingredient.getGroceryId()).getMacroNutrientsPer100();

      MacrosPer100OfIngredients macroNutrientsPer100 = 
        new MacrosPer100OfIngredients(
          macroNutrients, 
          ingredient.getQuantity()
        );

      return macroNutrientsPer100;
    }).collect(Collectors.toList());

    List<Double> quantities = 
      macroNutrientsPer100List.stream().map(macro -> macro.quantity).collect(Collectors.toList());

    double totalQuantity = 
      quantities.stream().reduce((a, b) -> a + b).get();

    double carbohydratesPer100 = 
      macroNutrientsPer100List
        .stream()
        .map(macro -> macro.macroNutrients.getCarbohydrates() * macro.quantity)
        .reduce((a, b) -> a + b)
        .get() / totalQuantity;

    double fatsPer100 = 
      macroNutrientsPer100List
        .stream()
        .map(macro -> macro.macroNutrients.getFats() * macro.quantity)
        .reduce((a, b) -> a + b)
        .get() / totalQuantity;

    double proteinsPer100 = 
      macroNutrientsPer100List
        .stream()
        .map(macro -> macro.macroNutrients.getProteins() * macro.quantity)
        .reduce((a, b) -> a + b)
        .get() / totalQuantity;

    MacroNutrients macroNutrientsPer100 = 
      new MacroNutrients(carbohydratesPer100, fatsPer100, proteinsPer100);

    return macroNutrientsPer100;
  }  

  public List<DishResponse> getAllDishes() {
    List<Dish> dishes = dishRepository.findAll();

    if (!dishes.isEmpty()) {
      List<DishResponse> dishesResponse= dishes.stream()
        .map(dish -> {
          MacroNutrients macroNutrientsPer100 = getMacroNutrientsPer100(dish.getIngredients());
          int calories = 
            macroNutrientsService.getCalories(
              macroNutrientsPer100, 
              dish.getPortionSize()
            );
          String[] macroNutrientTags = macroNutrientsService.getMacroTags(
            macroNutrientsPer100, 
            dish.getPortionSize()
          );
          DishResponse dishResponse = new DishResponse(
            dish.getId(), 
            dish.getTitle(), 
            dish.getIconId(), 
            dish.getUnit(), 
            dish.getPortionSize(), 
            calories, 
            macroNutrientsPer100, 
            macroNutrientTags,
            getIngredientResponses(dish.getIngredients()),
            dish.getUserId()
          );

          return dishResponse;
        }).collect(Collectors.toList());

      return dishesResponse;
    } else return Collections.emptyList();
  }

  public DishResponse getDishById(String id) {
    Optional<Dish> dishEntry = dishRepository.findDishById(id);

    if (dishEntry.isPresent()) {
      MacroNutrients macroNutrientsPer100 = getMacroNutrientsPer100(dishEntry.get().getIngredients());

      int calories = 
        macroNutrientsService.getCalories(
          macroNutrientsPer100, 
          dishEntry.get().getPortionSize()
        );
      String[] macroNutrientTags = macroNutrientsService.getMacroTags(
        macroNutrientsPer100, 
        dishEntry.get().getPortionSize()
      );
      DishResponse dishResponse = new DishResponse(
        dishEntry.get().getId(), 
        dishEntry.get().getTitle(), 
        dishEntry.get().getIconId(), 
        dishEntry.get().getUnit(), 
        dishEntry.get().getPortionSize(), 
        calories, 
        macroNutrientsPer100, 
        macroNutrientTags,
        getIngredientResponses(dishEntry.get().getIngredients()),
        dishEntry.get().getUserId()
      );

      return dishResponse;
    } else {
      log.error("Error accessing dish: Dish not found");
      return null;
    }
  }

  public List<DishResponse> getDishesByUserId(String userId) {
    List<Dish> dishes = dishRepository.findDishesByUserId(userId);

    if (!dishes.isEmpty()) {
      List<DishResponse> dishesResponse= dishes.stream()
        .map(dish -> {
          MacroNutrients macroNutrientsPer100 = getMacroNutrientsPer100(dish.getIngredients());
          int calories = 
            macroNutrientsService.getCalories(
              macroNutrientsPer100, 
              dish.getPortionSize()
            );
          String[] macroNutrientTags = macroNutrientsService.getMacroTags(
            macroNutrientsPer100, 
            dish.getPortionSize()
          );
          DishResponse dishResponse = new DishResponse(
            dish.getId(), 
            dish.getTitle(), 
            dish.getIconId(), 
            dish.getUnit(), 
            dish.getPortionSize(), 
            calories, 
            macroNutrientsPer100, 
            macroNutrientTags,
            getIngredientResponses(dish.getIngredients()),
            dish.getUserId()
          );

          return dishResponse;
        }).collect(Collectors.toList());

      return dishesResponse;
    } else return Collections.emptyList();
  }

  public Dish createDish(
    String title,
    int iconId,
    Unit unit,
    int portionSize,
    Ingredient[] ingredients,
    String userId
  ) {
    Dish dish = new Dish(
      title,
      iconId,
      unit,
      portionSize,
      ingredients,
      userId
    );

    dishRepository.insert(dish);
    log.info("Dish " + dish.getTitle() + " created");
    return dish;
  }

  public Dish updateDish(
    String id,
    String title,
    int iconId,
    Unit unit,
    int portionSize,
    Ingredient[] ingredients,
    String userId
  ) {
    Optional<Dish> dishEntry = dishRepository.findDishById(id);

    if (dishEntry.isPresent()) {
      Dish dish = dishEntry.get();
      dish.setTitle(title);
      dish.setIconId(iconId);
      dish.setUnit(unit);
      dish.setPortionSize(portionSize);
      dish.setIngredients(ingredients);
      dish.setUserId(userId);
      dishRepository.save(dish);
      log.info("Dish " + dish.getTitle() + " updated");
      return dish;
    } else {
      log.error("Error updating dish: Dish not found");
      return null;
    }
  }

  public Dish deleteDish(String id) {
    Optional<Dish> dishEntry = dishRepository.findDishById(id);

    if (dishEntry.isPresent()) {
      Dish dish = dishEntry.get();
      dishRepository.deleteById(id);
      log.info("Dish " + dish.getTitle() + " deleted");
      return dish;
    } else {
      log.error("Error deleting dish: Dish not found");
      return null;
    }
  }
}
