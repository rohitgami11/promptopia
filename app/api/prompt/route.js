import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit")) || 10;

    const cursor = url.searchParams.get("cursor");       // for next page
    const prevCursor = url.searchParams.get("prevCursor"); // for previous page
    const searchQuery = url.searchParams.get("search") || "";
    const tagQuery = url.searchParams.get("tags") || "";

    console.log("Incoming API request with: ", {
      limit,
      cursor,
      prevCursor,
      searchQuery,
      tagQuery,
    });

    const query = {};

    // Add search filter
    if (searchQuery) {
      query.prompt = { $regex: searchQuery, $options: "i" };
    }

    // Add tags filter
    if (tagQuery) {
      query.tags = { $in: tagQuery.split(",") };
    }

    // Apply cursor-based condition
    if (cursor) {
      query._id = { $gt: cursor };
    } else if (prevCursor) {
      query._id = { $lt: prevCursor };
    }

    const sortOrder = prevCursor ? -1 : 1;

    console.log("Final Mongo query: ", query);
    console.log("Sort order: ", sortOrder);

    const prompts = await Prompt.find(query)
      .populate("creator")
      .sort({ _id: sortOrder })
      .limit(limit);

    console.log("Fetched prompts count: ", prompts.length);

    const finalPrompts = prevCursor ? prompts.reverse() : prompts;

    const newNextCursor =
      finalPrompts.length > 0
        ? finalPrompts[finalPrompts.length - 1]._id
        : null;

    const newPrevCursor =
      finalPrompts.length > 0 ? finalPrompts[0]._id : null;

    console.log("New nextCursor: ", newNextCursor);
    console.log("New prevCursor: ", newPrevCursor);

    return new Response(
      JSON.stringify({
        prompts: finalPrompts,
        nextCursor: newNextCursor,
        prevCursor: newPrevCursor,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching prompts: ", error);
    return new Response("Failed to fetch prompts", { status: 500 });
  }
};
