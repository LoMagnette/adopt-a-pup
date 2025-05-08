package be.lomagnette.service;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class UserService {

    private static final User user = new User(UUID.randomUUID(), "Loïc");

    public User getUser() {
        return user;
    }
}
