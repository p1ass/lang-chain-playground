import { OpenAI } from 'langchain'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'

const OPEN_AI_KEY = process.env.OPENAI_API_KEY

async function main() {
  const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0.9 })

  // Setup template
  const template = 'What is a good name for a company that makes {product}?'
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ['product'],
  })

  // Build LLM chain
  const chain = new LLMChain({ llm: model, prompt: prompt })

  const res = await chain.call({ product: 'colorful sock' })
  console.log(res)
}

main()
