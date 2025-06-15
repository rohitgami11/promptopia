import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();

    const detailedStats = await Prompt.aggregate([
      {
        $unwind: "$tags"
      },
      {
        $group: {
          _id: "$creator",                           // Group by creator field
          totalPrompts: { $sum: 1 },                  // Count total prompts per creator
          uniqueTags: { $addToSet: "$tags" },         // Collect unique tags per creator
          latestPromptDate: { $max: "$createdAt" }    // Get latest prompt date per creator
        }
      },
      {
        $lookup: {
          from: "users",                             // Collection name for your User model
          localField: "_id",                         // _id here is the creator ObjectId
          foreignField: "_id",
          as: "creatorDetails"
        }
      },
      {
        $unwind: "$creatorDetails"
      },
      {$sort: {latestPromptDate: -1}},
      {
        $project: {
          _id: 0,
          creatorEmail: "$creatorDetails.email",
          totalPrompts: 1,
          uniqueTags: 1,
          latestPromptDate: 1
        }
      }
    ])

    console.log("detailed Statstics:", detailedStats);
    return new Response(
      JSON.stringify({
        detailedStats
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to fetch prompts analytics", { status: 500 });
  }
};


/*
-------------- When writing any aggregation -----------------
Identify your goal

Break it into data transformations

Choose the right operator per transformation

Chain them in correct order

          ┌──────────────────┐
          │   Collection     │
          │  (Documents)     │
          └────────┬─────────┘
                   │
                   ▼
        ┌────────────────────┐
        │   $match (filter)  │ ← Optional: filter docs first
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ $unwind (explode   │ ← Optional: flatten arrays into docs
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │    $group (by key) │ ← Group docs by field(s)
        │ + accumulators     │   (like $sum, $avg, $count)
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │    $sort (order)   │ ← Sort by count / date / name etc.
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │   $limit (restrict)│ ← Limit number of docs
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  Final Result Set  │
        └────────────────────┘

-------------------------------------------------------------
*/