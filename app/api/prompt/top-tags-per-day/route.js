import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();

    const topTagsPerDay = await Prompt.aggregate([
      {$unwind: "$tags"},
      {
        $addFields : {
          dayOfWeeks: { $dayOfWeek: "$createdAt"},
        }
      },
      {
        $group: {
          _id: {dayOfWeeks: "$dayOfWeeks",tag: "$tags"}, 
          count : {$sum: 1}
        }
      },
      {
        $group: {
          _id: "$_id.dayOfWeeks",
          tags: {
            $push: {
              tag: "$_id.tag",
              count: "$count",
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                { case: { $eq: ["$_id", 7] }, then: "Saturday" }
              ],
              default: "Unknown"
            }
          },
          count: 1,
          tags: {
            $slice: [
              {
                $sortArray: {
                  input: "$tags",
                  sortBy: { count: -1 }
                }
              },
              3
            ]
          }
        },
      },
    ]);
    console.log(topTagsPerDay)

    return new Response(
      JSON.stringify({
        topTagsPerDay
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