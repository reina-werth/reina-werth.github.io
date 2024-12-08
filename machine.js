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
  createCanvas(640, 520);
  input = createFileInput(handleFile);
  input.position(10, height + 10); // Position the file input below the canvas
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

// STEP 2: Handle the file upload and classify the image
function handleFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide(); // Hide the uploaded image element
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
