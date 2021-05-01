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

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};

document
  .querySelector('.new-project-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.project-list')
  .addEventListener('click', delButtonHandler);
