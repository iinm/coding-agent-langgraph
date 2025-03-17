import {
  BaseMessageLike,
  isAIMessage,
  isBaseMessage,
  isSystemMessage,
} from "@langchain/core/messages";

import { Model } from "./model";

export function enableClaudePromptCaching({
  model,
  messages,
}: {
  model: Model;
  messages: BaseMessageLike[];
}): BaseMessageLike[] {
  if (model.model.startsWith("claude")) {
    const userMessageIndices = messages.reduce<number[]>((acc, msg, index) => {
      if (isBaseMessage(msg) && !isAIMessage(msg)) {
        acc.push(index);
      }
      return acc;
    }, []);

    const cacheTargetIndices = [
      // last user message
      userMessageIndices.at(-1),
      // second last user message
      userMessageIndices.at(-2),
    ].filter((index): index is number => index !== undefined);

    const modifiedMessages = messages.map((msg, msgIndex) => {
      if (msgIndex === 0 && isBaseMessage(msg) && isSystemMessage(msg)) {
        // cache prompt message
        msg.content = Array.isArray(msg.content)
          ? msg.content.map((part, partIndex) => ({
              ...part,
              ...(partIndex === msg.content.length - 1
                ? { cache_control: { type: "ephemeral" } }
                : {}),
            }))
          : [
              {
                type: "text",
                text: msg.content,
                cache_control: { type: "ephemeral" },
              },
            ];
        return msg;
      }
      if (cacheTargetIndices.includes(msgIndex)) {
        // set cache_control
        if (isBaseMessage(msg)) {
          msg.content = Array.isArray(msg.content)
            ? msg.content.map((part, partIndex) => ({
                ...part,
                ...(partIndex === msg.content.length - 1
                  ? { cache_control: { type: "ephemeral" } }
                  : {}),
              }))
            : [
                {
                  type: "text",
                  text: msg.content,
                  cache_control: { type: "ephemeral" },
                },
              ];
          return msg;
        }
      } else {
        // clear cache_control
        if (isBaseMessage(msg)) {
          msg.content = Array.isArray(msg.content)
            ? msg.content.map((part) => {
                if ("cache_control" in part) {
                  delete part.cache_control;
                }
                return part;
              })
            : msg.content;
          return msg;
        }
      }
      return msg;
    });

    return modifiedMessages;
  }
  return messages;
}
