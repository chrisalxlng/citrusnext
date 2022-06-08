package com.chrisalxlng.citrusbackend.controllers;

import com.chrisalxlng.citrusbackend.models.Dish;
import com.chrisalxlng.citrusbackend.models.DishResponse;
import com.chrisalxlng.citrusbackend.services.DishService;
import com.mongodb.lang.NonNull;
import java.net.URI;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@Slf4j
public class DishController {

  private final DishService dishService;

  @GetMapping(value = "/dishes", produces = "application/json")
  public ResponseEntity<List<DishResponse>> getAllDishes() {
    try {
      String userId = SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getPrincipal()
        .toString();
      List<DishResponse> dishes = dishService.getDishesByUserId(userId);
      if (dishes == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return ResponseEntity.ok().body(dishes);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping(value = "/dish/{id}", produces = "application/json")
  @PreAuthorize("@authenticationService.hasAccessToDish(#id)")
  public ResponseEntity<DishResponse> getDish(@PathVariable @NonNull String id) {
    try {
      DishResponse dish = dishService.getDishById(id);
      if (dish == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      log.info(dish.getTitle() + " accessed");
      return ResponseEntity.ok().body(dish);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping(
    value = "/dish",
    consumes = { "application/json" },
    produces = { "application/json" }
  )
  @PreAuthorize("@authenticationService.hasAccessToDish(#dish)")
  public ResponseEntity<Dish> createDish(@RequestBody Dish dish) {
    URI uri = URI.create(
      ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("api/dish")
        .toUriString()
    );
    try {
      Dish dishResponse = dishService.createDish(
        dish.getTitle(),
        dish.getIconId(),
        dish.getUnit(),
        dish.getPortionSize(),
        dish.getIngredients(),
        dish.getUserId()
      );
      if (dishResponse == null) return new ResponseEntity<>(
        HttpStatus.CONFLICT
      );
      return ResponseEntity.created(uri).body(dishResponse);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping(
    value = "/dish/{id}",
    consumes = { "application/json" },
    produces = { "application/json" }
  )
  @PreAuthorize("@authenticationService.hasAccessToDish(#id)")
  public ResponseEntity<Dish> updateDish(
    @PathVariable @NonNull String id,
    @RequestBody Dish dish
  ) {
    URI uri = URI.create(
      ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("api/dish")
        .toUriString()
    );
    try {
      Dish dishResponse = dishService.updateDish(
        id,
        dish.getTitle(),
        dish.getIconId(),
        dish.getUnit(),
        dish.getPortionSize(),
        dish.getIngredients(),
        dish.getUserId()
      );
      if (dishResponse == null) return new ResponseEntity<>(
        HttpStatus.NOT_FOUND
      );
      return ResponseEntity.created(uri).body(dishResponse);
    } catch (Exception exception) {
      System.out.println(exception);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @DeleteMapping(value = "/dish/{id}")
  @PreAuthorize("@authenticationService.hasAccessToDish(#id)")
  public ResponseEntity<HttpStatus> deleteDish(
    @PathVariable @NonNull String id
  ) {
    try {
      Dish dish = dishService.deleteDish(id);
      if (dish == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
