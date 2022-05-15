package com.chrisalxlng.citrusbackend.filters;

import com.chrisalxlng.citrusbackend.util.TokenUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class CustomAuthenticationFilter
  extends UsernamePasswordAuthenticationFilter {

  private final AuthenticationManager authenticationManager;

  public CustomAuthenticationFilter(
    AuthenticationManager authenticationManager
  ) {
    this.authenticationManager = authenticationManager;
  }

  @Override
  public Authentication attemptAuthentication(
    HttpServletRequest request,
    HttpServletResponse response
  ) throws AuthenticationException {
    String username = request.getParameter("email");
    String password = request.getParameter("password");
    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
      username,
      password
    );

    return authenticationManager.authenticate(authenticationToken);
  }

  @Override
  protected void successfulAuthentication(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain chain,
    Authentication authentication
  ) throws IOException, ServletException {
    User user = (User) authentication.getPrincipal();

    String access_token = TokenUtil.generateToken(
      user.getUsername(),
      new Date(System.currentTimeMillis() + 10 * 60 * 1000),
      request.getRequestURL().toString()
    );
    String refresh_token = TokenUtil.generateToken(
      user.getUsername(),
      new Date(System.currentTimeMillis() + 14 * 24 * 60 * 60 * 1000),
      request.getRequestURL().toString()
    );

    Map<String, Object> content = new HashMap<>();
    Map<String, String> tokens = new HashMap<>();
    tokens.put("accessToken", access_token);
    tokens.put("refreshToken", refresh_token);
    content.put("userId", user.getUsername());
    content.put("tokens", tokens);
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    new ObjectMapper().writeValue(response.getOutputStream(), content);
  }
}
