package be.lomagnette.service;

import be.lomagnette.ai.DogIdentification;
import be.lomagnette.ai.SpeechToTextAgent;
import dev.langchain4j.data.image.Image;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.tika.Tika;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

@ApplicationScoped
public class Utils {

    private final DogIdentification dogIdentification;
    private final SpeechToTextAgent speechToTextAgent;
    private final Tika tika = new Tika();

    public Utils(DogIdentification dogIdentification, SpeechToTextAgent speechToTextAgent) {
        this.dogIdentification = dogIdentification;
        this.speechToTextAgent = speechToTextAgent;
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
