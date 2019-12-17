let mobilenet;
let video;
let classifier;
let sampleButton;
let trainButton;
let saveButton;
let meButton;

function modelReady() {
  console.log('Model is ready!!!');  
}

function videoReady() {
  console.log('Video is ready!!!');  
}

function whileTraining(loss){
  if(!loss){
    console.log('Training Complete!');
    classifier.classify(gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);

    let label = results;
    textSize(32);
    text('word', 10, 30);
    fill(0, 102, 153);
    
    classifier.classify(gotResults);
  }
}


function setup() {
  
  video = createCapture({
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }
  });

  video.hide();
  
  createCanvas(640, 480);
  background(200);  
  
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, videoReady);   
  
  
  sampleButton = createButton('pen');
  sampleButton.mousePressed(function(args){
    classifier.addImage('pen');
  });
  
  meButton = createButton('me');
  meButton.mousePressed(function(args){
    classifier.addImage('me');
  });
  
  trainButton = createButton('TRAIN');
  trainButton.mousePressed(function(){
    classifier.train(whileTraining);
  });
  
  saveButton = createButton('Save');
  saveButton.mousePressed(function(){
    classifier.save();
  });
}

function draw() {
  image(video, 0, 0);
}
