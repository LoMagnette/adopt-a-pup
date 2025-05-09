package be.lomagnette.rest;

import dev.langchain4j.model.output.structured.Description;

public record PuppySearchForm(
        String breed,
        @Description("The minimum age of the puppy in month")
        Integer minAge,
        @Description("The maximum age of the puppy in month")
        Integer maxAge,
        String size,
        String gender,
        String activityLevel,
        String[] goodWith,
        boolean onlyAvailable,
        String searchTerm) {

    @Override
    public String toString() {
        return "PuppySearchForm[" +
                "breed=" + breed + ", " +
                "minAge=" + minAge + ", " +
                "maxAge=" + maxAge + ", " +
                "size=" + size + ", " +
                "gender=" + gender + ", " +
                "activityLevel=" + activityLevel + ", " +
                "goodWith=" + goodWith + ", " +
                "onlyAvailable=" + onlyAvailable + ", " +
                "searchTerm=" + searchTerm + ']';
    }

}
