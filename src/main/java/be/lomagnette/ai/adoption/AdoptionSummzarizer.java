package be.lomagnette.ai.adoption;

import be.lomagnette.ai.UserMessagesRetrievalAugmentor;
import be.lomagnette.entities.Puppy;
import be.lomagnette.service.AdoptionForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(
        modelName = "gpt4",
        retrievalAugmentor = UserMessagesRetrievalAugmentor.class
)
@SystemMessage("You are an AI named Pawtrick you help user filling the adoption form")
public interface AdoptionSummzarizer {

    @UserMessage("""
            You are given a user request containing information to be displayed on a website. Your task is to generate a clean, well-structured, and visually appealing HTML fragment (not a full HTML document).
            
            Follow these strict instructions:
                1.	Use semantic HTML elements (<section>, <h2>, <p>, <ul>, etc.) to structure the content.
                2.	Organize the information into logical subsections, each with clear headings and grouped content.
                3.	Add minimal inline styling (e.g., padding, margin, font-weight) or use descriptive class names (like "highlight", "section-header", etc.) to enhance readability and visual structure — do not use embedded <style> tags.
                4.	Do not include <html>, <head>, or <body> tags. This is a fragment meant to be embedded into an existing page.
                5.	Do not output any Markdown or formatting blocks (like ```html). Return only the raw HTML fragment.
                6.	Use only the content provided — do not invent or infer any missing data.
            
            Your goal is to produce a fragment that looks polished, clear, and easy to integrate into a styled page.
            ----
            request: {updatedForm}
            puppy information: {puppy}
            """)
    @Agent(description = "Summarize the user adoption form", outputKey = "summary")
    String generateSummary(@V("updatedForm") AdoptionForm form,@V("puppy") Puppy puppy);
}
