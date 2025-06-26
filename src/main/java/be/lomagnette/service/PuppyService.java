package be.lomagnette.service;


import be.lomagnette.ai.DogIdentification;
import be.lomagnette.ai.PuppyExpertAgent;
import be.lomagnette.ai.RequestCategory;
import be.lomagnette.ai.SpeechToTextAgent;
import be.lomagnette.entities.Puppy;
import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.ChatMessage;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.data.image.Image;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.tika.Tika;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Base64;

@ApplicationScoped
public class PuppyService {

    private final PuppyExpertAgent expert;
    private final UserService userService;
    private final ChatService chatService;
    private final PuppyRepository puppyRepository;
    private final DogIdentification dogIdentification;
    private final SpeechToTextAgent speechToTextAgent;
    private final Tika tika = new Tika();

    public PuppyService(PuppyExpertAgent expert,
                        UserService userService,
                        ChatService chatService,
                        PuppyRepository puppyRepository,
                        DogIdentification dogIdentification,
                        SpeechToTextAgent speechToTextAgent) {
        this.expert = expert;
        this.userService = userService;
        this.chatService = chatService;
        this.puppyRepository = puppyRepository;
        this.dogIdentification = dogIdentification;
        this.speechToTextAgent = speechToTextAgent;
    }

    public ChatMessage<PuppySearchForm> chat(ChatMessage<PuppySearchForm> form, File file, File audio) throws IOException {
        chatService.storeQuestions(form.text());
        var extraInfo = extractExtraInfo(file);
        var audioInf = extractExtraInfo(audio);

        var criteria = expert.fillForm(userService.getUser().id().toString(), form.text(), form.data(), extraInfo);
        var goodWithValues = puppyRepository.listAllGoodWithValues().stream().map(String::toLowerCase).toList();
        var goodWithFound = criteria.goodWith() == null ? new String[0] : criteria.goodWith();
        var filteredGoodWith = Arrays.stream(goodWithFound).filter(goodWithValues::contains).toArray(String[]::new);
        criteria = PuppySearchForm.setGoodWith(criteria, filteredGoodWith);

        var answer = expert.guidePuppySelection(form.text(), Puppy.search(criteria));
        return new ChatMessage<>(answer, criteria, RequestCategory.PUPPY);
    }

    public String extractExtraInfo(File file) throws IOException {
        if(file == null) { return "";}
        var fileType = tika.detect(file);
        Log.info(fileType);
        return switch (fileType){
            case "image/jpeg" -> getImageInfo(file);
            case "audio/webm", "audio/opus" -> speechToTextAgent.getText(file);
            default ->  "";
        };
    }

    public String getImageInfo(File file) throws IOException {
        var imageData = Files.readAllBytes(file.toPath());
        String base64Img = Base64.getEncoder().encodeToString(imageData);
        var image = Image.builder().base64Data(base64Img).build();
        var s = this.dogIdentification.describeDog(file);
        Log.info(s);
        return s;
    }
}
