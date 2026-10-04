import { tavily as Tavily } from "@tavily/core"

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
})


export const searchInternet = async ({ query }) => {
    try {
        const results = await tavily.search(query, {
            maxResults: 5,
        });

        return JSON.stringify(results);
    } catch (err) {
        console.error("Tavily search error:", err.message);
        return `Could not retrieve online search results at this time. Please answer based on existing knowledge.`;
    }
}