package be.lomagnette.ai;

import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

@ApplicationScoped
public class DogIdentification {

    @Inject
    ChatLanguageModel chatModel;

    public String generateDogName(String breed) {
        return chatModel.chat("Can you find a dog name for a dog of this breed :" + breed + "?");
    }

    public String describeDog(File file) {

        try {
            var image = Files.readAllBytes(file.toPath());

            String base64Img = Base64.getEncoder().encodeToString(image);

            var request = ChatRequest.builder().messages(
                    UserMessage.from("""
                            You are given an image containing a dog. Your task is to analyze the image and do the following:
                            	1.	Identify the most likely breed of the dog in the image.
                            	2.	Provide a brief description of the breed, including common characteristics (e.g., temperament, size, typical coat, and behavior).
                            	3.	If you are unsure of the exact breed, list the top 2–3 most likely breeds with a confidence estimate for each.
                            """),
                    UserMessage.from(ImageContent.from("data:image/jpeg;base64," + base64Img))
            ).build();
            var answer = chatModel.chat(request);
            return answer.aiMessage().text();
        } catch (IOException e) {
            return null;
        }
    }
}
