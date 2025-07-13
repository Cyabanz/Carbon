// OpenRouter API handler for Fusion AI Chat
// This can be used as a serverless function or API endpoint

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // For development, you can set a default API key
  // In production, use environment variables
  const API_KEY = process.env.OPENROUTER_API_KEY || "your-openrouter-api-key-here";
  
  if (!API_KEY || API_KEY === "your-openrouter-api-key-here") {
    res.status(500).json({ 
      error: "OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable or update the code with your API key." 
    });
    return;
  }

  const { 
    history, 
    model, 
    reasoningMode, 
    reasoningRequest, 
    userForReasoning, 
    personalityPrompt, 
    reasoningPrompt 
  } = req.body || {};

  if (!Array.isArray(history)) {
    res.status(400).json({ error: "Missing or invalid 'history' array in request body." });
    return;
  }

  const modelName = typeof model === "string" && model.length > 0
    ? model
    : "openai/gpt-3.5-turbo";

  // Build messages array with system prompt if provided
  let messages = [];
  
  // Add personality prompt as system message if provided
  if (personalityPrompt && personalityPrompt.trim()) {
    messages.push({
      role: "system",
      content: personalityPrompt.trim()
    });
  }

  // Add reasoning instruction if this is a reasoning request
  if (reasoningRequest && reasoningPrompt) {
    messages.push({
      role: "system", 
      content: reasoningPrompt.trim()
    });
  }

  // Add conversation history
  const historyMessages = history.map(item => ({
    role: item.role === "user" ? "user" : "assistant",
    content: item.text
  }));
  
  messages = messages.concat(historyMessages);

  try {
    const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "https://fusion-ai-chat.com", // Replace with your domain
        "X-Title": "Fusion AI Chat"
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        max_tokens: 2048,
        temperature: reasoningMode === "focused" ? 0.1 : reasoningMode === "creative" ? 0.8 : 0.5
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      res.status(500).json({ error: data.error?.message || data.error || "OpenRouter API error" });
      return;
    }

    const responseText = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // For reasoning requests, return both the answer and reasoning
    if (reasoningRequest) {
      res.status(200).json({ 
        text: responseText,
        reasoning: responseText // In a more sophisticated implementation, you might separate reasoning from final answer
      });
    } else {
      res.status(200).json({ text: responseText });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "OpenRouter API error: " + err.message });
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS (Node.js)
  module.exports = handler;
} else if (typeof exports !== 'undefined') {
  // CommonJS alternative
  exports.default = handler;
} else {
  // Browser/ES module
  window.openRouterHandler = handler;
}

