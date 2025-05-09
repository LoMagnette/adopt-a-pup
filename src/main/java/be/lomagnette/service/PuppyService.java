package be.lomagnette.service;


import be.lomagnette.ai.PuppyExpert;
import be.lomagnette.ai.RequestCategory;
import be.lomagnette.rest.ChatMessage;
import be.lomagnette.rest.PuppySearchForm;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PuppyService {

    private final PuppyExpert expert;

    public PuppyService(PuppyExpert expert) {
        this.expert = expert;
    }

    public ChatMessage<PuppySearchForm> helpFindThePerfectPup(String question, PuppySearchForm form) {
        var updatedForm = expert.search(null, question, form);
        var answer = expert.chat(question);
        return new ChatMessage<>(answer, updatedForm, RequestCategory.PUPPY);
    }

}
