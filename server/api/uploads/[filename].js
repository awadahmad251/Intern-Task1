const fs = require('fs');
const path = require('path');

const uploadsDir = path.join('/tmp', 'uploads');

module.exports = (req, res) => {
  const fileName = req.query.filename || req.query.path;
  if (!fileName) {
    return res.status(404).json({ message: 'File not found.' });
  }

  const filePath = path.join(uploadsDir, path.basename(fileName));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }

  res.setHeader('Cache-Control', 'public, max-age=86400');
  return fs.createReadStream(filePath).pipe(res);
};