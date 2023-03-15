import { OpenAI } from 'langchain'
import { initializeAgentExecutor } from 'langchain/agents'
import { SerpAPI, Calculator } from 'langchain/tools'

export async function executeAgentSample(OPEN_AI_KEY: string) {
  const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0.9 })
  const tools = [new SerpAPI(), new Calculator()]

  const executor = await initializeAgentExecutor(tools, model, 'zero-shot-react-description')
  console.log('Loaded agent.')

  const input =
    "Who is Olivia Wilde's boyfriend?" + ' What is his current age raised to the 0.23 power?'
  console.log(`Executing with input "${input}"...`)

  const result = await executor.call({ input })

  console.log(`Got output ${result.output}`)
}
