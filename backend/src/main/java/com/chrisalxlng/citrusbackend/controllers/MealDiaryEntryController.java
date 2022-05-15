package com.chrisalxlng.citrusbackend.controllers;

import com.chrisalxlng.citrusbackend.models.MealDiaryEntry;
import com.chrisalxlng.citrusbackend.services.MealDiaryEntryService;
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
public class MealDiaryEntryController {

  private final MealDiaryEntryService mealDiaryEntryService;

  @GetMapping(value = "/diary", produces = "application/json")
  public ResponseEntity<List<MealDiaryEntry>> getAllEntries() {
    try {
      String userId = SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getPrincipal()
        .toString();
      List<MealDiaryEntry> entries = mealDiaryEntryService.getEntriesByUserId(
        userId
      );
      if (entries == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return ResponseEntity.ok().body(entries);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping(value = "/diary/{id}", produces = "application/json")
  @PreAuthorize("@authenticationService.hasAccessToDish(#id)")
  public ResponseEntity<MealDiaryEntry> getEntry(
    @PathVariable @NonNull String id
  ) {
    try {
      MealDiaryEntry entry = mealDiaryEntryService.getEntryById(id);
      if (entry == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      log.info("MealDiaryEntry accessed");
      return ResponseEntity.ok().body(entry);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping(
    value = "/diary",
    consumes = { "application/json" },
    produces = { "application/json" }
  )
  @PreAuthorize("@authenticationService.hasAccessToMealDiaryEntry(#entry)")
  public ResponseEntity<MealDiaryEntry> createEntry(
    @RequestBody MealDiaryEntry entry
  ) {
    URI uri = URI.create(
      ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("api/diary")
        .toUriString()
    );
    try {
      MealDiaryEntry entryResponse = mealDiaryEntryService.createEntry(
        entry.getDate(),
        entry.getMeals(),
        entry.getUserId()
      );
      if (entryResponse == null) return new ResponseEntity<>(
        HttpStatus.CONFLICT
      );
      return ResponseEntity.created(uri).body(entryResponse);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping(
    value = "/diary/{id}",
    consumes = { "application/json" },
    produces = { "application/json" }
  )
  @PreAuthorize("@authenticationService.hasAccessToMealDiaryEntry(#id)")
  public ResponseEntity<MealDiaryEntry> updateEntry(
    @PathVariable @NonNull String id,
    @RequestBody MealDiaryEntry entry
  ) {
    URI uri = URI.create(
      ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("api/diary")
        .toUriString()
    );
    try {
      MealDiaryEntry entryResponse = mealDiaryEntryService.updateEntry(
        id,
        entry.getDate(),
        entry.getMeals(),
        entry.getUserId()
      );
      if (entryResponse == null) return new ResponseEntity<>(
        HttpStatus.NOT_FOUND
      );
      return ResponseEntity.created(uri).body(entryResponse);
    } catch (Exception exception) {
      System.out.println(exception);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @DeleteMapping(value = "/diary/{id}")
  @PreAuthorize("@authenticationService.hasAccessToMealDiaryEntry(#id)")
  public ResponseEntity<HttpStatus> deleteEntry(
    @PathVariable @NonNull String id
  ) {
    try {
      MealDiaryEntry entry = mealDiaryEntryService.deleteEntry(id);
      if (entry == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
