package be.lomagnette.service;

import be.lomagnette.ai.AdoptionExpert;
import be.lomagnette.ai.RequestCategory;
import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.rest.ChatMessage;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Validator;

@ApplicationScoped
public class AdoptionService {

    private final AdoptionExpert expert;
    private final UserService userService;
    private final Validator validator;
    private final ChatService chatService;

    public AdoptionService(AdoptionExpert expert,
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
        var updatedForm = this.expert.fillAdoptionForm(userService.getUser().id().toString(),form.text(), form.data());
        updatedForm.setPuppy(form.data().getPuppy());
        var validations = validator.validate(updatedForm);
        if (validations.isEmpty()) {
            return new ChatMessage<>(expert.success(), updatedForm, RequestCategory.ADOPTION, expert.generateSummary(updatedForm));
        }else{
            var humanReadableErrors = this.expert.getHumanReadableErrors(validations);
            var answer = this.expert.helpUser(userService.getUser().id().toString(), humanReadableErrors, form.text());
            return new ChatMessage<>(answer,updatedForm, RequestCategory.ADOPTION);
        }

    }
}
