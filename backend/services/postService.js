const Post = require("../models/Posts");
const File = require("../models/File");
const PostLikes = require("../models/PostLikes");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file) => {
  const { originalname, mimetype, buffer } = file;
  const filename = `${Date.now()}-${originalname}`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, buffer);

  const newFile = new File({
    filename,
    originalName: originalname,
    path: filePath,
    fileType: mimetype.startsWith("image") ? "image" : "video",
    mimeType: mimetype,
    size: buffer.length,
  });

  await newFile.save();
  return newFile._id;
};

const createPost = async (title, content, files, userId, clubId, boardId) => {
  const fileIds = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const fileId = await saveFile(file);
      fileIds.push(fileId);
    }
  }

  const newPost = new Post({
    title,
    content,
    files: fileIds,
    created_at: new Date(),
    created_by: userId,
    club_id: clubId,
    board_id: boardId,
  });

  await newPost.save();
  return newPost;
};

const getPosts = async (query = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const posts = await Post.find(query)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .populate("files")
    .populate("created_by", "username profile_pic")
    .lean();

  const total = await Post.countDocuments(query);

  // Get like counts and reaction/vote summaries for each post
  const postsWithEngagement = await Promise.all(
    posts.map(async (post) => {
      const likeCount = await PostLikes.countDocuments({ post_id: post._id });

      // Calculate reaction counts
      const reactionCounts = {};
      post.reactions.forEach((r) => {
        reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
      });

      // Calculate vote counts
      const upvotes = post.votes.filter((v) => v.vote === 1).length;
      const downvotes = post.votes.filter((v) => v.vote === -1).length;
      const netVotes = upvotes - downvotes;

      return {
        ...post,
        likeCount,
        reactionCount:reactionCounts,
        upvotes,
        downvotes,
        netVotes,
      };
    })
  );

  return {
    posts: postsWithEngagement,
    totalPosts: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId)
    .populate("files")
    .populate("created_by", "username profile_pic")
    .lean();

  if (!post) {
    throw new Error("Post not found");
  }

  const likeCount = await PostLikes.countDocuments({ post_id: postId });

  // Calculate reaction counts
  const reactionCounts = {};
  post.reactions.forEach((r) => {
    reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
  });

  // Calculate vote counts
  const upvotes = post.votes.filter((v) => v.vote === 1).length;
  const downvotes = post.votes.filter((v) => v.vote === -1).length;
  const netVotes = upvotes - downvotes;

  return {
    ...post,
    likeCount,
    reactions: reactionCounts,
    upvotes,
    downvotes,
    netVotes,
  };
};

const likePost = async (postId, userId) => {
  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  // Check if user already liked the post
  const existingLike = await PostLikes.findOne({
    post_id: postId,
    user_id: userId,
  });
  if (existingLike) {
    throw new Error("You have already liked this post");
  }

  // Create new like
  const newLike = new PostLikes({
    _id: new mongoose.Types.ObjectId().toString(),
    post_id: postId,
    user_id: userId,
  });

  await newLike.save();
  return { success: true };
};

const unlikePost = async (postId, userId) => {
  // Check if like exists
  const existingLike = await PostLikes.findOne({
    post_id: postId,
    user_id: userId,
  });
  if (!existingLike) {
    throw new Error("You have not liked this post");
  }

  // Remove the like
  await PostLikes.findOneAndDelete({ post_id: postId, user_id: userId });
  return { success: true };
};

const deletePost = async (postId, userId) => {
  // Find the post and make sure it exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  // Check if user owns the post (optional, depends on your requirements)
  if (post.created_by.toString() !== userId) {
    throw new Error("Unauthorized: You can only delete your own posts");
  }

  // Delete files from filesystem and database
  if (post.files && post.files.length > 0) {
    for (const fileId of post.files) {
      const file = await File.findById(fileId);
      if (file) {
        // Delete file from filesystem
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        // Delete file from database
        await File.findByIdAndDelete(fileId);
      }
    }
  }

  // Delete all likes associated with the post
  await PostLikes.deleteMany({ post_id: postId });

  // Delete the post
  await Post.findByIdAndDelete(postId);

  return { success: true };
};

const addReaction = async (postId, userId, emoji) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  // Check if user already reacted with this emoji
  const existingReaction = post.reactions.find(
    (r) => r.user_id.toString() === userId && r.emoji === emoji
  );

  if (existingReaction) {
    throw new Error("You have already reacted with this emoji");
  }

  // Remove any existing reaction from this user
  post.reactions = post.reactions.filter(
    (r) => r.user_id.toString() !== userId
  );

  // Add new reaction
  post.reactions.push({ user_id: userId, emoji });
  await post.save();
  return { success: true };
};

const removeReaction = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const initialCount = post.reactions.length;
  post.reactions = post.reactions.filter(
    (r) => r.user_id.toString() !== userId
  );

  if (post.reactions.length === initialCount) {
    throw new Error("No reaction found to remove");
  }

  await post.save();
  return { success: true };
};

const addVote = async (postId, userId, voteValue) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  // Check if user already voted
  const existingVoteIndex = post.votes.findIndex(
    (v) => v.user_id.toString() === userId
  );

  if (existingVoteIndex !== -1) {
    // Update existing vote
    post.votes[existingVoteIndex].vote = voteValue;
  } else {
    // Add new vote
    post.votes.push({ user_id: userId, vote: voteValue });
  }

  await post.save();
  return { success: true };
};

const removeVote = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const initialCount = post.votes.length;
  post.votes = post.votes.filter((v) => v.user_id.toString() !== userId);

  if (post.votes.length === initialCount) {
    throw new Error("No vote found to remove");
  }

  await post.save();
  return { success: true };
};

const getReactions = async (postId) => {
  const post = await Post.findById(postId)
    .select("reactions")
    .populate("reactions.user_id", "username profile_pic")
    .lean();

  if (!post) {
    throw new Error("Post not found");
  }

  return post.reactions;
};

const getVotes = async (postId) => {
  const post = await Post.findById(postId)
    .select("votes")
    .populate("votes.user_id", "username profile_pic")
    .lean();

  if (!post) {
    throw new Error("Post not found");
  }

  // Calculate upvotes and downvotes
  const upvotes = post.votes.filter((v) => v.vote === 1).length;
  const downvotes = post.votes.filter((v) => v.vote === -1).length;
  const netVotes = upvotes - downvotes;

  return {
    votes: post.votes,
    upvotes,
    downvotes,
    netVotes,
  };
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  likePost,
  unlikePost,
  deletePost,
  addReaction,
  removeReaction,
  addVote,
  removeVote,
  getReactions,
  getVotes,
};
