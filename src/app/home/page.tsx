"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, deletePost, updatePost } from "@/lib/postsSlice";
import { getComment, createComment, deleteComment, editComment } from "@/lib/commentSlice";

export default function PostsPage() {
  const dispatch = useDispatch<any>();
  const { allPosts, loading, error } = useSelector((state: any) => state.posts);
  const { comments } = useSelector((state: any) => state.comment);

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [visibleCommentPostId, setVisibleCommentPostId] = useState<string | null>(null);
  const [commentInputPostId, setCommentInputPostId] = useState<string | null>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});
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

  // Toggle read more / less for post content
  function toggleExpanded(postId: string) {
    setExpandedPostId((current) => (current === postId ? null : postId));
  }

  // Toggle comments visibility for one post
  function toggleComments(postId: string) {
    if (visibleCommentPostId === postId) {
      setVisibleCommentPostId(null);
    } else {
      dispatch(getComment(postId));
      setVisibleCommentPostId(postId);
    }
  }

  // Toggle comment input visibility for one post
  function toggleCommentInput(postId: string) {
    setCommentInputPostId((current) => (current === postId ? null : postId));
  }

  // Delete a post
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

  // Submit post update
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

  // Handle comment text change per post
  const handleCommentChange = (postId: string, value: string) => {
    setCommentText((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Submit a new comment for a post
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
      await dispatch(createComment({ postId, userId, content })).unwrap();
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      setCommentInputPostId(null);
      dispatch(getComment(postId));
    } catch (error) {
      alert("Failed to create comment");
      console.error(error);
    }
  };

  // Delete comment
  const handleDeleteComment = (postId: string, commentId: string) => {
    dispatch(deleteComment({ postId, commentId }));
  };

  // Start editing a comment
  const startEditingComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(content);
  };

  // Cancel comment editing
  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  // Update comment submit
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
    <div className="p-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 drop-shadow-sm">Fetched Posts</h1>

      {loading && <p className="text-blue-600 font-medium">Loading posts...</p>}
      {error && <p className="text-red-600 font-semibold">Error: {error}</p>}

      {!loading && !error && allPosts?.length > 0 && (
        <div className="flex flex-col gap-10">
          {allPosts.map((post: any) => {
            const isExpanded = expandedPostId === post.id;
            const isLong = post.content.length > 200;
            const previewText = post.content.slice(0, 200);
            const showCommentInput = commentInputPostId === post.id;
            const showComments = visibleCommentPostId === post.id;

            return (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col transition-transform duration-300 hover:shadow-xl hover:scale-[1.02] w-3/4 mx-auto"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 mb-5 ">
                  <img
                    src={post.userProgilePictureUrl || "/default-profile.png"}
                    alt={post.name || "User"}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-lg text-gray-800 drop-shadow-sm">{post.name || "Unknown"}</p>
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
                        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 transition"
                      />
                      {(editImagePreview || post.imageUrl) && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-gray-300">
                          <img
                            src={editImagePreview || post.imageUrl}
                            alt="Post Preview"
                            className="w-full h-48 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
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
                        className="w-full h-80 object-cover rounded-xl mb-4 border border-gray-200 shadow-sm"
                      />
                    )}
                    <p className="text-gray-800 whitespace-pre-line flex-grow text-base leading-relaxed">
                      {isLong && !isExpanded ? previewText + "..." : post.content}
                    </p>
                    {isLong && (
                      <button
                        onClick={() => toggleExpanded(post.id)}
                        className="mt-2 text-sm text-indigo-600 hover:underline font-medium"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}

                    <div className="mt-4 md:flex md:justify-between gap-3 ">
                      <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <button
                          onClick={() => toggleCommentInput(post.id)}
                          className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-300
                        ${showCommentInput ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                        >
                          {showCommentInput ? "Cancel Comment" : "Create Comment"}
                        </button>

                        <button
                          onClick={() => toggleComments(post.id)}
                          className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                        >
                          {showComments ? "Hide Comments" : `Show Comments (${post.commentsCount ?? 0})`}
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => startEditing(post)}
                          className="px-4 py-2 rounded-lg font-semibold text-white bg-yellow-400 hover:bg-yellow-500 transition-colors duration-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Comment input form */}
                    {showCommentInput && (
                      <form onSubmit={(e) => handleCreateComment(post.id, e)} className="mt-4">
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
                          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                          Submit Comment
                        </button>
                      </form>
                    )}

                    {/* Comments list */}
                    {showComments && comments[post.id] && (
                      <div className="mt-6 border-t border-gray-300 pt-4">
                        <ul className="space-y-4">
                          {comments[post.id].length > 0 ? (
                            comments[post.id].map((comment: any) => {
                              if (!comment) return null;

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
                  </>
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
