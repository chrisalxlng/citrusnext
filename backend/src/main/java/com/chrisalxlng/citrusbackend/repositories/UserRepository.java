package com.chrisalxlng.citrusbackend.repositories;

import com.chrisalxlng.citrusbackend.models.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findUserByEmail(String email);
  Optional<User> findUserById(String id);
}
