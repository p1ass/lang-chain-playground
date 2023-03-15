import { PuppeteerWebBaseLoader } from 'langchain/document_loaders'
import { HNSWLib } from 'langchain/vectorstores'
import { OpenAIEmbeddings } from 'langchain/embeddings'
import { TokenTextSplitter } from 'langchain/text_splitter'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { CharacterTextSplitter } from 'langchain/text_splitter'

export async function executeDocumentSample() {
  const loader = new PuppeteerWebBaseLoader(
    'https://raw.githubusercontent.com/p1ass/blog/master/content/posts/brabia-xrj-48a90k/index.md'
  )

  const splitter = new CharacterTextSplitter({
    separator: '###',
    chunkSize: 200,
    chunkOverlap: 10,
  })
  const docs = await loader.loadAndSplit(splitter)

  // Load the docs into the vector store
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings())

  // Search for the most similar document
  const resultOne = await vectorStore.similaritySearchWithScore('画質の良さについて', 3)
  console.log(resultOne)
}
