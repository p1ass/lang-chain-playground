import { ConversationChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models'
import { BufferMemory } from 'langchain/memory'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'
import { ChatAgent, AgentExecutor } from 'langchain/agents'
import { SerpAPI, Calculator } from 'langchain/tools'
import {
  AgentAction,
  AgentFinish,
  ChainValues,
  HumanChatMessage,
  LLMResult,
  SystemChatMessage,
} from 'langchain/schema'
import { BaseCallbackHandler, CallbackManager } from 'langchain/callbacks'
import { debugCallbackManager } from './callback.mjs'

export async function executeChatSample(OPEN_AI_KEY: string) {
  const chat = new ChatOpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0 })

  const res = await chat.call([
    new SystemChatMessage('You are a helpful assistant that translates English to Japanese.'),
    new HumanChatMessage('Translate: I love programming.'),
  ])

  console.log(res)
}

/*
> ts-node --esm ./src/index.ts

AIChatMessage { text: '私はプログラミングが大好きです。' }
 */

export async function executeChatChain(OPEN_AI_KEY: string) {
  const chat = new ChatOpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0 })

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.'
    ),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ])

  const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: 'history' }),
    prompt: chatPrompt,
    llm: chat,
  })

  const res = await chain.call({
    input: 'hi from London, how are you doing today',
  })

  console.log(res)

  const res2 = await chain.call({
    input: 'Do you know where I am?',
  })

  console.log(res2)
}

/*
{
  response: "Hello! As an AI language model, I don't have feelings, but I'm functioning properly and ready to assist you with any questions or tasks you may have. How can I help you today?"
}
{
  response: "Yes, you mentioned that you are from London. However, as an AI language model, I don't have access to your current location unless you provide me with that information."
}
 */

export async function executeChatAgentSample(OPEN_AI_KEY: string) {
  const chat = new ChatOpenAI({
    openAIApiKey: OPEN_AI_KEY,
    verbose: true,
    callbackManager: debugCallbackManager,
  })

  // Define the list of tools the agent can use
  const tools = [new SerpAPI(), new Calculator()]
  // Create the agent from the chat model and the tools
  const agent = ChatAgent.fromLLMAndTools(chat, tools)
  // Create an executor, which calls to the agent until an answer is found
  const executor = AgentExecutor.fromAgentAndTools({ agent, tools, maxIterations: 5 })

  const responseG = await executor.run('2023年3月13日の1USDは何円ですか？')

  console.log(responseG)
}

/*
> ts-node --esm ./src/index.ts

### handleLLMStart ###

---
System: Answer the following questions as best you can. You have access to the following tools:

search: a search engine. useful for when you need to answer questions about current events. input should be a search query.
calculator: Useful for getting the result of a math expression. The input to this tool should be a valid mathmatical expression that could be executed by a simple calculator.

The way you use the tools is by specifying a json blob, denoted below by $JSON_BLOB
Specifically, this $JSON_BLOB should have a "action" key (with the name of the tool to use) and a "action_input" key (with the input to the tool going here). 
The $JSON_BLOB should only contain a SINGLE action, do NOT return a list of multiple actions. Here is an example of a valid $JSON_BLOB:

```
{
  "action": "calculator",
  "action_input": "1 + 2"
}
```

ALWAYS use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: 
```
$JSON_BLOB
```
Observation: the result of the action
... (this Thought/Action/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin! Reminder to always use the exact characters `Final Answer` when responding.
Human: 2023年3月13日の1USDは何円ですか？


---

### handleLLMEnd ###

{
  "generations": [
    [
      {
        "text": "Thought: I need to use the search tool to find the exchange rate for USD to JPY on the given date.\n\nAction:\n```\n{\n  \"action\": \"search\",\n  \"action_input\": \"2023年3月13日のUSD/JPY為替レート\"\n}\n```\n\n",
        "message": {
          "text": "Thought: I need to use the search tool to find the exchange rate for USD to JPY on the given date.\n\nAction:\n```\n{\n  \"action\": \"search\",\n  \"action_input\": \"2023年3月13日のUSD/JPY為替レート\"\n}\n```\n\n"
        }
      }
    ]
  ]
}
### handleLLMStart ###

---
System: Answer the following questions as best you can. You have access to the following tools:

search: a search engine. useful for when you need to answer questions about current events. input should be a search query.
calculator: Useful for getting the result of a math expression. The input to this tool should be a valid mathmatical expression that could be executed by a simple calculator.

The way you use the tools is by specifying a json blob, denoted below by $JSON_BLOB
Specifically, this $JSON_BLOB should have a "action" key (with the name of the tool to use) and a "action_input" key (with the input to the tool going here). 
The $JSON_BLOB should only contain a SINGLE action, do NOT return a list of multiple actions. Here is an example of a valid $JSON_BLOB:

```
{
  "action": "calculator",
  "action_input": "1 + 2"
}
```

ALWAYS use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: 
```
$JSON_BLOB
```
Observation: the result of the action
... (this Thought/Action/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin! Reminder to always use the exact characters `Final Answer` when responding.
Human: 2023年3月13日の1USDは何円ですか？

This was your previous work (but I haven't seen any of it! I only see what you return as final answer):
Thought: I need to use the search tool to find the exchange rate for USD to JPY on the given date.

Action:
```
{
  "action": "search",
  "action_input": "2023年3月13日のUSD/JPY為替レート"
}
```


Observation: No good search result found
Thought:
---

### handleLLMEnd ###

{
  "generations": [
    [
      {
        "text": "I need to try searching for the exchange rate using a different query that might give me a better result.\n\nAction:\n```\n{\n  \"action\": \"search\",\n  \"action_input\": \"USD JPY exchange rate March 13, 2023\"\n}\n```\n\n",
        "message": {
          "text": "I need to try searching for the exchange rate using a different query that might give me a better result.\n\nAction:\n```\n{\n  \"action\": \"search\",\n  \"action_input\": \"USD JPY exchange rate March 13, 2023\"\n}\n```\n\n"
        }
      }
    ]
  ]
}
### handleLLMStart ###

---
System: Answer the following questions as best you can. You have access to the following tools:

search: a search engine. useful for when you need to answer questions about current events. input should be a search query.
calculator: Useful for getting the result of a math expression. The input to this tool should be a valid mathmatical expression that could be executed by a simple calculator.

The way you use the tools is by specifying a json blob, denoted below by $JSON_BLOB
Specifically, this $JSON_BLOB should have a "action" key (with the name of the tool to use) and a "action_input" key (with the input to the tool going here). 
The $JSON_BLOB should only contain a SINGLE action, do NOT return a list of multiple actions. Here is an example of a valid $JSON_BLOB:

```
{
  "action": "calculator",
  "action_input": "1 + 2"
}
```

ALWAYS use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: 
```
$JSON_BLOB
```
Observation: the result of the action
... (this Thought/Action/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin! Reminder to always use the exact characters `Final Answer` when responding.
Human: 2023年3月13日の1USDは何円ですか？

This was your previous work (but I haven't seen any of it! I only see what you return as final answer):
Thought: I need to use the search tool to find the exchange rate for USD to JPY on the given date.

Action:
```
{
  "action": "search",
  "action_input": "2023年3月13日のUSD/JPY為替レート"
}
```


Observation: No good search result found
Thought:I need to try searching for the exchange rate using a different query that might give me a better result.

Action:
```
{
  "action": "search",
  "action_input": "USD JPY exchange rate March 13, 2023"
}
```


Observation: The amount of Japanese yen that could be bought with USD kept increasing since September 2020. As of March 13, 2023, the exchange rate reached approximately 133.59 Japanese yen. The average (standardized) measure is based on the calculation of many observations throughout the period in question.
Thought:
---

### handleLLMEnd ###

{
  "generations": [
    [
      {
        "text": "I have obtained the necessary information. I need to use a calculator tool to convert 1USD to JPY.\n\nAction:\n```\n{\n  \"action\": \"calculator\",\n  \"action_input\": \"1 * 133.59\"\n}\n```\n\n",
        "message": {
          "text": "I have obtained the necessary information. I need to use a calculator tool to convert 1USD to JPY.\n\nAction:\n```\n{\n  \"action\": \"calculator\",\n  \"action_input\": \"1 * 133.59\"\n}\n```\n\n"
        }
      }
    ]
  ]
}
### handleLLMStart ###

---
System: Answer the following questions as best you can. You have access to the following tools:

search: a search engine. useful for when you need to answer questions about current events. input should be a search query.
calculator: Useful for getting the result of a math expression. The input to this tool should be a valid mathmatical expression that could be executed by a simple calculator.

The way you use the tools is by specifying a json blob, denoted below by $JSON_BLOB
Specifically, this $JSON_BLOB should have a "action" key (with the name of the tool to use) and a "action_input" key (with the input to the tool going here). 
The $JSON_BLOB should only contain a SINGLE action, do NOT return a list of multiple actions. Here is an example of a valid $JSON_BLOB:

```
{
  "action": "calculator",
  "action_input": "1 + 2"
}
```

ALWAYS use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: 
```
$JSON_BLOB
```
Observation: the result of the action
... (this Thought/Action/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin! Reminder to always use the exact characters `Final Answer` when responding.
Human: 2023年3月13日の1USDは何円ですか？

This was your previous work (but I haven't seen any of it! I only see what you return as final answer):
Thought: I need to use the search tool to find the exchange rate for USD to JPY on the given date.

Action:
```
{
  "action": "search",
  "action_input": "2023年3月13日のUSD/JPY為替レート"
}
```


Observation: No good search result found
Thought:I need to try searching for the exchange rate using a different query that might give me a better result.

Action:
```
{
  "action": "search",
  "action_input": "USD JPY exchange rate March 13, 2023"
}
```


Observation: The amount of Japanese yen that could be bought with USD kept increasing since September 2020. As of March 13, 2023, the exchange rate reached approximately 133.59 Japanese yen. The average (standardized) measure is based on the calculation of many observations throughout the period in question.
Thought:I have obtained the necessary information. I need to use a calculator tool to convert 1USD to JPY.

Action:
```
{
  "action": "calculator",
  "action_input": "1 * 133.59"
}
```


Observation: 133.59
Thought:
---

### handleLLMEnd ###

{
  "generations": [
    [
      {
        "text": "I have the answer.\n\nFinal Answer: 133.59",
        "message": {
          "text": "I have the answer.\n\nFinal Answer: 133.59"
        }
      }
    ]
  ]
}
133.59
 */
