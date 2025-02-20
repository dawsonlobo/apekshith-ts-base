import dotenv from 'dotenv';
dotenv.config();



export async function fetchChatCompletion(question: string): Promise<string> {
  console.log("Sending request to OpenRouter with question:", question);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
      max_tokens: 200,
      stream: false
    }),
  });

  console.log("Response status:", response.status);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const responseBody = await response.json();
  const content = responseBody?.choices?.[0]?.message?.content || "";

  if (!content) {
    console.error("No content returned from OpenRouter.");
  }

  console.log("Final response:", content);
  return content;  // Ensure this returns the answer as a string
}


// export { fetchChatCompletion };



// import { TextDecoder } from 'util';
// import dotenv from 'dotenv';
// dotenv.config();

// async function fetchChatCompletion(question: string): Promise<string> {
//   console.log("Sending request to OpenRouter with question:", question);

//   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'openai/o3-mini',
//       messages: [{ role: 'user', content: question }],
//       max_tokens: 100
//       // Remove the 'stream: true' option to test without streaming
//     }),
//   });

//   console.log("Response status:", response.status);
//   if (!response.ok) {
//     throw new Error(`API request failed with status ${response.status}`);
//   }

//   // Log the entire response body in case of issues
//   const responseBody = await response.text();
//   console.log("Response body:", responseBody);

//   const reader = response.body?.getReader();
// if (!reader) {
//   throw new Error('Response body is not readable');
// }

// const decoder = new TextDecoder();
// let buffer = '';
// let result = '';

// // Consume the stream correctly
// while (true) {
//   const { done, value } = await reader.read();
//   if (done) break;

//   const chunk = decoder.decode(value, { stream: true });
//   console.log("Stream chunk received:", chunk); // Log the chunk for inspection

//   buffer += chunk;
//   result += extractContent(buffer);
//   buffer = clearProcessedBuffer(buffer);
// }


//   if (!result) {
//     console.error("No content returned from OpenRouter.");
//   }

//   console.log("Final response:", result);
//   return result;
// }

// // Helper function to extract content from the buffer
// function extractContent(buffer: string): string {
//   let extractedText = '';
//   let lineEnd;

//   while ((lineEnd = buffer.indexOf('\n')) !== -1) {
//     const line = buffer.slice(0, lineEnd).trim();
//     buffer = buffer.slice(lineEnd + 1);

//     if (!line.startsWith('data: ')) continue;

//     const data = line.slice(6);
//     if (data === '[DONE]') {
//       console.log("Stream completed.");
//       break;
//     }

//     try {
//       // Try logging each chunk to see the actual content
//        const parsed = JSON.parse(data);
//        if (!parsed.choices || !parsed.choices[0]) {
//          console.error("Invalid chunk format:", data);
//       }

//       const content = parsed.choices?.[0]?.delta?.content;
//       if (content) {
//         console.log("Received chunk:", content);
//         extractedText += content;
//       }
//     } catch (e) {
//       console.error("JSON Parsing Error:", e, "Raw Data:", data);
//     }
//   }

//   return extractedText;
// }

// // Helper function to clear processed buffer
// function clearProcessedBuffer(buffer: string): string {
//   return buffer.includes('\n') ? buffer.slice(buffer.lastIndexOf('\n') + 1) : buffer;
// }

// export { fetchChatCompletion };
