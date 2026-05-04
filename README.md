# Nấu Smart Grocery

Mobile-first grocery MVP scaffold built with Next.js App Router, TypeScript, Tailwind CSS, Zod, and Lucide React.

## MVP scope

1. Scan ingredients from a camera or uploaded image
2. Search dishes by name and servings, then map ingredients into grocery cart items

## Architecture notes

- `lib/ai/geminiScan.ts` isolates Gemini image understanding
- `lib/services/gemmaService.ts` is a mockable reasoning wrapper for dish suggestion and recipe generation
- `lib/services/catalogMapper.ts` keeps grocery mapping deterministic and separate from AI
- `data/*.json` stores the initial static catalog and ingredient mapping layer
- `app/api/*` route handlers validate input and return structured JSON responses

## Planned next implementation step

- Replace mock Gemini scan output with real file-to-model integration
- Swap the mock Gemma wrapper with an internal model service or self-hosted backend
- Add product browsing, search, and checkout flows on top of the existing catalog layer
