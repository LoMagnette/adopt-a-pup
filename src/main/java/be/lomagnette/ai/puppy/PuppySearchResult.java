package be.lomagnette.ai.puppy;

import be.lomagnette.rest.PuppySearchForm;

public record PuppySearchResult(PuppySearchForm form, String answer) {
}
