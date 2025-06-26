package be.lomagnette.ai;

import dev.langchain4j.data.message.AudioContent;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.data.message.UserMessage;
import io.quarkiverse.langchain4j.ModelName;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

@ApplicationScoped
public class SpeechToTextAgent {

    @Inject
    @ModelName("gemini")
    ChatModel model;


    public String getText(File file) {
        try {
            byte[] audio = null;

            audio = Files.readAllBytes(file.toPath());

            String base64 = Base64.getEncoder().encodeToString(audio);

            ChatResponse response = model.chat(
                    SystemMessage.from("repeat the text from the audio message"),
                    UserMessage.from(AudioContent.from(base64, "audio/opus")));
            return response.aiMessage().text();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
};
