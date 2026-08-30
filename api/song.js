const yts = require('yt-search');

module.exports = async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide q parameter'
      });
    }

    const search = await yts(query);

    if (!search.videos || search.videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No song found'
      });
    }

    const video = search.videos[0];

    return res.status(200).json({
      success: true,
      result: {
        title: video.title || 'Unknown',
        artist: video.author?.name || 'Unknown',
        duration: video.timestamp || 'Unknown',
        thumbnail: video.thumbnail || null,
        views: video.views || 0,
        youtubeUrl: video.url,
        videoId: video.videoId
      }
    });

  } catch (error) {
    console.error('[SONG API ERROR]', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
