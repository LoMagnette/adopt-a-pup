package be.lomagnette.service;


import be.lomagnette.ai.DogIdentification;
import be.lomagnette.ai.PuppyExpert;
import be.lomagnette.ai.RequestCategory;
import be.lomagnette.entities.Puppy;
import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.ChatMessage;
import be.lomagnette.rest.PuppySearchForm;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.File;
import java.util.Arrays;

@ApplicationScoped
public class PuppyService {

    private final PuppyExpert expert;
    private final UserService userService;
    private final PuppyRepository puppyRepository;
    private final DogIdentification dogIdentification;

    public PuppyService(PuppyExpert expert,
                        UserService userService,
                        PuppyRepository puppyRepository,
                        DogIdentification dogIdentification) {
        this.expert = expert;
        this.userService = userService;
        this.puppyRepository = puppyRepository;
        this.dogIdentification = dogIdentification;
    }

    public ChatMessage<PuppySearchForm> chat(ChatMessage<PuppySearchForm> form, File file) {
        var extraInfo="";
        if(file != null){
           extraInfo = dogIdentification.describeDog(file);
        }
        var criteria = expert.search(userService.getUser().id().toString(), form.text(), form.data(), extraInfo);
        var goodWithValues = puppyRepository.listAllGoodWithValues().stream().map(String::toLowerCase).toList();
        var goodWithFound = criteria.goodWith() == null ? new String[0] : criteria.goodWith();
        var filteredGoodWith = Arrays.stream(goodWithFound).filter(goodWithValues::contains).toArray(String[]::new);
        criteria = PuppySearchForm.setGoodWith(criteria, filteredGoodWith);
        var answer = expert.guidePuppySelection(form.text(), Puppy.search(criteria));
        return new ChatMessage<>(answer, criteria, RequestCategory.PUPPY);
    }
}
