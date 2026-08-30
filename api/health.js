module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shishir Media API is working!',
    developer: 'Shishir Islam'
  });
};
