package be.lomagnette.ai.adoption;

import be.lomagnette.entities.AdoptionRequest;

public record AdoptionProcessResult(String message, AdoptionRequest form, String summary) {
}
