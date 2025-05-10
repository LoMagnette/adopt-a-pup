package be.lomagnette.service;


import be.lomagnette.ai.CategoryRouter;
import be.lomagnette.ai.PuppyExpert;
import be.lomagnette.ai.RequestCategory;
import be.lomagnette.entities.Puppy;
import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.ChatMessage;
import be.lomagnette.rest.PuppySearchForm;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Arrays;
import java.util.List;

@ApplicationScoped
public class PuppyService {

    private final PuppyExpert expert;
    private final ChatService chatService;
    private final UserService userService;
    private final PuppyRepository puppyRepository;

    public PuppyService(PuppyExpert expert, ChatService chatService, UserService userService, PuppyRepository repository, PuppyRepository puppyRepository) {
        this.expert = expert;
        this.chatService = chatService;
        this.userService = userService;
        this.puppyRepository = puppyRepository;
    }

    public ChatMessage<PuppySearchForm> chat(ChatMessage<PuppySearchForm> form) {
        var criteria = expert.search(userService.getUser().id().toString(), form.text(), form.data());
        var goodWithValues = puppyRepository.listAllGoodWithValues().stream().map(String::toLowerCase).toList();
        var filteredGoodWith = Arrays.stream(criteria.goodWith()).filter(goodWithValues::contains).toArray(String[]::new);
        criteria = PuppySearchForm.setGoodWith(criteria, filteredGoodWith);
        var answer = expert.guidePuppySelection(form.text(), Puppy.search(criteria));
        return new ChatMessage<>(answer, criteria, RequestCategory.PUPPY);
    }
}
