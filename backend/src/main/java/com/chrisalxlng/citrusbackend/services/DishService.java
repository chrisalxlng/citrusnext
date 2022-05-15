package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.Dish;
import com.chrisalxlng.citrusbackend.models.Ingredient;
import com.chrisalxlng.citrusbackend.models.Unit;
import com.chrisalxlng.citrusbackend.repositories.DishRepository;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class DishService {

  private final DishRepository dishRepository;

  public List<Dish> getAllDishes() {
    List<Dish> dishes = dishRepository.findAll();

    if (!dishes.isEmpty()) {
      return dishes;
    } else return null;
  }

  public Dish getDishById(String id) {
    Optional<Dish> dishEntry = dishRepository.findDishById(id);

    if (dishEntry.isPresent()) {
      return dishEntry.get();
    } else {
      log.error("Error accessing dish: Dish not found");
      return null;
    }
  }

  public List<Dish> getDishesByUserId(String userId) {
    List<Dish> dishes = dishRepository.findDishesByUserId(userId);

    if (!dishes.isEmpty()) {
      return dishes;
    } else return null;
  }

  public Dish createDish(
    String title,
    Unit unit,
    int portionSize,
    Ingredient[] ingredients,
    String userId
  ) {
    Dish dish = new Dish(title, unit, portionSize, ingredients, userId);

    dishRepository.insert(dish);
    log.info("Dish " + dish.getTitle() + " created");
    return dish;
  }

  public Dish updateDish(
    String id,
    String title,
    Unit unit,
    int portionSize,
    Ingredient[] ingredients,
    String userId
  ) {
    Optional<Dish> dishEntry = dishRepository.findDishById(id);

    if (dishEntry.isPresent()) {
      Dish dish = dishEntry.get();
      dish.setTitle(title);
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
