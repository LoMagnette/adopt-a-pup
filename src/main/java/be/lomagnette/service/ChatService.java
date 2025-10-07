package be.lomagnette.service;

import be.lomagnette.ai.*;
import be.lomagnette.rest.ChatMessage;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.model.embedding.EmbeddingModel;
import io.quarkiverse.langchain4j.pgvector.PgVectorEmbeddingStore;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.Instant;

@ApplicationScoped
public class ChatService {

    private final PgVectorEmbeddingStore store;
    private final EmbeddingModel model;
    private final UserService userService;
    private final Bot bot;
    private final CategoryRouter router;
    private final PuppyParadiseAgent paradiseExpert;
    private final AdoptionAgent adoptionAgent;
    private final PuppyExpertAgent puppyExpertAgent;

    @Inject
    public ChatService(PgVectorEmbeddingStore store,
                       EmbeddingModel model,
                       UserService userService,
                       Bot bot,
                       CategoryRouter router,
                       PuppyParadiseAgent paradiseExpert,
                       AdoptionAgent adoptionAgent,
                       PuppyExpertAgent puppyExpertAgent) {

        this.store = store;
        this.model = model;
        this.userService = userService;
        this.bot = bot;
        this.router = router;
        this.paradiseExpert = paradiseExpert;
        this.adoptionAgent = adoptionAgent;
        this.puppyExpertAgent = puppyExpertAgent;
    }

    public ChatMessage<Void> chat(ChatMessage<Void> question) {
        storeQuestions(question.text());
        var category = router.classify(question.text());
        var answer =  switch (category){
            case PUPPY -> puppyExpertAgent.chat(question.text());
            case ADOPTION -> adoptionAgent.chat(question.text());
            case COMPANY -> paradiseExpert.chat(question.text());
        };
        return new ChatMessage<>(answer, null, category);
    }

    @Transactional
    public void storeQuestions(String question) {
        try {
            var documentSplitter = DocumentSplitters.recursive(500, 100);
            var user = userService.getUser();
            
            var doc = Document.from(question, 
                Metadata.from("user", user.id().toString())
                       .put("timestamp", Instant.now().toString())
                       .put("type", "user_question"));
            
            var segments = documentSplitter.split(doc);
            var embeddings = model.embedAll(segments);
            
            // Actually store the embeddings in the vector database
            store.addAll(embeddings.content(), segments);
            
            Log.info("Stored " + segments.size() + " question segments for user " + user.id());
            
        } catch (Exception e) {
            Log.error("Failed to store user question: " + e.getMessage());
            throw new RuntimeException("Unable to store user question", e);
        }
    }
}
