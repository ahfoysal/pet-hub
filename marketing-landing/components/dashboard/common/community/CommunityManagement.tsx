"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, PenSquare, MessageCircle, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { StoriesCarousel } from "./stories/StoriesCarousel";
import { SocialsFeed } from "./posts/SocialsFeed";
import { CreatePostModal } from "./modals/CreatePostModal";
import { CreateStoryModal } from "./modals/CreateStoryModal";
import { PostDetailModal } from "./modals/PostDetailModal";
import { StoryViewerModal } from "./modals/StoryViewerModal";
import { EditPostModal } from "./modals/EditPostModal";
import { UserProfileModal } from "./modals/UserProfileModal";
import { CreateCommunityModal } from "../chat/CreateCommunityModal";
import { Post, Story, User, FriendshipStatus } from "@/types/dashboard/community";
import { useGetStoriesQuery } from "@/redux/features/api/dashboard/common/communityApi";
import { useGetFriendSuggestionsQuery } from "@/redux/features/api/dashboard/common/friendshipApi";
import { useSocket } from "@/providers/SocketProvider";
import { useSession } from "next-auth/react";

// Type for user click info passed from posts
interface UserClickInfo {
  userId: string;
  fullName?: string;
  userName?: string;
  image?: string | null;
  friendshipStatus?: FriendshipStatus;
}

interface CommunityManagementProps {
  onMessage?: () => void;
  onUserClick?: (userId: string) => void;
  onStartChat?: (userId: string) => void;
}

export function CommunityManagement({
  onMessage,
  onUserClick,
  onStartChat,
}: CommunityManagementProps) {
  const { status } = useSession();
  const currentUser = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;
  const [searchQuery, setSearchQuery] = useState("");
  const [feedType, setFeedType] = useState<"all" | "saved">("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null,
  );
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isShowAllUsersOpen, setIsShowAllUsersOpen] = useState(false);
  
  // User profile modal state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserFriendshipStatus, setSelectedUserFriendshipStatus] = useState<FriendshipStatus>("NONE");
  const [selectedUserInfo, setSelectedUserInfo] = useState<{
    fullName?: string;
    userName?: string;
    image?: string | null;
  } | null>(null);

  // Get stories for the viewer with forced refetch
  const { data: storiesData, refetch: refetchStories } = useGetStoriesQuery(
    { limit: 50 },
    { refetchOnMountOrArgChange: true, skip: status === "loading" },
  );
  const stories = storiesData?.data?.items || [];
  
  // Get friend suggestions for "See All Users"
  const { data: suggestionsData } = useGetFriendSuggestionsQuery({ limit: 20 }, { skip: status === "loading" });
  const allSuggestedUsers = suggestionsData?.data?.users || [];
  
  // Get online friends from socket
  const { onlineFriends, getOnlineFriends, isConnected } = useSocket();
  
  // Fetch online friends on mount
  useEffect(() => {
    if (isConnected) {
      getOnlineFriends();
    }
  }, [isConnected, getOnlineFriends]);
  
  // Use socket's onlineFriends for Active Now, fallback to filtering suggestions
  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);
  const activeNowUsers = onlineFriends.length > 0 
    ? onlineFriends.map(f => ({
        userId: f.id,
        fullName: f.fullName,
        userName: f.userName,
        image: f.image,
      }))
    : allSuggestedUsers.filter(user => onlineUsers[user.userId]);

  const handleStoryClick = (story: Story) => {
    const index = stories.findIndex((s: Story) => s.id === story.id);
    setSelectedStoryIndex(index >= 0 ? index : 0);
  };

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsEditPostOpen(true);
  };

  const handlePostUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  
  // Handle user click - open profile modal
  const handleUserClick = (info: UserClickInfo) => {
    // Don't show modal for current user
    const currentUserId = (currentUser as any)?._id || (currentUser as any)?.id;
    if (info.userId === currentUserId) return;
    
    setSelectedUserId(info.userId);
    setSelectedUserFriendshipStatus(info.friendshipStatus || "NONE");
    setSelectedUserInfo({
      fullName: info.fullName,
      userName: info.userName,
      image: info.image,
    });
    onUserClick?.(info.userId);
  };
  
  // Handle start chat from profile modal
  const handleStartChat = (userId: string) => {
    setSelectedUserId(null);
    onStartChat?.(userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Community Management
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage posts, stories, and community interactions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ff5252] transition-colors shadow-sm"
              >
                <PenSquare size={18} />
                <span className="hidden sm:inline">Create Post</span>
              </button>
              <button
                onClick={onMessage}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle size={18} />
                <span className="hidden sm:inline">Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feed Tabs */}
            <div className="flex bg-white/50 rounded-xl p-1 gap-1">
              <button
                onClick={() => setFeedType("all")}
                className={`px-6 py-2 text-sm font-bold transition-all rounded-lg ${
                  feedType === "all"
                    ? "bg-[#FF6B6B] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFeedType("saved")}
                className={`px-6 py-2 text-sm font-bold transition-all rounded-lg ${
                  feedType === "saved"
                    ? "bg-[#FF6B6B] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
              >
                Saved Posts
              </button>
            </div>

            {/* Stories Section */}
            {feedType === "all" && (
              <StoriesCarousel
                onStoryClick={handleStoryClick}
                onAddStory={() => setIsCreateStoryOpen(true)}
                showAddButton={true}
                currentUser={currentUser}
              />
            )}

            {/* Posts Feed */}
            <SocialsFeed
              key={feedType}
              feedType={feedType}
              onUserClick={handleUserClick}
              onPostClick={handlePostClick}
              onEditPost={handleEditPost}
              onPostUpdate={handlePostUpdate}
              initialLimit={10}
              refreshTrigger={refreshTrigger}
              currentUser={currentUser}
            />
          </div>

          {/* Sidebar - Active Users & Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition-colors"
                >
                  <PenSquare size={20} />
                  <span className="text-xs font-medium">New Post</span>
                </button>
                <button
                  onClick={() => setIsCreateStoryOpen(true)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                >
                  <Plus size={20} />
                  <span className="text-xs font-medium">New Story</span>
                </button>
                <button
                  onClick={() => setIsCreateCommunityOpen(true)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors col-span-2"
                >
                  <Users size={20} />
                  <span className="text-xs font-medium">Create Group</span>
                </button>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Active Now
                </h3>
                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">
                  {activeNowUsers.length} Online
                </span>
              </div>

              <div className="space-y-3">
                {activeNowUsers.length > 0 ? (
                  activeNowUsers.slice(0, 5).map((user) => (
                    <div 
                      key={user.userId}
                      onClick={() => handleUserClick({
                        userId: user.userId,
                        fullName: user.fullName,
                        userName: user.userName,
                        image: user.image,
                        friendshipStatus: "ACCEPTED",
                      })}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {user.image ? (
                            <img src={user.image} alt={user.fullName} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow-sm">
                              {user.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-[#FF6B6B] transition-colors">{user.fullName}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Active Now</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartChat(user.userId);
                        }}
                        className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users size={20} className="text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-xs px-4">No active users at the moment</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsShowAllUsersOpen(true)}
                className="w-full mt-4 py-2.5 text-sm text-[#FF6B6B] font-bold hover:bg-[#FF6B6B]/5 rounded-xl transition-all"
              >
                See All Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSuccess={() => {
          setRefreshTrigger((prev) => prev + 1);
        }}
      />

      {/* Edit Post Modal */}
      {selectedPost && (
        <EditPostModal
          isOpen={isEditPostOpen}
          onClose={() => setIsEditPostOpen(false)}
          post={selectedPost}
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onSuccess={() => {
          refetchStories();
        }}
      />

      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          isOpen={!!selectedPostId}
          onClose={() => setSelectedPostId(null)}
          currentUser={currentUser}
          onDelete={handlePostUpdate}
        />
      )}

      {selectedStoryIndex !== null && stories.length > 0 && (
        <StoryViewerModal
          stories={stories}
          initialIndex={selectedStoryIndex}
          isOpen={selectedStoryIndex !== null}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
      
      {/* Create Community/Group Modal */}
      <CreateCommunityModal
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
        onSuccess={(id) => {
          setIsCreateCommunityOpen(false);
          onStartChat?.(id); // Switch to chat tab with the new group
        }}
      />

      {/* Suggested Users Modal */}
      {isShowAllUsersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsShowAllUsersOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 px-6 bg-gray-50/50">
              <h2 className="text-lg font-bold">Suggested Users</h2>
              <button onClick={() => setIsShowAllUsersOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
              {allSuggestedUsers.map(user => (
                <div 
                  key={user.userId}
                  onClick={() => {
                    handleUserClick({
                      userId: user.userId,
                      fullName: user.fullName,
                      userName: user.userName,
                      image: user.image
                    });
                    setIsShowAllUsersOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user.image ? (
                        <img src={user.image} alt={user.fullName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white text-lg font-bold">
                          {user.fullName.charAt(0)}
                        </div>
                      )}
                      {onlineUsers[user.userId] && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500">@{user.userName || user.fullName.toLowerCase().replace(' ', '')}</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-[#FF6B6B] text-white text-xs font-bold rounded-lg hover:bg-[#ff5252]">
                    Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfileModal
          isOpen={!!selectedUserId}
          onClose={() => {
            setSelectedUserId(null);
            setSelectedUserInfo(null);
          }}
          userId={selectedUserId}
          initialFriendshipStatus={selectedUserFriendshipStatus}
          initialUserInfo={selectedUserInfo || undefined}
          onStartChat={handleStartChat}
        />
      )}
    </div>
  );
}

export default CommunityManagement;

