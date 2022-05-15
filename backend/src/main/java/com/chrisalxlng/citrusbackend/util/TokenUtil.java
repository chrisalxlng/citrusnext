package com.chrisalxlng.citrusbackend.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import java.util.Date;

public class TokenUtil {

  public static String generateToken(
    String subject,
    Date expirationDate,
    String issuer
  ) {
    Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());

    return JWT
      .create()
      .withSubject(subject)
      .withExpiresAt(expirationDate)
      .withIssuer(issuer)
      .sign(algorithm);
  }
}
