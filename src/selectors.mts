import { LLMChain } from 'langchain'
import { OpenAI } from 'langchain'
import {
  LengthBasedExampleSelector,
  PromptTemplate,
  FewShotPromptTemplate,
} from 'langchain/prompts'

export async function executeExampleSelectorSample(OPEN_AI_KEY: string) {
  const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0.9 })

  // Create a prompt template that will be used to format the examples.
  const examplePrompt = new PromptTemplate({
    inputVariables: ['input', 'output'],
    template: '入力: {input}\n出力: {output}',
  })

  // Create a LengthBasedExampleSelector that will be used to select the examples.
  const exampleSelector = await LengthBasedExampleSelector.fromExamples(
    [
      { input: 'happy', output: 'sad' },
      { input: 'tall', output: 'short' },
      { input: 'energetic', output: 'lethargic' },
      { input: 'sunny', output: 'gloomy' },
      { input: 'windy', output: 'calm' },
    ],
    {
      examplePrompt,
      maxLength: 25,
    }
  )

  // Create a FewShotPromptTemplate that will use the example selector.
  const dynamicPrompt = new FewShotPromptTemplate({
    // We provide an ExampleSelector instead of examples.
    exampleSelector,
    examplePrompt,
    prefix: '各入力項目の反意語を挙げます。',
    suffix: '入力: {adjective}\n出力:',
    inputVariables: ['adjective'],
  })

  // An example with small input, so it selects all examples.
  console.log(await dynamicPrompt.format({ adjective: 'big' }))

  /**
   * Give the antonym of every input
   *
   * Input: happy
   * Output: sad
   *
   * Input: tall
   * Output: short
   *
   * Input: energetic
   * Output: lethargic
   *
   * Input: sunny
   * Output: gloomy
   *
   * Input: windy
   * Output: calm
   *
   * Input: big
   * Output:
   */

  const chain = new LLMChain({ llm: model, prompt: dynamicPrompt })
  const res = await chain.call({ adjective: 'big' })
  console.log(res)
  /*
  { text: ' small' }
  */

  // An example with long input, so it selects only one example.
  const longString =
    'big and huge and massive and large and gigantic and tall and much much much much much bigger than everything else'
  console.log(await dynamicPrompt.format({ adjective: longString }))
  /**
   * Give the antonym of every input
   *
   * Input: happy
   * Output: sad
   *
   * Input: big and huge and massive and large and gigantic and tall and much much much much much bigger than everything else
   * Output:
   */
}
