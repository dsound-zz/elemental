import { getClient } from "@/lib/openai";
import { OPENAI_MODEL } from "@/lib/config";
import { NextResponse } from "next/server";

const PROMPT_TEMPLATE = (item: string) => `
   You are a classifier. 
   Your job is to look at an ${item} and categorize it into exactly ONE of these:

   simple_material
   manufactured_item
   complex_structure
   biological
   abstract_system
   restricted

   Return ONLY JSON in the following shape:
      {
         "category": "...",
         "reasoning": "..."
      }

   Do NOT include materials, systems, decomposition, or notes beyond classification reasoning.
   `

export async function POST(req: Request) {
   try {
      const body = await req.json()
      const item = body.item 

      // 1. Classification call
      const classification = await getClient().responses.create({
         model: OPENAI_MODEL,
         input: PROMPT_TEMPLATE(item)
      })
      const content = classification.output_text;
      if (!content) {
         throw new Error("No content in response")
      }
      const parsed = JSON.parse(content)
      return NextResponse.json(parsed)
   } catch (error) {
      console.error("Failed because of : ",  error instanceof Error ? error.message : "processing error")
   }
   return NextResponse.json({ error: "classificaton failed" }, { status: 500 })
}