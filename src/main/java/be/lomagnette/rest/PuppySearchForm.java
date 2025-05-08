package be.lomagnette.rest;

public record PuppySearchForm(
        String breed,
        Integer minAge,
        Integer maxAge,
        String size,
        String gender,
        String activityLevel,
        String[] goodWith,
        boolean onlyAvailable,
        String searchTerm
) {
}
