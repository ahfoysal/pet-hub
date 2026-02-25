# CronJobService Documentation

This service manages **scheduled tasks** for trending content, stories, user suspension, and pet sitter bookings.

All cron jobs use NestJS `@Cron` decorators with **Prisma ORM**. They include **batch processing** to reduce database load and prevent race conditions.

---

## 1. **Trending Scores**

### a) Hourly Update

```ts
@Cron(CronExpression.EVERY_HOUR)
updateTrendingScoresHourly()
```

**Runs:** Every hour, on the hour.

**Purpose:**

- Recalculate trending scores for **Posts, Reels, and Stories** based on recent interactions.

**What it does:**

1. **Stories:** Updates trending score for content created in the last 24 hours.
   - Formula: `trendingScore = viewCount * 0.6 + likeCount * 0.4`

2. **Posts/Reels:** Updates trending score for interactions in the last 3 days.
   - Formula: `trendingScore = likes_count*1 + comments_count*3 + bookmarks_count*4`

3. **Base Score:** Applies a base score of 1 for newly created posts/reels with zero trending score.

**Effects:**

- Highlights trending content hourly.
- Only affects active content (`isDeleted = false` and `isHidden = false`).

---

### b) Daily Update

```ts
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
updateTrendingScoresDaily()
```

**Runs:** Every day at 00:00.

**Purpose:**

- Recalculate trending scores for all historical Posts and Reels.
- Reset inactive content with no engagement.

**What it does:**

1. Updates trending scores without interval filters (all time).
2. Resets `trendingScore = 0` for content with no likes, comments, or bookmarks.

**Effects:**

- Ensures old content without engagement does not appear as trending.

---

## 2. **Story Expiration**

```ts
@Cron(CronExpression.EVERY_5_MINUTES)
expireStories()
```

**Runs:** Every 5 minutes.

**Purpose:**

- Expire stories that have reached their `expiresAt` time.

**What it does:**

1. Fetches stories where `expiresAt < now()` and `isPublished = true`.
2. Processes stories in batches of 100.
3. Marks each batch as unpublished (`isPublished = false`).
4. Creates `Moment` entries for tracking expired stories.
5. Logs the number of stories expired.

**Effects:**

- Automatically removes stories after their lifetime.
- Prevents old content from appearing in feeds.

**Notes:**

- Frequency reduced from every minute to every 5 minutes to reduce DB load while maintaining near-real-time expiration.

---

## 3. **User Suspension Expiration**

```ts
@Cron(CronExpression.EVERY_5_MINUTES)
suspendUserExpiration()
```

**Runs:** Every 5 minutes.

**Purpose:**

- Reactivate users whose suspension period has ended.

**What it does:**

1. Fetch users with `status = SUSPENDED` and `suspendUntil < now()`.
2. Updates user `status = ACTIVE`, clears `suspendUntil` and `suspendReason`.
3. Logs the number of reactivated users.

**Effects:**

- Automatically restores access for users whose suspension ended.
- Keeps suspension enforcement up to date.

---

## 4. **Mark Late Pet Sitter Bookings**

```ts
@Cron(CronExpression.EVERY_5_MINUTES)
markLatePetSitterBookings()
```

**Runs:** Every 5 minutes.

**Purpose:**

- Marks **CONFIRMED bookings** as **LATE** if the pet sitter hasn’t started after the scheduled start time.

**What it does:**

1. Fetch bookings where:
   - `status = CONFIRMED`
   - `startingTime < now()`
   - `isLate = false`

2. Processes bookings in batches of 50.

3. Updates each batch: `status = LATE`, `isLate = true`.

4. Logs the number of bookings updated.

**Effects:**

- Flags overdue bookings.
- Only runs on bookings not previously marked late.

**Notes:**

- `minutesLate` is **not calculated here**; it is updated later when the booking is marked **IN_PROGRESS**.
- Frequency reduced from every minute to every 5 minutes to balance performance and timeliness.

---

## 5. **Expire Pending Bookings (Grace Period)**

```ts
@Cron(CronExpression.EVERY_10_MINUTES)
expirePendingBookings()
```

**Runs:** Every 10 minutes.

**Purpose:**

- Automatically expires **PENDING bookings** that were not confirmed by the pet sitter within a **15-minute grace period**.

**What it does:**

1. Calculate cutoff time: `cutoff = now - 15 minutes`.
2. Fetch bookings with `status = PENDING` and `startingTime < cutoff`.
3. Process bookings in batches of 50.
4. Update each batch: `status = EXPIRED`.
5. Logs the number of bookings expired.

**Effects:**

- Ensures timely handling of unconfirmed bookings.
- Prevents clients from waiting indefinitely for confirmation.

---

## ⚡ **Concurrency, Race Conditions & Batch Handling**

- **Batch Processing:**
  - Heavy operations (bookings, stories) are processed in batches of 50–100 to reduce DB load.

- **Race Condition Mitigation:**
  - `markLatePetSitterBookings()` updates only bookings with `isLate = false`.
  - `expirePendingBookings()` updates only `PENDING` bookings beyond the grace period.
  - `markAsInProgress` API performs an **atomic transaction** to update status and `minutesLate`, avoiding conflicts with cron jobs.

---

## ✅ **Booking Status Cron Flow**

| Status        | Cron Job / Trigger        | Condition                               | Update                                                |
| ------------- | ------------------------- | --------------------------------------- | ----------------------------------------------------- |
| `PENDING`     | expirePendingBookings     | `startingTime + 15min < now`            | `EXPIRED`                                             |
| `CONFIRMED`   | markLatePetSitterBookings | `startingTime < now` & `isLate = false` | `LATE` + `isLate = true`                              |
| `IN_PROGRESS` | API (`markAsInProgress`)  | Manual start by pet sitter              | `status = IN_PROGRESS`, `minutesLate` updated if late |

---
