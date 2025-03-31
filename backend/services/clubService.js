const Club = require("../models/Clubs");
const Event = require("../models/Event");
const Post = require("../models/Posts");
const Resource = require("../models/Resource");
const Project = require("../models/Project");
const Opportunity = require("../models/Opportunities");
const Blog = require("../models/Blogs");
const Forum = require("../models/Forums");
const ClubFollow = require("../models/ClubFollow");
const File = require("../models/File");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper function to save files
async function saveFile(file) {
  if (!file || !file.buffer) {
    console.error("Error: No file buffer provided");
    return null;
  }

  const { originalname, mimetype, buffer, size } = file;
  const filename = `${Date.now()}-${originalname.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, filename);

  try {
    fs.writeFileSync(filePath, buffer);
  } catch (error) {
    console.error("Error writing file:", error);
    return null;
  }

  try {
    const newFile = new File({
      filename,
      originalName: originalname,
      path: filePath,
      fileType: mimetype.startsWith("image") ? "image" : "video",
      mimeType: mimetype,
      size,
    });

    await newFile.save();
    return newFile._id;
  } catch (error) {
    console.error("Error saving file to database:", error);
    // Clean up the file if DB save fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return null;
  }
}

// Fetch all clubs
exports.fetchAllClubs = async () => {
  return await Club.find({});
};

// Fetch clubs by board ID
exports.fetchClubsByBoardId = async (boardId) => {
  return await Club.find({ board_id: boardId });
};

// Fetch club by club ID
exports.fetchClubById = async (clubId) => {
  return await Club.findById(clubId);
};

// Delete club and all related data
exports.deleteClub = async (clubId) => {
  await Event.deleteMany({ club_id: clubId });
  await Post.deleteMany({ club_id: clubId });
  await Resource.deleteMany({ club_id: clubId });
  await Project.deleteMany({ club_id: clubId });
  await Opportunity.deleteMany({ club_id: clubId });
  await Blog.deleteMany({ club_id: clubId });
  await Forum.deleteMany({ club_id: clubId });
  return await Club.findByIdAndDelete(clubId);
};

// Edit club details by club ID
exports.editClubById = async (clubId, updateData, imageFile) => {
  try {
    const club = await Club.findById(clubId);
    if (!club) {
      throw new Error('Club not found');
    }

    // Handle image update if new image is provided
    if (imageFile) {
      const newFileId = await saveFile(imageFile);
      
      // Clean up old image if it exists
      if (club.image) {
        try {
          const oldFile = await File.findById(club.image);
          if (oldFile) {
            const oldFilePath = path.join(uploadDir, oldFile.filename);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
            await File.findByIdAndDelete(club.image);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up old file:', cleanupError);
        }
      }
      
      updateData.image = newFileId;
    }

    const updatedClub = await Club.findByIdAndUpdate(
      clubId,
      updateData,
      { new: true, runValidators: true }
    ).populate('image');

    return updatedClub;
  } catch (error) {
    // Clean up the newly uploaded file if update fails
    if (imageFile && updateData.image) {
      try {
        const newFile = await File.findById(updateData.image);
        if (newFile) {
          const filePath = path.join(uploadDir, newFile.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          await File.findByIdAndDelete(updateData.image);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up new file:', cleanupError);
      }
    }
    throw new Error(`Error updating club: ${error.message}`);
  }
};

// Create a new club
exports.createClub = async (clubData, imageFile) => {
  try {
    if (imageFile) {
      const fileId = await saveFile(imageFile);
      clubData.image = fileId;
    }

    const newClub = new Club(clubData);
    await newClub.save();
    return newClub;
  } catch (error) {
    // Clean up the uploaded file if club creation fails
    if (imageFile && clubData.image) {
      try {
        const file = await File.findById(clubData.image);
        if (file) {
          const filePath = path.join(uploadDir, file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          await File.findByIdAndDelete(clubData.image);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }
    throw new Error(`Error creating club: ${error.message}`);
  }
};

// Fetch all clubs followed by a user
exports.fetchClubsByUserId = async (userId) => {
  const follows = await ClubFollow.find({ user_id: userId }).populate("club_id");
  return follows.map((follow) => follow.club_id);
};

// Unfollow a club by user_id and club_id
exports.unfollowClub = async (userId, clubId) => {
  return await ClubFollow.findOneAndDelete({
    user_id: userId,
    club_id: clubId,
  });
};

// Follow a club by user_id and club_id
exports.followClub = async (userId, clubId) => {
  const follow = new ClubFollow({ user_id: userId, club_id: clubId });
  return await follow.save();
};