import { OpenAI, PromptTemplate } from 'langchain'
import { StructuredOutputParser } from 'langchain/output_parsers'

export async function executeOutputParserExample(OPEN_AI_KEY: string) {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: "answer to the user's question",
    source: "source used to answer the user's question, should be a website.",
  })

  const formatInstructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template: 'answer the users question as best as possible.\n{format_instructions}\n{question}',
    inputVariables: ['question'],
    partialVariables: { format_instructions: formatInstructions },
  })

  const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0.9 })

  const input = await prompt.format({
    question: 'What is the capital of France?',
  })
  const response = await model.call(input)

  console.log('Prompt:')
  console.log(input)
  console.log('Raw response:')
  console.log(response)
  console.log('Parsed response:')
  // type: {[x: string]: string;}
  console.log(parser.parse(response))
}

/**
Prompt:
answer the users question as best as possible.
The output should be a markdown code snippet formatted in the following schema:

```json
{
        "answer": string // answer to the user's question
        "source": string // source used to answer the user's question, should be a website.
}
``` 

What is the capital of France?
Raw response:


```json
{
        "answer": "Paris",
        "source": "https://en.wikipedia.org/wiki/France#Administrative_divisions"
}
```
Parsed response:
{
  answer: 'Paris',
  source: 'https://en.wikipedia.org/wiki/France#Administrative_divisions'
}
 */
