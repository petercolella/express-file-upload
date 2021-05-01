const router = require('express').Router();
const { Project } = require('../../models');
const withAuth = require('../../utils/auth');
const multer = require('multer');

// From Multer documentation: https://github.com/expressjs/multer#diskstorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '../../../public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// The upload.single() middleware is used when a single file is expected:
// https://github.com/expressjs/multer#singlefieldname
router.post('/', withAuth, upload.single('image'), async (req, res) => {
  // req.file is the 'image' file.
  console.log('req.file', req.file);

  try {
    const newProject = await Project.create({
      ...req.body,
      // If no image was uploaded, undefined is returned, and the project is created with the default image.
      image: req.file && req.file.originalname,
      user_id: req.session.user_id,
    });

    res.status(200).json(newProject);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
