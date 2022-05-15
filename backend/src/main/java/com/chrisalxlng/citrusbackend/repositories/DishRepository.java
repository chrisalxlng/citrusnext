package com.chrisalxlng.citrusbackend.repositories;

import com.chrisalxlng.citrusbackend.models.Dish;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DishRepository extends MongoRepository<Dish, String> {
  Optional<Dish> findDishById(String id);
  List<Dish> findDishesByUserId(String userId);
}
