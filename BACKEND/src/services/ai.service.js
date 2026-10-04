import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY
});


const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
)

const agent = createAgent({
    model: geminiModel,
    tools: [searchInternetTool]
});

export async function generateResponse(messages) {
    try {
        const response = await agent.invoke({
            messages: [
                new SystemMessage(`
                    You are a helpful and precise assistant for answering questions.
                    If you don't know the answer, say you don't know. 
                    If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
                `),
                ...(messages.map(msg => {
                    if (msg.role == "user") {
                        return new HumanMessage(msg.content)
                    } else if (msg.role == "ai") {
                        return new AIMessage(msg.content)
                    }
                })) ]
        });

        const lastMessage = response.messages[ response.messages.length - 1 ];
        return lastMessage.text || lastMessage.content || "";
    } catch (err) {
        console.error("Gemini agent error, using Groq fallback:", err.message);
        const fallbackResponse = await groqModel.invoke([
            new SystemMessage("You are a helpful and precise assistant."),
            ...(messages.map(msg => {
                if (msg.role == "user") {
                    return new HumanMessage(msg.content)
                } else if (msg.role == "ai") {
                    return new AIMessage(msg.content)
                }
            }))
        ]);
        return fallbackResponse.text || fallbackResponse.content || "";
    }
}

export async function generateChatTitle(message) {
    try {
        const response = await groqModel.invoke([
            new SystemMessage(`
                You are a helpful assistant that generates concise and descriptive titles for chat conversations.
                
                User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
            `),
            new HumanMessage(`
                Generate a title for a chat conversation based on the following first message:
                "${message}"
                `)
        ]);

        return response.text || response.content || message.slice(0, 30);
    } catch (err) {
        console.error("Groq title generation error:", err.message);
        return message.slice(0, 30) || "New Chat";
    }
}