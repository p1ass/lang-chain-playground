import { executeMemorySample } from './memory.mjs'

const OPEN_AI_KEY = process.env.OPENAI_API_KEY

async function main() {
  if (!OPEN_AI_KEY) {
    throw new Error('environment variable OPEN_AI_KEY is not set')
  }
  await executeMemorySample(OPEN_AI_KEY)
}

main()
