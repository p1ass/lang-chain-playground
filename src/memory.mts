import { OpenAI } from 'langchain'
import { BufferMemory } from 'langchain/memory'
import { ConversationChain } from 'langchain/chains'

export async function executeMemorySample(OPEN_AI_KEY: string) {
  const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0.9 })
  const memory = new BufferMemory()
  const chain = new ConversationChain({ llm: model, memory: memory })
  const res1 = await chain.call({ input: "Hi! I'm Jim." })
  console.log(res1)

  const res2 = await chain.call({ input: "What's my name?" })
  console.log(res2)
}

/*
> ts-node --esm ./src/index.ts
{
  response: " Hello Jim! It's nice to meet you. My name is AI. What would you like to talk about?"
}
{ response: ' You said your name is Jim.' }
 */
