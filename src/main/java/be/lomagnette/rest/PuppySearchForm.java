package be.lomagnette.rest;

import be.lomagnette.entities.ActivityLevel;
import be.lomagnette.entities.Gender;
import be.lomagnette.entities.Size;
import dev.langchain4j.model.output.structured.Description;

public record PuppySearchForm(
        String breed,
        @Description("The minimum age of the puppy in month")
        Integer minAge,
        @Description("The maximum age of the puppy in month")
        Integer maxAge,
        Size size,
        Gender gender,
        ActivityLevel activityLevel,
        String[] goodWith,
        boolean onlyAvailable,
        String searchTerm) {

    public static PuppySearchForm setGoodWith(PuppySearchForm form, String[] goodWith) {
        Integer minAge = form.minAge;
        Integer maxAge = form.maxAge;
        if( minAge != null && maxAge != null && minAge > maxAge){
            minAge = null;
            maxAge = form.minAge;
        }
        return new PuppySearchForm(
                form.breed,
                minAge,
                maxAge,
                form.size,
                form.gender,
                form.activityLevel,
                goodWith,
                form.onlyAvailable,
                ""
        );
    }
}
