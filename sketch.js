let mobilenet;
let video;
let classifier;
let sampleButton;
let trainButton;
let saveButton;
let meButton;
let label = '';


function modelReady() {
  console.log('Model is ready!!!');  
}

function videoReady() {
  console.log('Video is ready!!!');  
}

function whileTraining(loss){
  console.log('Training...');
  label = 'Training...!';
  console.log(loss);
  label = loss;
  
  if(!loss){
    label = 'Training Complete!';
    console.log('Training Complete!');
    classifier.classify(gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    label = error;
    console.error(error);
  } else {
    label = results;
    classifier.classify(gotResults);
  }
}


function setup() {
  
  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }
  };
  
  video = createCapture(constraints);
  video.hide();
  
  createCanvas(640, 480);
  background(200);  
  
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, videoReady);   
  
  sampleButton = createButton('pen');
  sampleButton.mousePressed(function(args){
    let res = classifier.addImage('pen');
    
    console.log('PEN');
    console.log(res);           

    label = 'PEN';     
  });
  
  meButton = createButton('me');
  meButton.mousePressed(function(args){
    let res = classifier.addImage('me');
    console.log('Me!');
    console.log(res);                
    

    label = 'Me';     
  });
  
  trainButton = createButton('TRAIN');
  trainButton.mousePressed(function(){
    console.log('Training Begins');
    let res = classifier.train(whileTraining);
    
    console.log('TRAIN');
    console.log(res);   

    label = 'TRAIN';    
  });
  
  saveButton = createButton('Save');
  saveButton.mousePressed(function(){
    classifier.save();

    label = 'Save';    
  });
}

function draw() {
  image(video, 0, 0);
  fill(255);
  textSize(32);
  text(label, 10, height - 20);
}