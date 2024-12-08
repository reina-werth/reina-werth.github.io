// Constants for spacing and positions
const UPLOAD_BUTTON_SPACING = 10;
const LABEL_SIZE = 32;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 520;
const TOP_PADDING = 20;  // Padding at the top
const BOTTOM_PADDING = 20;  // Padding at the bottom

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
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('canvas-container');

  input = createFileInput(handleFile);
  input.position(canvas.position().x, canvas.position().y + canvas.height + UPLOAD_BUTTON_SPACING);
}

function draw() {
  background(0);
  
  textSize(LABEL_SIZE);
  textAlign(CENTER, CENTER);
  fill('#7868B2'); // Set fill color to match the CSS style

  let rectHeight = 40;
  let rectY = height - rectHeight - 10;
  fill(0, 150);
  rect(0, rectY, width, rectHeight);

  if (confidence > 0) {
    fill('#7868B2'); // Match CSS text color
    text(`${label}: ${(confidence * 100).toFixed(2)}%`, width / 2, height - 16);
  } else {
    fill('#7868B2'); // Match CSS text color
    text(label, width / 2, height - 16);
  }

  if (img) {
    let imgWidth = img.width;
    let imgHeight = img.height;
    let scale = min(width / imgWidth, height / imgHeight);
    let newWidth = imgWidth * scale;
    let newHeight = imgHeight * scale;
    let x = (width - newWidth) / 2;
    let y = (height - newHeight) / 2;
    
    image(img, x, y, newWidth, newHeight);
    
    // Add a black bar behind the text with padding
    fill(0);
    noStroke();
    rect(0, y - TOP_PADDING, width, BOTTOM_PADDING + 40); // Adjust the position as needed
    
    // Draw the result text on top of the image
    fill('#7868B2'); // Match CSS text color
    textAlign(CENTER, CENTER);
    if (confidence > 0) {
      text(`${label}: ${(confidence * 100).toFixed(2)}%`, width / 2, height - 16);
    } else {
      text(label, width / 2, height - 16);
    }
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
  
  draw();
}

function handleFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data, null);
    img.hide();
    label = "Classifying...";
    confidence = 0.0;
    draw();
    classifier.classify(img, gotResults);
  } else {
    console.error("Unsupported file type. Please upload an image.");
    label = "Invalid file type. Please upload an image.";
    confidence = 0.0;
    img = null;
  }
}
