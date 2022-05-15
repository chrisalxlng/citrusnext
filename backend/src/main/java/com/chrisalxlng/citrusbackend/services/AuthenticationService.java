package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.Dish;
import com.chrisalxlng.citrusbackend.models.Grocery;
import com.chrisalxlng.citrusbackend.models.MealDiaryEntry;
import com.chrisalxlng.citrusbackend.repositories.DishRepository;
import com.chrisalxlng.citrusbackend.repositories.GroceryRepository;
import com.chrisalxlng.citrusbackend.repositories.MealDiaryEntryRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class AuthenticationService {

  private final GroceryRepository groceryRepository;
  private final DishRepository dishRepository;
  private final MealDiaryEntryRepository entryRepository;

  public boolean hasAccess(String userId) {
    String principalUserId = SecurityContextHolder
      .getContext()
      .getAuthentication()
      .getPrincipal()
      .toString();
    if (principalUserId.equals(userId)) {
      log.info("Request authorized");
      return true;
    }
    log.error("Request not authorized");
    return false;
  }

  public boolean hasAccessToGrocery(String groceryId) {
    String principalUserId = SecurityContextHolder
      .getContext()
      .getAuthentication()
      .getPrincipal()
      .toString();
    String userId = groceryRepository
      .findGroceryById(groceryId)
      .get()
      .getUserId();
    if (principalUserId.equals(userId)) {
      log.info("Request authorized");
      return true;
    }
    log.error("Request not authorized");
    return false;
  }

  public boolean hasAccessToGrocery(Grocery grocery) {
    String principalUserId = SecurityContextHolder
      .getContext()
      .getAuthentication()
      .getPrincipal()
      .toString();
    String userId = grocery.getUserId();
    if (principalUserId.equals(userId)) {
      log.info("Request authorized");
      return true;
    }
    log.error("Request not authorized");
    return false;
  }

  public boolean hasAccessToDish(String dishId) {
    String principalUserId = SecurityContextHolder
      .getContext()
      .getAuthentication()
      .getPrincipal()
      .toString();
    String userId = dishRepository.findDishById(dishId).get().getUserId();
    if (principalUserId.equals(userId)) {
      log.info("Request authorized");
      return true;
    }
    log.error("Request not authorized");
    return false;
  }

  public boolean hasAccessToDish(Dish dish) {
    String principalUserId = SecurityContextHolder
      .getContext()
      .getAuthentication()
      .getPrincipal()
      .toString();
    String userId = dish.getUserId();
    if (principalUserId.equals(userId)) {
      log.info("Request authorized");
      return true;
    }
    log.error("Request not authorized");
    return false;
  }

  public boolean hasAccessToMealDiaryEntry(String entryId) {
    String principalUserId = SecurityContextHolder
      .getContext()
      .getAuthentication()
      .getPrincipal()
      .toString();
    String userId = entryRepository
      .findMealDiaryEntryById(entryId)
      .get()
      .getUserId();
    if (principalUserId.equals(userId)) {
      log.info("Request authorized");
      return true;
    }
    log.error("Request not authorized");
    return false;
  }

  public boolean hasAccessToMealDiaryEntry(MealDiaryEntry entry) {
    String principalUserId = SecurityContextHolder
      .getContext()
      .getAuthentication()
      .getPrincipal()
      .toString();
    String userId = entry.getUserId();
    if (principalUserId.equals(userId)) {
      log.info("Request authorized");
      return true;
    }
    log.error("Request not authorized");
    return false;
  }
}
