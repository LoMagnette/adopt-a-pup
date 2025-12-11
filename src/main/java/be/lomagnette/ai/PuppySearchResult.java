package be.lomagnette.ai;

import be.lomagnette.rest.PuppySearchForm;

public record PuppySearchResult(PuppySearchForm form, String answer) {
}
