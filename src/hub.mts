import { loadPrompt } from 'langchain/prompts'

// 何故かfetchが失敗する
export async function executeHubSample() {
  try {
    const prompt = await loadPrompt('lc://prompts/llm_bash/prompt.json')
    const res = prompt.format({})
    console.log({ res })
  } catch (e) {
    console.error(e)
  }
}
