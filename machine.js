// Constants for spacing and positions
const UPLOAD_BUTTON_SPACING = 10;
const LABEL_SIZE = 32;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 520;

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
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('canvas-container'); // Attach to the correct container

  // Create the file input (upload button)
  input = createFileInput(handleFile);
  
  // Position the upload button just below the canvas
  input.position(canvas.position().x, canvas.position().y + canvas.height + UPLOAD_BUTTON_SPACING);
}

function draw() {
  background(0);
  
  textSize(LABEL_SIZE);
  textAlign(CENTER, CENTER);
  fill(255); // White text color
  
  // Add a semi-transparent background rectangle
  let rectHeight = 40; // Adjust height as needed
  let rectY = height - rectHeight - 10; // Adjust vertical position as needed
  fill(0, 150); // Semi-transparent black
  rect(0, rectY, width, rectHeight);
  
  // Display the label and confidence
  if (confidence > 0) {
    fill(255); // White text color
    text(`${label}: ${(confidence * 100).toFixed(2)}%`, width / 2, height - 16);
  } else {
    fill(255); // White text color
    text(label, width / 2, height - 16);
  }
  
  // Display the uploaded image without stretching
  if (img) {
    let imgWidth = img.width;
    let imgHeight = img.height;
    
    // Calculate the scale to maintain the aspect ratio
    let scale = min(width / imgWidth, height / imgHeight);
    
    // Calculate the new dimensions based on the scale
    let newWidth = imgWidth * scale;
    let newHeight = imgHeight * scale;
    
    // Center the image
    let x = (width - newWidth) / 2;
    let y = (height - newHeight) / 2;
    
    image(img, x, y, newWidth, newHeight);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    label = "Error during classification";
    confidence = 0.0;
  } else {
    label = results[0].label;
    confidence = results[0].confidence;
  }
  
  // Redraw the canvas with the new results
  draw();
}

function handleFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data, null); // Explicitly set the second parameter to null
    img.hide(); // Hide the uploaded image element
    label = "Classifying...";
    confidence = 0.0;
    
    // Update the display to show the uploaded image
    draw(); // Ensure the uploaded image is displayed on the canvas
    
    // Classify the image
    classifier.classify(img, gotResults);
  } else {
    console.error("Unsupported file type. Please upload an image.");
    label = "Invalid file type. Please upload an image.";
    confidence = 0.0;
    img = null;
  }
}
