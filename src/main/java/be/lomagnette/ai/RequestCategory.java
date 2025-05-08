package be.lomagnette.ai;

import dev.langchain4j.model.output.structured.Description;

public enum RequestCategory {
    @Description("""
            Includes questions or content about finding the right puppy or breed, understanding breed characteristics,
            matching breeds to user lifestyles, and advice for selecting a puppy.
            """)
    PUPPY,
    @Description("""
            Includes content about the steps to adopt a puppy, application processes, preparation advice, home checks, and post-adoption tips.
            """)
    ADOPTION,
    @Description("""
            Content that provides information about the website itself, the company or organization behind it,
            policies, contact details, and general news or updates.
            """)
    COMPANY
}
