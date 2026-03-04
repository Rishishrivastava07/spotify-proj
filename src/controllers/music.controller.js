const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");

function parseMusicIds(body) {
  const value = body.musics ?? body.musicIds ?? body.music;

  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  const text = value.trim();
  if (!text) return [];

  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return text.split(",").map((id) => id.trim()).filter(Boolean);
}

async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!file) {
    return res
      .status(400)
      .json({ message: "Music file is required (field name: music)" });
  }

  try {
    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id,
    });

    res.status(200).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to upload music" });
  }
}

async function createAlbum(req, res) {
  const { title } = req.body;
  const musics = parseMusicIds(req.body);

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!Array.isArray(musics) || musics.length === 0) {
    return res.status(400).json({
      message:
        "Provide at least one music id in musics (or musicIds/music) as an array",
    });
  }

  const album = await albumModel.create({
    title,
    music: musics,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      music: album.music,
      artist: album.artist,
    },
  });
}

async function getMusic(req, res) {
  const musics = await musicModel.find().populate("artist", "username");
  res.status(200).json({
    message: "Music retrieved successfully",
    musics,
  });
}

async function getAlbums(req, res) {
  const albums = await albumModel
    .find()
    .populate("artist", "username")
    .populate("music", "title uri");
  res.status(200).json({
    message: "Albums retrieved successfully",
    albums,
  });
}

module.exports = {
  createMusic,
  createAlbum,
  getMusic,
  getAlbums,
};
