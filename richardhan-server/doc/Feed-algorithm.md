# **Trending Score Calculation & Flow**

The `trendingScore` is a dynamic metric used to rank posts and reels in the feed. It is calculated based on user interactions (likes, comments, bookmarks) and optionally story views. Cron jobs update this score periodically.

---

## **1. Entities Covered**

| Entity | Tables Used                                   |
| ------ | --------------------------------------------- |
| Post   | `Post`, `PostLike`, `Comment`, `Bookmark`     |
| Reel   | `Reel`, `ReelLike`, `ReelComment`, `Bookmark` |
| Story  | `Story` (special case, uses views and likes)  |

---

## **2. Weight Configuration**

The weight for each interaction is configurable in the `CronJobService`:

```ts
private readonly WEIGHTS = {
  LIKE: 1,
  COMMENT: 3,
  BOOKMARK: 4,
};
```

- Likes → 1 point
- Comments → 3 points
- Bookmarks → 4 points

Base score is applied for new posts/reels without interactions:

```ts
private readonly BASE_SCORE = 1;
```

---

## **3. Trending Score Formula**

For **posts and reels**, the score is computed as:

[
\text{trendingScore} = (\text{likesCount} \times 1) + (\text{commentsCount} \times 3) + (\text{bookmarksCount} \times 4)
]

- `likesCount`: Number of likes within a given interval (optional, e.g., last 3 days for hourly updates)
- `commentsCount`: Number of top-level comments within interval
- `bookmarksCount`: Number of bookmarks within interval

For **stories**, trending score uses a weighted formula:

[
\text{trendingScore} = (\text{viewCount} \times 0.6) + (\text{likeCount} \times 0.4)
]

---

## **4. Cron Jobs & Update Flow**

### **Hourly Updates**

Runs every hour (`EVERY_HOUR`):

1. **Update stories trending score**
   - Only stories published in the last 1 day are included.
   - Uses weighted views & likes formula.

2. **Update posts and reels trending score** (last 3 days)
   - Only interactions in the last 3 days are counted.
   - Uses the weighted formula above.

3. **Apply base score**
   - Posts/reels with 0 interactions in the last 3 days are given a base score of 1.

---

### **Daily Updates**

Runs every midnight (`EVERY_DAY_AT_MIDNIGHT`):

1. **Recalculate trending score for posts/reels**
   - Considers all interactions (not just last 3 days).

2. **Reset inactive content**
   - Any post or reel with **no interactions** has its `trendingScore` reset to 0.

---

### **5. SQL Update Logic**

**Trending score update** (simplified):

```sql
UPDATE Post p
SET trendingScore =
    COALESCE(l.likes_count,0)*1 +
    COALESCE(c.comments_count,0)*3 +
    COALESCE(b.bookmarks_count,0)*4
FROM (
    SELECT postId, COUNT(*) AS likes_count FROM PostLike WHERE createdAt >= NOW() - INTERVAL '3 days' GROUP BY postId
) l
LEFT JOIN (
    SELECT postId, COUNT(*) AS comments_count FROM Comment WHERE createdAt >= NOW() - INTERVAL '3 days' GROUP BY postId
) c ON c.postId = l.postId
LEFT JOIN (
    SELECT postId, COUNT(*) AS bookmarks_count FROM Bookmark WHERE bookMarkType='POST' AND createdAt >= NOW() - INTERVAL '3 days' GROUP BY postId
) b ON b.postId = l.postId
WHERE p.isDeleted=false AND p.isHidden=false AND p.id=l.postId;
```

- Similar queries are run for reels and stories (with story-specific weights).

---

### **6. Notes**

- **Trending is dynamic**: Hourly cron prioritizes recent engagement; daily cron ensures older posts/reels adjust their trending score.
- **Inactive content reset**: Posts/reels without any engagement are zeroed out daily.
- **Stories**: Only last 1-day stories are considered for trending.

---

### **7. Flow Diagram (Conceptual)**

1. Cron triggers hourly or daily.
2. Fetch posts/reels/stories.
3. Count interactions:
   - Likes
   - Comments
   - Bookmarks
   - Views & likes (stories)

4. Apply weighted formula.
5. Update `trendingScore`.
6. Apply base score to low/no-interaction content.
7. Reset inactive content daily.

---
