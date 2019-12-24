let mobilenet;
let video;
let classifier;
let sampleButton;
let trainButton;
let saveButton;
let meButton;
let label = '';
let infoDiv;
let isClicked = false;
let img;

var w = 640;
var h = 480;



function whileTraining(loss) {
  console.log('Training...');
  console.log(loss);
  label = 'Training Please wait...';
  if (!loss) {
    //label = 'Training Complete!';
    label = 'DONE!';
    console.log('Training Complete!');
    label = '';
  }
}

function gotResults(error, results) {
  console.log('gotResults..');
  if (error) {
    //label = error;
    console.error(error);
  } else {
    label = result;
    classifier.classify(gotResults);
  }
}

function addedImage(res, err) {
  console.log('addedImage');
  console.log(res);
  console.log(err);
}


let rectWidth;
let rectHeight;
let rectXLoc;
let rectYLoc;

let imgWidth;
let imgHeight;
let imgXLoc;
let imgYLoc;

let bannerColor = 'rgb(83,73,156)';
let buttonColor = 'rgb(255, 255, 255)';

let gap = 20;
let ellipseWidth = 50;
let ellipseHeight = 50;

let ellipse1XLoc;
let ellipse1YLoc;

let ellipse2XLoc;
let ellipse2YLoc;

let ellipse3XLoc;
let ellipse3YLoc;

let ellipse4XLoc;
let ellipse4YLoc;

function setup() {

  rectWidth = windowWidth;
  rectHeight = windowHeight * 0.15;
  rectXLoc = 0;
  rectYLoc = 0;

  imgWidth = windowWidth;
  imgHeight = windowHeight * 0.9;
  imgXLoc = 0;
  imgYLoc = rectHeight;

  ellipse1XLoc = (windowWidth - ((ellipseWidth * 4) + gap * 3))/2;
  ellipse1YLoc = windowHeight - ellipseHeight - 30;


  ellipse2XLoc = ellipse1XLoc + ellipseWidth + gap;
  ellipse2YLoc = ellipse1YLoc;

  ellipse3XLoc = ellipse2XLoc + ellipseWidth + gap;
  ellipse3YLoc = ellipse2YLoc;

  ellipse4XLoc = ellipse3XLoc + ellipseWidth + gap;
  ellipse4YLoc = ellipse3YLoc;



  //Making the canvas fill the window
  createCanvas(windowWidth, windowHeight);

  fill(bannerColor);
  rect(rectXLoc, rectYLoc, rectWidth, rectHeight);

  

  let constraints = {
    video: {
      mandatory: {
        minWidth: windowWidth,
        minHeight: windowHeight
      },
      // optional: [{ maxFrameRate: 10 }]
    },
    audio: false
  };
  
 
  video = createCapture(constraints, function (stream) {
    mobilenet = ml5.featureExtractor('MobileNet', function () {
      classifier = mobilenet.classification(video, function () {
        video.hide();
        console.log('all set!');
      });
    });
  });

  video.elt.setAttribute('playsinline', '');
  video.hide();



  sampleButton = createButton('Object A');
  let col = color(255, 255, 255, 255);
  sampleButton.style('background-color', col);
  sampleButton.position(10, 500);

  sampleButton.mousePressed(function (args) {
    label = 'Capturing Object A Please wait...';
    isClicked = true;
    setTimeout(() => {
      classifier.addImage(video, 'Object A', function () {
        console.log('Object A...');
        label = '';
      });
    }, 0);
  });

  meButton = createButton('Object B');
  meButton.style('background-color', col);
  meButton.position(100, 500);
  meButton.mousePressed(function (args) {
    label = 'Capturing Object B Please wait...';
    isClicked = true;
    setTimeout(() => {
      classifier.addImage(video, 'Object B', function () {
        console.log('Object B...');
        label = '';
      });
    }, 0);
  });

  trainButton = createButton('Train');
  trainButton.style('background-color', col);
  trainButton.position(200, 500);

  trainButton.mousePressed(function () {
    console.log('Training Begins Please wait...');

    if (isClicked) {
      try {
        label = 'Training Begins Please wait...';
        classifier.train(whileTraining);
      } catch (err) {
        console.log(err);
        label = 'generic error';
      }

    } else {
      label = 'Please capture the images for training.'
    }
  });

  saveButton = createButton('Test');
  saveButton.style('background-color', col);
  saveButton.position(280, 500);

  saveButton.mousePressed(function () {
    label = '';    // classifier.save( );
    classifier.classify(video)
      .then(function (obj) {
        console.log('Success, You are a GEEK');
        console.log(obj[0].label);
        label = obj[0].label;


        httpPost('https://reqres.in/api/users', 'json', { "name": "morpheus", "job": "leader" }, function (success) {
          console.log('success from http call :::::: ', success);
          img = loadImage('./images/pexels-photo.jpg');
          // background(0);
          //  image(img, 0, 0, 2048, 2048);
        }, function (error) {
          console.log('error from http call :::::: ', error);
        });




      })
      .catch(function (err) {
        console.log('Some error has occured');
        console.log(err);
        label = 'Some error has occured';
      });;
    //   label = 'Reset';    
  });

  resetButton = createButton('Reset');
  resetButton.style('background-color', col);
  resetButton.position(360, 500);
  resetButton.mousePressed(function () {
    console.log('reset button clicked');
    img = null;
  });

}



function draw() {

  image(video, imgXLoc, imgYLoc, imgWidth, imgHeight);

  fill(204, 101, 192, 127);
  ellipse(ellipse1XLoc, ellipse1YLoc, ellipseWidth, ellipseHeight);

  fill(204, 22, 12, 190);
  ellipse(ellipse2XLoc, ellipse2YLoc, ellipseWidth, ellipseHeight);

  fill(10, 255, 255, 77);
  ellipse(ellipse3XLoc, ellipse3YLoc, ellipseWidth, ellipseHeight);

  fill(83,73,156, 100);
  ellipse(ellipse4XLoc, ellipse4YLoc, ellipseWidth, ellipseHeight);

  textSize(22);
  fill(255, 255, 255);
  text(label, 30, 450);

  if (!window.navigator.onLine) {
    label = 'Please check internet connection.';
    isOnline = true;
  } else if (label === 'Please check internet connection.') {
    label = '';
  }
  if (img) {
    image(img, 0, 0, windowWidth, windowHeight);
  }  
}

function mousePressed() {

  
  // Check if mouse is inside the circle
  let d = dist(mouseX, mouseY, ellipse1XLoc, ellipse1YLoc);

  if (d < ellipseWidth) {
    console.log('Ellipse 1');
    return;
  }

  d = dist(mouseX, mouseY, ellipse2XLoc, ellipse2YLoc);

  if (d < ellipseWidth) {
    console.log('Ellipse 2');
    return;
  }

  d = dist(mouseX, mouseY, ellipse3XLoc, ellipse3YLoc);

  if (d < ellipseWidth) {
    console.log('Ellipse 3');
    return;
  }

  d = dist(mouseX, mouseY, ellipse4XLoc, ellipse4YLoc);

  if (d < ellipseWidth) {
    console.log('Ellipse 4');
    return;
  }
}

