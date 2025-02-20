import {fetchChatCompletion} from "../services/openAI/ai"




export async function trigger(){
  const question:string="who is gokus son"
  fetchChatCompletion(question)

}

