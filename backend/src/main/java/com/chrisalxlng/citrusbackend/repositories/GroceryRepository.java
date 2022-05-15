package com.chrisalxlng.citrusbackend.repositories;

import com.chrisalxlng.citrusbackend.models.Grocery;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GroceryRepository extends MongoRepository<Grocery, String> {
  Optional<Grocery> findGroceryById(String id);
  List<Grocery> findGroceriesByUserId(String userId);
}
