package be.lomagnette.service;

import be.lomagnette.ai.*;
import be.lomagnette.rest.ChatMessage;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import io.quarkiverse.langchain4j.pgvector.PgVectorEmbeddingStore;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class ChatService {


    private final PgVectorEmbeddingStore store;
    private final EmbeddingModel model;
    private final UserService userService;
    private final Bot bot;
    private final CategoryRouter router;
    private final PuppyExpert puppyExpert;
    private final PuppyParadiseExpert paradiseExpert;
    private final AdoptionExpert adoptionExpert;

    @Inject
    public ChatService(PgVectorEmbeddingStore store,
                       EmbeddingModel model,
                       UserService userService,
                       Bot bot,
                       CategoryRouter router,
                       PuppyExpert puppyExpert,
                       PuppyParadiseExpert paradiseExpert,
                       AdoptionExpert adoptionExpert) {

        this.store = store;
        this.model = model;
        this.userService = userService;
        this.bot = bot;
        this.router = router;
        this.puppyExpert = puppyExpert;
        this.paradiseExpert = paradiseExpert;
        this.adoptionExpert = adoptionExpert;
    }

    public ChatMessage<Void> chat(String question) {
        storeQuestions(question);
        String answer = switch (router.classify(question)){
            case PUPPY -> "Puppy";
            case ADOPTION -> "Adoption";
            case COMPANY -> paradiseExpert.chat(question);
        };
        return new ChatMessage<>(answer, null);
    }

    private void storeQuestions(String question){
        var documentSplitter = DocumentSplitters.recursive(500, 100);
        var doc = Document.from(question, Metadata.from("user", userService.getUser().id().toString()));
        var segments = documentSplitter.split(doc);
        var embeddings = model.embedAll(segments);
    }
}
