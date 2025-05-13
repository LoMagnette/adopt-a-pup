package be.lomagnette.service;

import be.lomagnette.ai.*;
import be.lomagnette.rest.ChatMessage;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.model.embedding.EmbeddingModel;
import io.quarkiverse.langchain4j.pgvector.PgVectorEmbeddingStore;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ChatService {


    private final PgVectorEmbeddingStore store;
    private final EmbeddingModel model;
    private final UserService userService;
    private final Bot bot;
    private final CategoryRouter router;
    private final PuppyParadiseExpert paradiseExpert;
    private final AdoptionExpert adoptionExpert;
    private final PuppyExpert puppyExpert;

    @Inject
    public ChatService(PgVectorEmbeddingStore store,
                       EmbeddingModel model,
                       UserService userService,
                       Bot bot,
                       CategoryRouter router,
                       PuppyParadiseExpert paradiseExpert,
                       AdoptionExpert adoptionExpert,
                       PuppyExpert puppyExpert) {

        this.store = store;
        this.model = model;
        this.userService = userService;
        this.bot = bot;
        this.router = router;
        this.paradiseExpert = paradiseExpert;
        this.adoptionExpert = adoptionExpert;
        this.puppyExpert = puppyExpert;
    }

    public ChatMessage<Void> chat(ChatMessage<Void> question) {
        storeQuestions(question.text());
        var category = router.classify(question.text());
        var answer =  switch (category){
            case PUPPY -> puppyExpert.chat(question.text());
            case ADOPTION -> adoptionExpert.chat(question.text());
            case COMPANY -> paradiseExpert.chat(question.text());
        };
        return new ChatMessage<>(answer, null, category);
    }

    public void storeQuestions(String question){
        var documentSplitter = DocumentSplitters.recursive(500, 100);
        var doc = Document.from(question, Metadata.from("user", userService.getUser().id().toString()));
        var segments = documentSplitter.split(doc);
        var embeddings = model.embedAll(segments);
    }
}
