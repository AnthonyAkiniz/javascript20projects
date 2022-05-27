const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true

// Optimized for low bandwidth internet users: load initial, then more after initial

// Unsplash API - Initial Image Count Load
let initialImageCountLoad = 5;
const collections=225;
const apiKey = '1XaJpgBaoplAJ1fuvLVVMUlH-3CVf1R8YyGIGLYG4P8';
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${initialImageCountLoad}&collections=${collections}`;

// Unsplash API - After Initial Image Count Load
function afterInitialImageCountLoad (picCount) {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}&collections=${collections}`;
  }

// Check if all images were loaded, then hide loading spinner
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements For Links & Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to full photo
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });
    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Event Listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
      const response = await fetch(apiUrl);
      photosArray = await response.json();
      displayPhotos();
      if (isInitialLoad) { 
        afterInitialImageCountLoad(30) 
        isInitialLoad = false
      } 
    } catch (error) {
      // Catch Error Here
    }
  }

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();
