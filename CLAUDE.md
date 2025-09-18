# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (Java/Quarkus)
- **Development**: `./mvnw quarkus:dev` - Runs in dev mode with live reload at http://localhost:8080
- **Build**: `./mvnw package` - Packages the application
- **Test**: `./mvnw test` - Runs unit tests
- **Native Build**: `./mvnw package -Dnative` - Creates native executable

### Frontend (Angular)
Navigate to `src/main/webui/` for Angular commands:
- **Development**: `npm start` or `ng serve` - Runs dev server (integrated with Quarkus via Quinoa)
- **Build**: `npm run build` or `ng build`
- **Test**: `npm test` or `ng test`

### Full Stack Development
- Run `./mvnw quarkus:dev` from root - Quinoa automatically handles Angular build and serves both frontend and backend

## Architecture

This is a full-stack puppy adoption application built with:

### Backend Stack
- **Quarkus** (Java 21) - Backend framework with REST endpoints under `/api`
- **LangChain4j** - AI integration with multiple providers (OpenAI, Ollama, Gemini)
- **Hibernate ORM with Panache** - Data persistence
- **PostgreSQL** - Database with pgvector for embeddings
- **Easy RAG** - Document retrieval system using `easy-rag-catalog/` documents

### Frontend Stack
- **Angular 19** - Frontend framework
- **Quinoa** - Integration layer between Quarkus and Angular
- **Bootstrap/SCSS** - Styling

### AI System Architecture
The application uses a sophisticated AI chat system with:

1. **Category Router** (`CategoryRouter.java`): Classifies user messages into `puppy`, `adoption`, or `company` categories
2. **Specialized Agents**:
   - `PuppyExpertAgent`: Handles breed-related questions
   - `AdoptionAgent`: Manages adoption process inquiries
   - `PuppyParadiseAgent`: Company information
   - `SpeechToTextAgent`: Audio processing support
3. **RAG System**: Uses Easy RAG with pgvector embeddings for document retrieval
4. **Chat Service** (`ChatService.java`): Orchestrates routing and response generation

### Key Components
- **Entities**: `Puppy`, `AdoptionRequest` with enums for `ActivityLevel`, `Size`, `Gender`
- **Services**: Business logic layer with `ChatService`, `PuppyService`, `AdoptionService`
- **REST Resources**: API endpoints in `rest/` package
- **Frontend Components**: Angular components for puppy browsing, chat, and adoption forms

### Configuration
- Main config in `application.properties`
- AI models configurable (OpenAI GPT-4o, Ollama phi4-mini, Gemini)
- RAG embeddings stored in PostgreSQL with reuse enabled
- Chat memory window limited to 30 messages

### Data Flow
1. Frontend Angular app routes requests through Quinoa integration
2. REST endpoints in `/api` handle HTTP requests
3. Services coordinate business logic and AI agent calls
4. AI agents use RAG system for context-aware responses
5. PostgreSQL stores application data and embeddings

The application supports audio input processing and has TODO items for MCP integration and audio responses.