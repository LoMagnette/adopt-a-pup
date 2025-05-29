package be.lomagnette.ai;

import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(modelName = "local")
public interface CategoryRouter {

    @UserMessage("""
            Analyze the following user request and categorize it as 'puppy', 'adoption' or 'company'.
            Reply with only one of those words and nothing else.
            - puppy:Includes questions or content about finding the right puppy or breed, understanding breed characteristics,
                    matching breeds to user lifestyles, and advice for selecting a puppy.
            - adoption: Includes content about the steps to adopt a puppy, application processes, preparation advice, home checks, and post-adoption tips.
            - company: Content that provides information about the website puppy paradise, the company or organization behind it,
                       policies, contact details, and general news or updates.
            The user request is {request}.
            """)
    RequestCategory classify(String request);
}
