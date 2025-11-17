import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export function getClient() {

    const client = new OpenAI({
      apiKey: OPENAI_API_KEY,
   });

   return client
}




