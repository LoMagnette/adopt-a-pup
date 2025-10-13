package be.lomagnette.ai;

import be.lomagnette.entities.Puppy;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

import java.util.List;

public interface PuppyGuidanceExpert {

    @UserMessage("""
            You should try to guide the user into finding the right puppy.
            To do so you can ask question or provide description based on it's message and on the found puppies.
            ----
            user message: {request}
            found puppies: {puppies}
            """)
    @Agent("Expert to help people find the right puppy")
    String guidePuppySelection(@V("request") String message, @V("puppies") List<Puppy> puppies);
}
