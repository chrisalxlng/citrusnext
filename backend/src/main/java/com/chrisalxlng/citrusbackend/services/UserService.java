package com.chrisalxlng.citrusbackend.services;

import com.chrisalxlng.citrusbackend.models.User;
import com.chrisalxlng.citrusbackend.repositories.UserRepository;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

  private final UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Override
  public UserDetails loadUserByUsername(String username)
    throws UsernameNotFoundException {
    Optional<User> userEntry = userRepository.findUserByEmail(username);
    if (userEntry.isPresent()) {
      User user = userEntry.get();
      log.info("User " + username + " found in the database");
      Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
      return new org.springframework.security.core.userdetails.User(
        user.getId(),
        user.getPassword(),
        authorities
      );
    } else {
      String errorMessage = "User " + username + " does not exist";
      log.error(errorMessage);
      throw new UsernameNotFoundException(errorMessage);
    }
  }

  public List<User> getAllUsers() {
    List<User> users = userRepository.findAll();

    if (!users.isEmpty()) {
      return users;
    } else return null;
  }

  public User getUserById(String id) {
    Optional<User> userEntry = userRepository.findUserById(id);

    if (userEntry.isPresent()) {
      return userEntry.get();
    } else {
      log.error("Error accessing user: User not found");
      return null;
    }
  }

  public User getUserByEmail(String email) {
    Optional<User> userEntry = userRepository.findUserByEmail(email);

    if (userEntry.isPresent()) {
      return userEntry.get();
    } else {
      log.error("Error accessing user: User not found");
      return null;
    }
  }

  public User createUser(String name, String email, String password) {
    User user = new User(name, email, passwordEncoder.encode(password));

    if (!userRepository.findUserByEmail(email).isPresent()) {
      userRepository.insert(user);
      log.info("User " + user.getEmail() + " created");
      return user;
    } else {
      log.error("Error creating user: User already exists");
      return null;
    }
  }

  public User updateUser(
    String id,
    String name,
    String email,
    String password
  ) {
    Optional<User> userEntry = userRepository.findUserById(id);

    if (userEntry.isPresent()) {
      User user = userEntry.get();
      user.setName(name);
      user.setEmail(email);
      user.setPassword(password);
      userRepository.save(user);
      log.info("User " + user.getEmail() + " updated");
      return user;
    } else {
      log.error("Error updating user: User not found");
      return null;
    }
  }

  public User deleteUser(String id) {
    Optional<User> userEntry = userRepository.findUserById(id);

    if (userEntry.isPresent()) {
      User user = userEntry.get();
      userRepository.deleteById(id);
      log.info("User " + user.getEmail() + " deleted");
      return user;
    } else {
      log.error("Error deleting user: User not found");
      return null;
    }
  }
}
