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

    const result = await yts(query);

    if (!result.videos || result.videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No song found'
      });
    }

    const video = result.videos[0];

    return res.status(200).json({
      success: true,
      result: {
        title: video.title || 'Unknown',
        url: video.url,
        videoId: video.videoId,
        thumbnail: video.thumbnail,
        duration: video.timestamp || 'Unknown',
        views: video.views || 0,
        author: video.author?.name || 'Unknown'
      }
    });

  } catch (error) {
    console.error('[SONG SEARCH ERROR]', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
