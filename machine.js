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
  }
}
