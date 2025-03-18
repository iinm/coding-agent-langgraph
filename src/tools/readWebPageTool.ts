import { tool } from "@langchain/core/tools";

import z from "zod";

const MAX_CONTENT_LENGTH = 1024 * 8;

export const readWebPageTool = tool(
  async ({ url }: { url: string }) => {
    const { Readability } = await import("@mozilla/readability");
    const { JSDOM } = await import("jsdom");

    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    const content = article?.textContent?.trim() || "";
    if (content.length > MAX_CONTENT_LENGTH) {
      return content.substring(0, MAX_CONTENT_LENGTH) + " [truncated]";
    }
    return content;
  },
  {
    name: "read_web_page",
    description:
      "Fetches page content from a given URL and extracts only the main text content.",
    schema: z.object({
      url: z.string().describe("The URL to fetch content from."),
    }),
  },
);
