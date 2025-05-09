package be.lomagnette.ai;

import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.DefaultRetrievalAugmentor;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.filter.Filter;
import io.quarkiverse.langchain4j.pgvector.PgVectorEmbeddingStore;
import jakarta.inject.Singleton;

import java.util.function.Supplier;

import static dev.langchain4j.store.embedding.filter.MetadataFilterBuilder.metadataKey;

@Singleton
public class DocumentRetrievalAugmentor implements Supplier<RetrievalAugmentor> {

    private final RetrievalAugmentor augmentor;

    DocumentRetrievalAugmentor(PgVectorEmbeddingStore store, EmbeddingModel model) {
        Filter notUser = Filter.not(metadataKey("user").containsString(""));
        EmbeddingStoreContentRetriever contentRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingModel(model)
                .embeddingStore(store)
                .filter(notUser)
                .maxResults(3)
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
