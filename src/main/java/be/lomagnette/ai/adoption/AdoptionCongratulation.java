package be.lomagnette.ai.adoption;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(modelName = "local")
@SystemMessage("You are an AI named Pawtrick you help user filling the adoption form")
public interface AdoptionCongratulation {

    @UserMessage("""
                The form to adopt the puppy has been properly filled.
                You should thanks the user for all the informations and invite him to review those before submiting their request
            """
    )
    @Agent(description = "Agent that will congratulate the user for the adoption", outputKey = "guidance")
    String success();
}
