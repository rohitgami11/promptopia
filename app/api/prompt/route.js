import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const searchQuery = url.searchParams.get("search") || "";
    const tagQuery = url.searchParams.get("tags") || "";

    const query = {};

    // Add search filter
    if (searchQuery) {
      query.prompt = { $regex: searchQuery, $options: "i" };
    }

    // Add tags filter
    if (tagQuery) {
      query.tags = { $in: tagQuery.split(",") };
    }

    const skip = (page - 1) * limit;

    const prompts = await Prompt.find(query)
      .populate("creator")
      .skip(skip)
      .limit(limit);

    const totalCount = await Prompt.countDocuments(query);

    return new Response(
      JSON.stringify({
        prompts,
        totalPages: Math.ceil(totalCount / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to fetch prompts", { status: 500 });
  }
};
