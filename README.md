# Express Image Upload Using Multer

### The Form
```html
<form class="form new-project-form" id="project-form">
  <div class="form-group">
    <label for="project-name">project name:</label>
    <input class="form-input" type="text" id="project-name" name="project-name" />
  </div>
  <div class="form-group">
    <label for="project-funding">needed funding ($):</label>
    <input class="form-input" type="number" id="project-funding" name="project-funding" />
  </div>
  <div class="form-group">
    <label for="project-desc">description:</label>
    <textarea class="form-input" id="project-desc" name="project-desc"></textarea>
  </div>
  <div class="form-group">
    <label for="project-img">image:</label>
    <input type="file" id="project-img" name="project-img" />
  </div>
  <div class="form-group">
    <button type="submit" class="btn btn-primary">Create</button>
  </div>
</form>
```

### Frontend JS
```javascript
const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#project-name').value.trim();
  const needed_funding = document
    .querySelector('#project-funding')
    .value.trim();
  const description = document.querySelector('#project-desc').value.trim();
  const image = document.getElementById('project-img').files[0];

  if (name && needed_funding && description) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('needed_funding', needed_funding);
    formData.append('description', description);
    formData.append('image', image);

    const response = await fetch(`/api/projects`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};
```

### Backend JS
```javascript
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
```

### Sequelize Model
```javascript
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Project extends Model {}

Project.init(
  {
    // ...
    image: {
      type: DataTypes.STRING,
      defaultValue: 'default.png',
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'project',
  }
);

module.exports = Project;
```

### Rendering Image with Handlebars
```html
{{#each projects as |project|}}
<div class="row mb-2">
  <div class="col-md-2">
    <img class="project-img" src="/images/{{image}}" alt="Project Image">
  </div>
  <!-- ... -->
</div>
{{/each}}
```