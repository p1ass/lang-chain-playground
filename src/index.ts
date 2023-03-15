import { executeChatAgentSample, executeChatChain, executeChatSample } from './chat.mjs'
import { executeHubSample } from './hub.mjs'
import { executeMemorySample } from './memory.mjs'
import { executeOutputParserExample } from './outputParser.mjs'
import { executeExampleSelectorSample } from './selectors.mjs'

const OPEN_AI_KEY = process.env.OPENAI_API_KEY

async function main() {
  if (!OPEN_AI_KEY) {
    throw new Error('environment variable OPEN_AI_KEY is not set')
  }
  await executeChatAgentSample(OPEN_AI_KEY)
}

main()
