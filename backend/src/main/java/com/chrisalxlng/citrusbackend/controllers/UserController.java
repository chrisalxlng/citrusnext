package com.chrisalxlng.citrusbackend.controllers;

import com.chrisalxlng.citrusbackend.models.User;
import com.chrisalxlng.citrusbackend.services.UserService;
import com.chrisalxlng.citrusbackend.util.TokenUtil;
import java.net.URI;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
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
public class UserController {

  private final UserService userService;

  @GetMapping(value = "/users", produces = "application/json")
  public ResponseEntity<List<User>> getAllUsers() {
    try {
      List<User> users = userService.getAllUsers();
      if (users == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return ResponseEntity.ok().body(users);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping(value = "/user/{id}", produces = "application/json")
  @PreAuthorize("@authenticationService.hasAccess(#id)")
  public ResponseEntity<User> getUser(@PathVariable @NonNull String id) {
    try {
      User user = userService.getUserById(id);
      if (user == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      log.info(user.getEmail() + " logged in");
      return ResponseEntity.ok().body(user);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping(
    value = "/user",
    consumes = { "application/json" },
    produces = { "application/json" }
  )
  public ResponseEntity<Map<String, Object>> createUser(HttpServletRequest request, @RequestBody User user) {
    URI uri = URI.create(
      ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("api/user")
        .toUriString()
    );
    try {
      User userResponse = userService.createUser(
        user.getName(),
        user.getEmail(),
        user.getPassword()
      );

      if (userResponse == null) return new ResponseEntity<>(
        HttpStatus.CONFLICT
      );

      String accessToken = TokenUtil.generateToken(
        user.getEmail(),
        new Date(System.currentTimeMillis() + 10 * 60 * 1000),
        request.getRequestURL().toString()
      );
      String refreshToken = TokenUtil.generateToken(
        user.getEmail(),
        new Date(System.currentTimeMillis() + 14 * 24 * 60 * 60 * 1000),
        request.getRequestURL().toString()
      );

      Map<String, Object> content = new HashMap<>();
      Map<String, String> tokens = new HashMap<>();
      tokens.put("accessToken", accessToken);
      tokens.put("refreshToken", refreshToken);
      content.put("user", userResponse);
      content.put("tokens", tokens);
      
      return ResponseEntity.created(uri).body(content);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping(
    value = "/user/{id}",
    consumes = { "application/json" },
    produces = { "application/json" }
  )
  @PreAuthorize("@authenticationService.hasAccess(#id)")
  public ResponseEntity<User> updateUser(
    @PathVariable @NonNull String id,
    @RequestBody User user
  ) {
    URI uri = URI.create(
      ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("api/user")
        .toUriString()
    );
    try {
      User userResponse = userService.updateUser(
        id,
        user.getName(),
        user.getEmail(),
        user.getPassword()
      );
      if (userResponse == null) return new ResponseEntity<>(
        HttpStatus.NOT_FOUND
      );
      return ResponseEntity.created(uri).body(userResponse);
    } catch (Exception exception) {
      System.out.println(exception);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @DeleteMapping(value = "/user/{id}")
  @PreAuthorize("@authenticationService.hasAccess(#id)")
  public ResponseEntity<HttpStatus> deleteUser(
    @PathVariable @NonNull String id
  ) {
    try {
      User user = userService.deleteUser(id);
      if (user == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception exception) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
