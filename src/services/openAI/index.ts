import express, { Request, Response } from 'express';
import { fetchChatCompletion } from './ai'; // Update with actual file path

const app = express();
app.use(express.json()); // Ensure Express can parse JSON request bodies

app.post('/api/chat', async (req: Request, res: Response):Promise<void> => {
  try {
    const { question } = req.body;

    if (!question) {
       res.status(400).json({ error: 'Question is required' });
       return;
    }

    const responseText = await fetchChatCompletion(question);
    res.json({ response: responseText });
    return; // ✅ Always return a response
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
});

// ✅ Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
