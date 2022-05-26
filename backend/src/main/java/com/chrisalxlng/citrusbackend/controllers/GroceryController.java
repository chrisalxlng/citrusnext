package com.chrisalxlng.citrusbackend.controllers;

import com.chrisalxlng.citrusbackend.models.Grocery;
import com.chrisalxlng.citrusbackend.services.GroceryService;
import java.net.URI;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
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
public class GroceryController {

  private final GroceryService groceryService;

  @GetMapping(value = "/groceries", produces = "application/json")
  public ResponseEntity<List<Grocery>> getAllGroceries() {
    try {
      String userId = SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getPrincipal()
        .toString();
      List<Grocery> groceries = groceryService.getGroceriesByUserId(userId);
      if (groceries == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return ResponseEntity.ok().body(groceries);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping(value = "/grocery/{id}", produces = "application/json")
  @PreAuthorize("@authenticationService.hasAccessToGrocery(#id)")
  public ResponseEntity<Grocery> getGrocery(@PathVariable @NonNull String id) {
    try {
      Grocery grocery = groceryService.getGroceryById(id);
      if (grocery == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      log.info(grocery.getTitle() + " accessed");
      return ResponseEntity.ok().body(grocery);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping(
    value = "/grocery",
    consumes = { "application/json" },
    produces = { "application/json" }
  )
  @PreAuthorize("@authenticationService.hasAccessToGrocery(#grocery)")
  public ResponseEntity<Grocery> createGrocery(@RequestBody Grocery grocery) {
    URI uri = URI.create(
      ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("api/grocery")
        .toUriString()
    );
    try {
      Grocery groceryResponse = groceryService.createGrocery(
        grocery.getTitle(),
        grocery.getIconId(),
        grocery.getUnit(),
        grocery.getPortionSize(),
        grocery.getMacroNutrientsPer100(),
        grocery.getUserId()
      );
      if (groceryResponse == null) return new ResponseEntity<>(
        HttpStatus.CONFLICT
      );
      return ResponseEntity.created(uri).body(groceryResponse);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping(
    value = "/grocery/{id}",
    consumes = { "application/json" },
    produces = { "application/json" }
  )
  @PreAuthorize("@authenticationService.hasAccessToGrocery(#id)")
  public ResponseEntity<Grocery> updateGrocery(
    @PathVariable @NonNull String id,
    @RequestBody Grocery grocery
  ) {
    URI uri = URI.create(
      ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("api/grocery")
        .toUriString()
    );
    try {
      Grocery groceryResponse = groceryService.updateGrocery(
        id,
        grocery.getTitle(),
        grocery.getIconId(),
        grocery.getUnit(),
        grocery.getPortionSize(),
        grocery.getMacroNutrientsPer100(),
        grocery.getUserId()
      );
      if (groceryResponse == null) return new ResponseEntity<>(
        HttpStatus.NOT_FOUND
      );
      return ResponseEntity.created(uri).body(groceryResponse);
    } catch (Exception exception) {
      System.out.println(exception);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @DeleteMapping(value = "/grocery/{id}")
  @PreAuthorize("@authenticationService.hasAccessToGrocery(#id)")
  public ResponseEntity<HttpStatus> deleteGrocery(
    @PathVariable @NonNull String id
  ) {
    try {
      Grocery grocery = groceryService.deleteGrocery(id);
      if (grocery == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
