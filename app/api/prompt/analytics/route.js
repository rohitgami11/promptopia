import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();

    const totalPromptCount = await Prompt.countDocuments();
    console.log("totalPromptCount:", totalPromptCount);

    const promptPerTag = await Prompt.aggregate([
      {$unwind: "$tags"},
      {$group: {_id: "$tags", count : {$sum: 1}}},
      {$sort: {count: -1}}
    ]);
    console.log("promptPerTag", promptPerTag);

    const mostCommonPrompt = await Prompt.aggregate([
      {$group: {_id: "$prompt", count : {$sum : 1}}},
      {$sort: {count: -1}},
      {$limit: 1},
      {$project: { prompt: "$_id", count: 1, _id: 0}}
    ])
    console.log("mostCommonPrompt:", mostCommonPrompt);

    return new Response(
      JSON.stringify({
        totalPromptCount,
        promptPerTag,
        mostCommonPrompt
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