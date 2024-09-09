import { getChatLLM, OpenAIEmbeddings } from '@/chatbot/model';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { type DynamicToolInput } from '@langchain/core/tools';

const ANSWER_SYSTEM_TEMPLATE = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer. Answer in the user's language first.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

<context>
{context}
</context>

Please return your answer in markdown with clear headings and lists.`;
const answerPrompt = ChatPromptTemplate.fromMessages([
  ['system', ANSWER_SYSTEM_TEMPLATE],
  new MessagesPlaceholder('chat_history'),
  ['user', '{input}'],
]);

/**
 * 文档QA工具函数
 * @param filename
 * @param query
 */
const documentQAFunc: DynamicToolInput['func'] = async (query: string) => {
  // 根据一个PDF文档的内容，回答一个问题
  console.log(query, 'documentqa工具');

  const documentChain = await createStuffDocumentsChain({
    llm: getChatLLM({
      temperature: 0,
    }),
    prompt: answerPrompt,
  });

  // Create docs with a loader
  const loader = new TextLoader('./assets/test.txt');
  const docs = await loader.load();

  // Load the docs into the vector store
  const vectorStore = await FaissStore.fromDocuments(
    docs,
    new OpenAIEmbeddings()
  );

  const retriever = vectorStore.asRetriever();

  const conversationalRetrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain: documentChain,
  });
  const response = await conversationalRetrievalChain.invoke({
    input: query,
  });

  console.log(response, '20------');
  return response.answer;
};
// documentQAFunc();
export default documentQAFunc;
