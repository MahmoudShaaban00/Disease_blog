"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, deletePost, updatePost } from "@/lib/postsSlice";
import { getComment, createComment, deleteComment, editComment } from "@/lib/commentSlice";

export default function PostsPage() {
  const dispatch = useDispatch<any>();
  const { allPosts, loading, error } = useSelector((state: State) => state.posts);
  const { comments } = useSelector((state: State) => state.comment);

  const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // New state: track which posts have the comment input shown
  const [showCommentInputFor, setShowCommentInputFor] = useState<Set<string>>(new Set());

  // New state: track comment text per post
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});

  // New state: track editing comment
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>("");


  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (!editImageFile) {
      setEditImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(editImageFile);
    setEditImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [editImageFile]);

  // Toggle comments visibility
  function toggleComments(postId: string) {
    dispatch(getComment(postId));
    setVisibleComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  }

  // Toggle post expansion
  function toggleExpanded(postId: string) {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  }

  // Handle delete post
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deletePost(id)).unwrap();
      await dispatch(getAllPosts());
    } catch (error) {
      alert("Failed to delete post");
      console.error(error);
    }
  };

  // Start editing a post
  const startEditing = (post: any) => {
    setEditingPostId(post.id);
    setEditBody(post.content);
    setEditImageFile(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPostId(null);
    setEditBody("");
    setEditImageFile(null);
  };

  // Handle update submit
  const handleUpdateSubmit = async (postId: string) => {
    if (!editBody.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    const UserId = localStorage.getItem("userId") || "";

    const formdata = new FormData();
    formdata.append("Id", postId);
    formdata.append("UserId", UserId);
    formdata.append("Content", editBody);
    if (editImageFile) formdata.append("Image", editImageFile);

    try {
      await dispatch(updatePost({ postId, formdata })).unwrap();
      cancelEditing();
      await dispatch(getAllPosts());
    } catch (error) {
      alert("Failed to update post");
      console.error(error);
    }
  };

  // Toggle the comment input visibility per post
  const toggleCommentInput = (postId: string) => {
    setShowCommentInputFor((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  // Handle comment input change per post
  const handleCommentChange = (postId: string, value: string) => {
    setCommentText((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Submit comment per post
  const handleCreateComment = async (postId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = commentText[postId]?.trim();
    if (!content) {
      alert("Comment cannot be empty");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      // Dispatch your createComment thunk action here
      // Assuming createComment takes {postId, userId, content}
      await dispatch(createComment({ postId, userId, content })).unwrap();

      // Clear input and hide comment form
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentInputFor((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });

      // Refresh comments for this post
      dispatch(getComment(postId));
    } catch (error) {
      alert("Failed to create comment");
      console.error(error);
    }
  };

  // handle Delete 
  const handleDeleteComment = (postId: string, commentId: string) => {
    dispatch(deleteComment({ postId, commentId }));
  };

  // Start editing a comment
  const startEditingComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(content);
  };

  // Handle comment update submit
  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  //handle update comment
  const handleUpdateComment = async (postId: string, commentId: number) => {
    if (!editCommentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      await dispatch(editComment({ postId, commentId, content: editCommentText })).unwrap();
      setEditingCommentId(null);
      setEditCommentText("");
      dispatch(getComment(postId));
    } catch (err) {
      alert("Failed to update comment");
      console.error(err);
    }
  };

  return (
    <div className="p-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Fetched Posts</h1>

      {loading && <p className="text-blue-600 font-medium">Loading posts...</p>}
      {error && <p className="text-red-600 font-semibold">Error: {error}</p>}

      {!loading && !error && allPosts?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {allPosts.map((post: any) => {
            const isExpanded = expandedPosts.has(post.id);
            const isLong = post.content.length > 200;
            const previewText = post.content.slice(0, 200);
            const showCommentInput = showCommentInputFor.has(post.id);

            return (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col transition hover:shadow-xl"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={post.userProgilePictureUrl || "/default-profile.png"}
                    alt={post.name || "User"}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{post.name || "Unknown"}</p>
                    <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
                  </div>
                </div>

                {/* Post Content or Edit Form */}
                {editingPostId === post.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateSubmit(post.id);
                    }}
                    className="bg-gray-50 border border-gray-300 rounded-xl p-5 shadow-inner space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Edit Post</h2>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-600">Post Content</label>
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={5}
                        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Update your post content..."
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-600">Upload New Image (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setEditImageFile(e.target.files[0]);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md
                          file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100 transition"
                      />
                      {(editImagePreview || post.imageUrl) && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-gray-300">
                          <img
                            src={editImagePreview || post.imageUrl}
                            alt="Post Preview"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200"
                      />
                    )}
                    <p className="text-gray-800 whitespace-pre-line flex-grow text-base leading-relaxed">
                      {isLong && !isExpanded ? previewText + "..." : post.content}
                    </p>
                    {isLong && (
                      <button
                        onClick={() => toggleExpanded(post.id)}
                        className="mt-2 text-sm text-blue-600 hover:underline font-medium"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}

                    <button
                      onClick={() => toggleCommentInput(post.id)}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      {showCommentInput ? "Cancel Comment" : "Create Comment"}
                    </button>

                    {/* Comment input form */}
                    {showCommentInput && (
                      <form
                        onSubmit={(e) => handleCreateComment(post.id, e)}
                        className="mt-2"
                      >
                        <input
                          type="text"
                          name="content"
                          placeholder="Write your comment..."
                          value={commentText[post.id] || ""}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                          type="submit"
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Submit Comment
                        </button>
                      </form>
                    )}

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="mt-4 w-full self-start px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                      {visibleComments.has(post.id)
                        ? "Hide Comments"
                        : `Show Comments (${post.commentsCount ?? 0})`}
                    </button>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => startEditing(post)}
                        className="flex-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}

                {/* show comment */}
               {/* show comment */}
{visibleComments.has(post.id) && comments[post.id] && (
  <div className="mt-6 border-t border-gray-300 pt-4">
    <ul className="space-y-4">
      {comments[post.id].length > 0 ? (
        comments[post.id].map((comment: any) => {
          if (!comment) return null; // defensive check

          return (
            <li key={comment.id} className="flex items-start gap-3">
              <img
                src={comment.userImageUrl || "/default-profile.png"}
                alt={comment.name}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="bg-gray-100 p-3 rounded-xl w-full shadow-sm">
                <div className="flex justify-between mb-1">
                  <p className="font-semibold text-gray-800">{comment.name}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.time).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {editingCommentId === comment.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateComment(comment.postId, comment.id);
                      }}
                    >
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full p-2 border border-gray-400 rounded-md"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditingComment}
                          className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 flex-1 break-words">{comment.content}</p>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDeleteComment(comment.postId, comment.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => startEditingComment(comment.id, comment.content)}
                          className="px-3 py-1 bg-yellow-400 text-white text-sm rounded-lg hover:bg-yellow-500 transition"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })
      ) : (
        <p className="text-gray-600 text-sm">No comments yet.</p>
      )}
    </ul>
  </div>
)}

              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && (!allPosts || allPosts.length === 0) && (
        <p className="text-gray-600 text-center mt-10 text-lg">No posts available.</p>
      )}
    </div>
  );
}
