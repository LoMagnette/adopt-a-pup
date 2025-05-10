package be.lomagnette.service;

import java.util.UUID;

public record User(UUID id, String firstName, String lastName, String email, String phoneNumber) {
}
