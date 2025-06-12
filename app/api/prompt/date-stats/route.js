import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();

    const promptPerDate = await Prompt.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          }, 
          count : {$sum: 1}}
      },
      {
        $sort: {_id: -1}
      }
    ]);
    console.log("promptPerDate", promptPerDate);

    return new Response(
      JSON.stringify({
        promptPerDate,
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