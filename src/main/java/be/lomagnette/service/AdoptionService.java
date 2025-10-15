package be.lomagnette.service;

import be.lomagnette.ai.AdoptionAgent;
import be.lomagnette.ai.RequestCategory;
import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.rest.ChatMessage;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Validator;

@ApplicationScoped
public class AdoptionService {

    private final AdoptionAgent expert;
    private final UserService userService;
    private final Validator validator;
    private final ChatService chatService;

    public AdoptionService(AdoptionAgent expert,
                           UserService userService,
                           Validator validator,
                           ChatService chatService) {
        this.expert = expert;
        this.userService = userService;
        this.validator = validator;
        this.chatService = chatService;
    }

    public ChatMessage<AdoptionRequest> chat(ChatMessage<AdoptionRequest> form) {
        chatService.storeQuestions(form.text());
        var updatedForm = this.expert.fillAdoptionForm(userService.getUser().id().toString(),form.text(), new AdoptionForm(form.data()));
        var validations = validator.validate(updatedForm);
        if (validations.isEmpty()) {
            var request = new AdoptionRequest(form.data().puppy,updatedForm);
            return new ChatMessage<>(expert.success(), request, RequestCategory.ADOPTION, expert.generateSummary(request));
        }else{
            var humanReadableErrors = this.expert.getHumanReadableErrors(validations);
            var answer = this.expert.helpUser(userService.getUser().id().toString(), humanReadableErrors, form.text());
            return new ChatMessage<>(answer,new AdoptionRequest(form.data().puppy,updatedForm), RequestCategory.ADOPTION);
        }

    }
}
