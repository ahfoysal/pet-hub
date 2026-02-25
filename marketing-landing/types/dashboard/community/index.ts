export type Visibility = "PUBLIC" | "FRIENDS" | "PRIVATE";

// Friendship status for posts - indicates relationship between current user and post author
export type FriendshipStatus = "NONE" | "PENDING" | "ACCEPTED" | "BLOCKED";

export interface User {
  id: string;
  fullName: string;
  userName?: string;
  image: string | null;
}

export interface Post {
  id: string;
  caption: string;
  location?: string;
  media: string[];
  visibility: Visibility;
  isCommentAllowed: boolean;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isSaved: boolean;
  user?: User;
  author?: User; // API returns either user or author
  friendShipStatus?: FriendshipStatus; // Relationship status with post author
  createdAt: string;
  updatedAt: string;
}

export interface PostDetail extends Post {
  // Any extra fields for single post detail
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  media: string;
  caption?: string;
  location?: string;
  visibility: Visibility;
  isPublished: boolean;
  isViewed: boolean;
  isLiked: boolean;
  likeCount: number;
  viewCount: number;
  remainingHours?: number;
  createdAt: string;
  storyReplies?: Array<{
    id: string;
    comment: string;
    user: User;
    createdAt: string;
  }>;
}

export interface MyStory extends Story {
  // Owner specific story fields
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StoriesResponse {
  items: Story[];
  nextCursor?: string;
}

export interface MyStoriesResponse {
  items: MyStory[];
  nextCursor?: string;
}

export interface PostsResponse {
  items: Post[];
  nextCursor?: string;
}

export interface CommentsResponse {
  comments: Comment[];
  nextCursor?: string;
}

export interface StoryActionResponse {
  liked?: boolean;
  viewed?: boolean;
}

export interface PostActionResponse {
  liked: boolean;
  likeCount: number;
}

export interface CommentActionResponse {
  liked: boolean;
  likeCount: number;
}

export interface PostLikedByResponse {
  users: User[];
}

export interface CommentDetail extends Comment {
  // Detail view fields
}

export interface GetPostsParams {
  limit?: number;
  cursor?: string;
}

export interface GetStoriesParams {
  limit?: number;
  cursor?: string;
}

export interface GetCommentsParams {
  postId: string;
  limit?: number;
  cursor?: string;
}

export interface StoryVisibilityPayload {
  id: string;
  visibility: Visibility;
}

export interface EditCommentPayload {
  commentId: string;
  content: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId?: string;
  reelId?: string;
  post?: Post;
  createdAt: string;
}

export interface BookmarksResponse {
  items: Bookmark[];
  nextCursor?: string;
}
