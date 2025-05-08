package be.lomagnette.ai;

import be.lomagnette.service.UserService;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.DefaultRetrievalAugmentor;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.filter.Filter;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import jakarta.inject.Singleton;

import java.util.function.Supplier;

import static dev.langchain4j.store.embedding.filter.MetadataFilterBuilder.metadataKey;

@Singleton
public class UserMessagesRetrievalAugmentor implements Supplier<RetrievalAugmentor> {

    private final RetrievalAugmentor augmentor;

    UserMessagesRetrievalAugmentor(PgVectorEmbeddingStore store, EmbeddingModel model, UserService userService) {
        Filter onlyUser = metadataKey("user").isEqualTo(userService.getUser().id().toString());
        EmbeddingStoreContentRetriever contentRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingModel(model)
                .embeddingStore(store)
                .filter(onlyUser)
                .maxResults(5)
                .build();
        augmentor = DefaultRetrievalAugmentor
                .builder()
                .contentRetriever(contentRetriever)
                .build();
    }

    @Override
    public RetrievalAugmentor get() {
        return augmentor;
    }
}