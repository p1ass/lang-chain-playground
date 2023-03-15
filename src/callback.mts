import { BaseCallbackHandler, CallbackManager } from 'langchain/callbacks'
import { AgentAction, AgentFinish, ChainValues, LLMResult } from 'langchain/schema'

export const debugCallbackManager: CallbackManager = {
  handlers: [],
  handleLLMStart: async function (
    llm: { name: string },
    prompts: string[],
    verbose?: boolean | undefined
  ): Promise<void> {
    console.log('### handleLLMStart ###\n')
    prompts.forEach((p) => console.log(`---\n${p}\n---\n`))
  },
  handleLLMNewToken: async function (token: string, verbose?: boolean | undefined): Promise<void> {
    console.log('### handleLLMNewToken ###\n')
    console.log(token)
  },
  handleLLMError: function (err: any, verbose?: boolean | undefined): Promise<void> {
    throw new Error('Function not implemented.')
  },
  handleLLMEnd: async function (output: LLMResult, verbose?: boolean | undefined): Promise<void> {
    console.log('### handleLLMEnd ###\n')
    console.log(JSON.stringify(output, null, 2))
  },
  handleChainStart: async function (
    chain: { name: string },
    inputs: ChainValues,
    verbose?: boolean | undefined
  ): Promise<void> {
    console.log('### handleChainStart ###\n')
    console.log(JSON.stringify(inputs, null, 2))
  },
  handleChainError: function (err: any, verbose?: boolean | undefined): Promise<void> {
    throw new Error('Function not implemented.')
  },
  handleChainEnd: async function (
    output: ChainValues,
    verbose?: boolean | undefined
  ): Promise<void> {
    console.log('### handleChainEnd ###\n')
    console.log(JSON.stringify(output, null, 2))
  },
  handleToolStart: async function (
    tool: { name: string },
    input: string,
    verbose?: boolean | undefined
  ): Promise<void> {
    console.log(`### handleToolStart ${tool.name} ###\n`)
    console.log(input)
  },
  handleToolError: function (err: any, verbose?: boolean | undefined): Promise<void> {
    throw new Error('Function not implemented.')
  },
  handleToolEnd: async function (output: string, verbose?: boolean | undefined): Promise<void> {
    console.log('### handleToolEnd ###\n')
    console.log(output)
  },
  handleText: async function (text: string, verbose?: boolean | undefined): Promise<void> {
    console.log('### handleText ###\n')
    console.log(text)
  },
  handleAgentAction: function (action: AgentAction, verbose?: boolean | undefined): Promise<void> {
    throw new Error('Function not implemented.')
  },
  handleAgentEnd: function (action: AgentFinish, verbose?: boolean | undefined): Promise<void> {
    throw new Error('Function not implemented.')
  },
  addHandler: function (handler: BaseCallbackHandler): void {
    throw new Error('Function not implemented.')
  },
  removeHandler: function (handler: BaseCallbackHandler): void {
    throw new Error('Function not implemented.')
  },
  setHandlers: function (handlers: BaseCallbackHandler[]): void {
    throw new Error('Function not implemented.')
  },
  setHandler: function (handler: BaseCallbackHandler): void {
    throw new Error('Function not implemented.')
  },
  alwaysVerbose: false,
  ignoreLLM: false,
  ignoreChain: false,
  ignoreAgent: false,
}
