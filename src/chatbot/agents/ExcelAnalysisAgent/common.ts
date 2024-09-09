/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import type { FunctionsAgentAction } from 'langchain/agents/openai/output_parser';
import type { AgentFinish, AgentStep } from 'langchain/agents';
import {
  type BaseMessage,
  AIMessage,
  FunctionMessage,
} from '@langchain/core/messages';

const responseSchema = z.object({
  output: z.string().describe('The final answer to return to the user'),
  sources: z
    .array(z.string())
    .describe(
      'List of page chunks that contain answer to the question. Only include a page chunk if it contains relevant information'
    ),
});

export const responseOpenAIFunction = {
  name: 'response',
  description: 'Return the response to the user',
  parameters: zodToJsonSchema(responseSchema),
};

export const structuredOutputParser = (
  message: AIMessage
): FunctionsAgentAction | AgentFinish => {
  if (message.content && typeof message.content !== 'string') {
    throw new Error('This agent cannot parse non-string model responses.');
  }
  if (message.additional_kwargs.function_call) {
    const { function_call } = message.additional_kwargs;
    try {
      const toolInput = function_call.arguments
        ? JSON.parse(function_call.arguments)
        : {};
      // If the function call name is `response` then we know it's used our final
      // response function and can return an instance of `AgentFinish`
      if (function_call.name === 'response') {
        return { returnValues: { ...toolInput }, log: message.content };
      }
      return {
        tool: function_call.name,
        toolInput,
        log: `Invoking "${function_call.name}" with ${
          function_call.arguments ?? '{}'
        }\n${message.content}`,
        messageLog: [message],
      };
    } catch (error) {
      throw new Error(
        `Failed to parse function arguments from chat model response. Text: "${function_call.arguments}". ${error}`
      );
    }
  } else {
    return {
      returnValues: { output: message.content },
      log: message.content,
    };
  }
};

export const formatAgentSteps = (steps: AgentStep[]): BaseMessage[] =>
  steps.flatMap(({ action, observation }) => {
    if ('messageLog' in action && action.messageLog !== undefined) {
      const log = action.messageLog as BaseMessage[];
      return log.concat(new FunctionMessage(observation, action.tool));
    } else {
      return [new AIMessage(action.log)];
    }
  });
