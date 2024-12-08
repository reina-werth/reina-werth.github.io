// Video
let video;
let label = "Upload an Image";
let confidence = 0.0;
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/R1ff7lXqa/';

let input;
let img;

// STEP 1: Load the model!
function preload() {
  try {
    classifier = ml5.imageClassifier(modelURL + 'model.json', modelLoaded);
  } catch (error) {
    console.error("Error loading the model:", error);
  }
}

function modelLoaded() {
  console.log("Model loaded successfully!");
}

// Image upload
function setup() {
  // Create the canvas
  const canvas = createCanvas(640, 520);
  canvas.parent('canvas-container'); // Attach to the correct container

  // Create the file input (upload button)
  input = createFileInput(handleFile);

  // Position the upload button just below the canvas
  const canvasX = canvas.position().x; // X-coordinate of the canvas
  const canvasY = canvas.position().y; // Y-coordinate of the canvas
  input.position(canvasX, canvasY + canvas.height + 10); // Below the canvas
  
  // Set the upload container style
  input.parent('upload-container'); // Apply styles to the container
}

function draw() {
  background(0);
  
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  
  // Display the label and confidence
  if (confidence > 0) {
    text(`${label}: ${(confidence * 100).toFixed(2)}%`, width / 2, height - 16);
  } else {
    text(label, width / 2, height - 16);
  }
  
  // Display the uploaded image
  if (img) {
    image(img, 0, 0, width, 480);
  }
}

// STEP 2: Handle the file upload and classify the image
function handleFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data, '', ''); // Create the image element with no alt text
    img.hide(); // Hide the uploaded image element
    img.parent('upload-container'); // Apply styles to the uploaded image
    label = "Classifying...";
    confidence = 0.0;
    classifier.classify(img, gotResults);
  } else {
    console.error("Unsupported file type. Please upload an image.");
    label = "Invalid file type. Please upload an image.";
    confidence = 0.0;
    img = null;
  }
}

// STEP 3: Get the classification!
function gotResults(error, results) {
  if (error) {
    console.error(error);
    label = "Error during classification";
    confidence = 0.0;
    return;
  }
  label = results[0].label;
  confidence = results[0].confidence;
}
