package be.lomagnette.service;


import be.lomagnette.ai.puppy.PuppyExpertAiService;
import be.lomagnette.ai.RequestCategory;
import be.lomagnette.entities.Puppy;
import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.ChatMessage;
import be.lomagnette.rest.PuppySearchForm;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

@ApplicationScoped
public class PuppyService {

    private final PuppyExpertAiService expert;
    private final UserService userService;
    private final ChatService chatService;
    private final PuppyRepository puppyRepository;
    private final Utils utils;


    public PuppyService(PuppyExpertAiService expert,
                        UserService userService,
                        ChatService chatService,
                        PuppyRepository puppyRepository,
                        Utils utils) {
        this.expert = expert;
        this.userService = userService;
        this.chatService = chatService;
        this.puppyRepository = puppyRepository;
        this.utils = utils;
    }

    public ChatMessage<PuppySearchForm> chat(ChatMessage<PuppySearchForm> form, File file, File audio) throws IOException {
        chatService.storeQuestions(form.text());
        var extraInfo = utils.extractExtraInfo(file);
        var audioInf = utils.extractExtraInfo(audio);

        var criteria = expert.fillForm(userService.getUser().id().toString(), form.text(), form.data(), extraInfo);
        var goodWithValues = puppyRepository.listAllGoodWithValues().stream().map(String::toLowerCase).toList();
        var goodWithFound = criteria.goodWith() == null ? new String[0] : criteria.goodWith();
        var filteredGoodWith = Arrays.stream(goodWithFound).filter(goodWithValues::contains).toArray(String[]::new);
        criteria = PuppySearchForm.setGoodWith(criteria, filteredGoodWith);

        var answer = expert.guidePuppySelection(form.text(), Puppy.search(criteria));
        return new ChatMessage<>(answer, criteria, RequestCategory.PUPPY);
    }

}
