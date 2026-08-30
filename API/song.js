const axios = require('axios');

// Jamendo Client ID
const CLIENT_ID = 'b7a0cb7d';

module.exports = async (req, res) => {
  try {
    // শুধুমাত্র GET request
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

    // Example:
    // /api/song?q=rock
    const query = String(req.query.q || '').trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a song name. Example: ?q=rock'
      });
    }

    // Search Jamendo tracks
    const { data } = await axios.get(
      'https://api.jamendo.com/v3.0/tracks/',
      {
        params: {
          client_id: CLIENT_ID,
          format: 'json',
          limit: 1,
          namesearch: query,
          audioformat: 'mp32'
        },
        timeout: 15000
      }
    );

    // কোনো result না পাওয়া গেলে
    if (
      !data ||
      !Array.isArray(data.results) ||
      data.results.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: 'No song found'
      });
    }

    const track = data.results[0];

    // Streaming audio URL
    const audioUrl = track.audio || null;

    if (!audioUrl) {
      return res.status(404).json({
        success: false,
        message: 'Audio URL not available for this track'
      });
    }

    // Final response
    return res.status(200).json({
      success: true,

      result: {
        id: track.id,

        title:
          track.name ||
          'Unknown Title',

        artist:
          track.artist_name ||
          'Unknown Artist',

        album:
          track.album_name ||
          null,

        duration:
          track.duration ||
          null,

        image:
          track.image ||
          track.album_image ||
          null,

        // WhatsApp bot এই URL ব্যবহার করবে
        audioUrl: audioUrl,

        // Download permission
        downloadAllowed:
          track.audiodownload_allowed === true,

        license:
          track.license_ccurl ||
          null,

        website:
          track.shareurl ||
          null
      }
    });

  } catch (error) {

    console.error(
      '[JAMENDO SONG API ERROR]',
      error.response?.data ||
      error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Song API failed',

      error:
        error.response?.data?.error_message ||
        error.message
    });
  }
};
