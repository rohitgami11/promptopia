import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import mongoose from "mongoose";

export const GET = async (req) => {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit")) || 10;

    const searchQuery = url.searchParams.get("search") || "";
    const tagQuery = url.searchParams.get("tags") || "";

    const cursorId = url.searchParams.get("cursorId");
    const cursorScore = parseFloat(url.searchParams.get("cursorScore"));
    const prevCursorId = url.searchParams.get("prevCursorId");
    const prevCursorScore = parseFloat(url.searchParams.get("prevCursorScore"));

    console.log("===== Incoming API Request =====");
    console.log("Limit: ", limit);
    console.log("Search Query: ", searchQuery);
    console.log("Tag Filter: ", tagQuery);
    console.log("CursorId: ", cursorId);
    console.log("CursorScore: ", cursorScore);
    console.log("PrevCursorId: ", prevCursorId);
    console.log("PrevCursorScore: ", prevCursorScore);

    const tagsArray = tagQuery.split(",").filter(Boolean);
    const baseQuery = tagsArray.length > 0 ? { tags: { $all: tagsArray } } : {};

    let prompts;

    if (searchQuery) {
      const searchPipeline = [
        { $match: { ...baseQuery, $text: { $search: searchQuery } } },
        { $addFields: { score: { $meta: "textScore" } } },
      ];

      if (cursorId && !isNaN(cursorScore)) { // NEXT PAGE
        searchPipeline.push({
          $match: {
            $or: [
              { score: { $lt: cursorScore } },
              { score: { $eq: cursorScore }, _id: { $gt: new mongoose.Types.ObjectId(cursorId) } },
            ],
          },
        });
        searchPipeline.push({ $sort: { score: -1, _id: 1 } });
      } else if (prevCursorId && !isNaN(prevCursorScore)) { // PREV PAGE
        searchPipeline.push({
          $match: {
            $or: [
              { score: { $gt: prevCursorScore } },
              { score: { $eq: prevCursorScore }, _id: { $lt: new mongoose.Types.ObjectId(prevCursorId) } },
            ],
          },
        });
        searchPipeline.push({ $sort: { score: 1, _id: -1 } });
      } else { // FIRST PAGE
        searchPipeline.push({ $sort: { score: -1, _id: 1 } });
      }

      searchPipeline.push({ $limit: limit });
      prompts = await Prompt.aggregate(searchPipeline);

    } else {
      // Default pagination (no text search)
      let sort = { _id: 1 };
      const findQuery = { ...baseQuery };

      if (cursorId) { // NEXT PAGE
        findQuery._id = { $gt: cursorId };
        sort = { _id: 1 };
      } else if (prevCursorId) { // PREV PAGE
        findQuery._id = { $lt: prevCursorId };
        sort = { _id: -1 };
      }

      prompts = await Prompt.find(findQuery).sort(sort).limit(limit).lean();
    }

    // This part was moved from the original logic to handle both cases
    if (prevCursorId) {
      prompts = prompts.reverse();
    }
    
    // Populate creator after getting results from either path
    if (prompts.length > 0) {
      prompts = await Prompt.populate(prompts, { path: "creator" });
    }

    if (prompts.length > 0) {
      console.log("Sample prompt object:", prompts[0]);
    }

    const newNextCursor = prompts.length > 0
      ? {
          cursorId: prompts[prompts.length - 1]._id,
          cursorScore: prompts[prompts.length - 1].score ?? null,
        }
      : null;

    const newPrevCursor = prompts.length > 0
      ? {
          prevCursorId: prompts[0]._id,
          prevCursorScore: prompts[0].score ?? null,
        }
      : null;

    console.log("Fetched Prompts Count: ", prompts.length);
    console.log("New Next Cursor: ", newNextCursor);
    console.log("New Prev Cursor: ", newPrevCursor);
    console.log("=================================");

    return new Response(
      JSON.stringify({
        prompts,
        nextCursor: newNextCursor,
        prevCursor: newPrevCursor,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return new Response("Failed to fetch prompts", { status: 500 });
  }
};
