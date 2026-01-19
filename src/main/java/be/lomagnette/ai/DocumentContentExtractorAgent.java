package be.lomagnette.ai;

import dev.langchain4j.data.image.Image;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(modelName = "gpt4", chatMemoryProviderSupplier = RegisterAiService.NoChatMemoryProviderSupplier.class)
@SystemMessage("Extract and summarize text from the provided image.")
public interface DocumentContentExtractorAgent {
    @UserMessage("""
            Extract the content of this document.
           """)
    String extractReceiptData(Image image);
}
