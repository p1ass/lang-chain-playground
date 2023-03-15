import { OpenAI } from 'langchain'

const OPEN_AI_KEY = process.env.OPENAI_API_KEY

const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0.9 })

async function main() {
  const res = await model.call('hello')
  console.log(res)
}

main()
