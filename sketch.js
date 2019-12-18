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
  // classifier.load('model.json', customModelReady);  
}

// function customModelReady(){
//   console.log('Custom Model Set..');  
////   label = 'Model ready!';  
//   classifier.classify(gotResults);
// }

function videoReady() {
  console.log('Video is ready!!!');  
}

function whileTraining(loss){
  console.log('Training...');
  console.log(loss);
  
  if(!loss){
    //label = 'Training Complete!';
    console.log('Training Complete!');
    
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

function setup() {
  
  var constraints = {
    audio: false,
    video: {
      facingMode: "user"
    }
  };


//  label = 'Initializing video..';
  video = createCapture(constraints);
  //label = 'VIDEO READY..';
  // video.hide();
  
  createCanvas(640, 480);
  background(200);  
  
  //label = 'Initializing ml5..';
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  //label = 'ml5 READY..';

  //label = 'Initializing mobilenet..';
  classifier = mobilenet.classification(video, videoReady);   
  //label = 'mobilenet READY..';
  
  sampleButton = createButton('Turbine');
  sampleButton.mousePressed(function(args){
    classifier.addImage('Turbine');    

    //label = 'Turbine';     
  });
  
  meButton = createButton('Helicopter');
  meButton.mousePressed(function(args){
    let res = classifier.addImage(video, 'Turbine', addedImage);        
    //label = 'Helicopter';     
  });
  
  trainButton = createButton('TRAIN');
  trainButton.mousePressed(function(){
    console.log('Training Begins...');
    classifier.train(whileTraining)
    .then(function () { 
        console.log('Success, You are a GEEK'); 
    })
    .catch(function (err) { 
        console.log('Some error has occured'); 
        console.log(err);
    }); 
    
        
  });
  
  saveButton = createButton('Check');
  saveButton.mousePressed(function(){
    // classifier.save();
    classifier.classify(video)
    .then(function (obj) { 
        console.log('Success, You are a GEEK'); 
        console.log(obj);
    })
    .catch(function (err) { 
        console.log('Some error has occured'); 
        console.log(err);
    }); ;
  //   label = 'Reset';    
  });
}

function draw() {
  textSize(32);
  text(label, 10, height - 20);
}