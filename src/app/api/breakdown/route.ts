import { getClient } from "@/lib/openai";
import { OPENAI_MODEL } from "@/lib/config";
import { NextResponse } from "next/server";
import { CLASSIFY_TEMPLATE, DECOMPOSE_TEMPLATE, SAFE_DECOMPOSITION } from "@/lib/prompts";

async function classify(item: string) {
   const classification = await getClient().responses.create({
      model: OPENAI_MODEL,
      input: CLASSIFY_TEMPLATE(item),
      text: { format: { type: "json_object" } },
   });

   return classification;
}

async function decompose(item: string, category: string) {
   const decomposition = await getClient().responses.create({
      model: OPENAI_MODEL,
      input: DECOMPOSE_TEMPLATE(item, category),
      text: { format: { type: "json_object" } },
   });

   return decomposition;
}

async function safeEducationalDecomposition(item: string) {
   const safeDecomposition = await getClient().responses.create({
      model: OPENAI_MODEL,
      input: SAFE_DECOMPOSITION(item),
      text: { format: { type: "json_object" } },
   })
   return JSON.parse(safeDecomposition.output_text)
}

export async function POST(req: Request) {
   try {
      const { item, consent } = await req.json();

      // 1. Classification call
      const classification = await classify(item);

      const parsedClassification = JSON.parse(classification.output_text);
      if (!parsedClassification) {
         throw new Error("No content in response");
      }
      // --- restricted early return ---
      if (parsedClassification.category === "restricted" && !consent) {
         return NextResponse.json({
            item,
            "category": "restricted",
            "needs_consent": true,
            "notes": "This item is restricted. Send { consent: true } to retrieve a safe, high-level educational overview."
         });
      }

      // -- consent given --
      if (parsedClassification.category === "restricted" && consent === true) {
         const educational = await safeEducationalDecomposition(item);

         return NextResponse.json({
            item,
            category: "restricted",
            educational_only: true,
            ...educational
         });
      }

      const category = parsedClassification.category;
      const decomposition = await decompose(item, category);

      const parsedDecomposition = JSON.parse(decomposition.output_text);

      return NextResponse.json({
         item,
         category,
         ...parsedDecomposition,
      });
   } catch (error) {
      console.error(
         "Failed because of : ",
         error instanceof Error ? error.message : "processing error"
      );
   }
   return NextResponse.json({ error: "classificaton failed" }, { status: 500 });
}
