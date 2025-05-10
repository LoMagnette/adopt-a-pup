package be.lomagnette.service;

import dev.langchain4j.agent.tool.Tool;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class UserService {

    private static final User user = new User(UUID.randomUUID(), "Loïc", "Magnette","loic.magnette@oniryx.be", "+32488888888");

    @Tool("Get the current user information")
    public User getUser() {
        return user;
    }
}
