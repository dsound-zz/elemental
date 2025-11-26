export const CLASSIFY_TEMPLATE = (item: string) => `
   You are a classifier. 
   Your job is to look at an ${item} and categorize it into exactly ONE of these:

   simple_material
   manufactured_item
   complex_structure
   biological
   abstract_system
   restricted

   Restrict ONLY:
- weapons
- explosives
- bombs
- firearms
- ammunition
- weapon components
- chemical weapons
- biological weapons
- toxic industrial chemicals
- instructions for harm, explosions, or weapon construction

Restricted items will be met with a 'consent' and then another prompt will follow for educational purposes only.

   Return ONLY JSON in the following shape:
      {
         "category": "...",
         "reasoning": "..."
      }

   Do NOT include materials, systems, decomposition, or notes beyond classification reasoning.
   `

export const DECOMPOSE_TEMPLATE = (item: string, category: string) => `
   You are a decomposition engine...

   Output JSON only in this shape:
{
  "aka": "" // only if it's simpple_material e.g. H2O for water or CO2 for carbon dioxide
  "primary_materials": [{ "name": "", "elements": [] }],
  "secondary_materials": [{ "name": "", "elements": [] }],
  "systems_involved": [],
  "notes": ""
}

Rules by category:

simple_material:
  - Provide raw chemistry and elemental composition only.
  - No systems, no components.

manufactured_item:
  - Break into 2–6 major components.
  - For each component, list its primary material and elements.
  - Do not list tiny fasteners, adhesives, or minor parts unless essential.

complex_structure:
  - Provide high-level systems (e.g., framing, electrical, plumbing).
  - List major materials used in these systems.
  - Avoid excessive detail.

biological:
  - Provide elemental composition and major organic compounds.
  - Never include biological, medical, or lab procedures.

abstract_system:
  - Provide only high-level material categories (e.g., metals, polymers, composites).
  - Do not attempt detailed breakdowns.

restricted:
  - Return empty arrays for materials.
  - Add a short educational-only note.
  - Never provide instructions or actionable details.

Item: ${item}
Category: ${category}

Return only valid JSON. No explanations outside the JSON.

   
`

export const SAFE_DECOMPOSITION = (item: string) => `
      Provide ONLY a high-level, non-actionable, historical and conceptual
      overview of what general materials or components are typically
      associated with ${item}.

      Safety rules:
      - No formulas.
      - No construction steps.
      - No manufacturing guidance.
      - No mechanisms of operation.
      - No chemical compositions.
      - No ratios, reactions, or instructions.
      - Only high-level, encyclopedia-style information.

      Return JSON:
      {
        "summary": "",
        "historical_context": "",
        "non_actionable_overview": ""
      }
    `