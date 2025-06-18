import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req) => {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("q") || "";

    const prompts = await Prompt.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error("Error during full-text search:", error);
    return new Response("Failed to perform text search", { status: 500 });
  }
};
