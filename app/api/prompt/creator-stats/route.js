import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectToDB();

    const creatorStats = await Prompt.aggregate([
      {$group: {_id: "$creator", count : {$sum: 1}}},
      {$lookup: {
        from: 'users', // name of collection in MongoDB database
        localField: '_id', // field in Prompt
        // Note that localField is _id not creator because prompts are grouped based on creator field and it is now _id in aggregated object   
        foreignField: '_id', // field in User model
        as: 'creator_info' // result goes into this array
      }},
      {$unwind: '$creator_info'},
      {$sort: {count: -1}},
      {$limit: 5},
      {$project: {
        _id: 0,
        username: '$creator_info.username',
        email: '$creator_info.email',
        count: 1,
      }}
    ]);
    // console.log("CreatorStats:", creatorStats);

    return new Response(
      JSON.stringify({
        creatorStats
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