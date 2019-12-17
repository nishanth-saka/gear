let mobilenet;
let video;
let classifier;
let sampleButton;
let trainButton;
let saveButton;
let meButton;
let label = 'loading model...';


function modelReady() {
  label = 'modelReady..';
  console.log('Model is ready!!!');  

  label = 'loading classifier..';
  classifier.load('model.json', customModelReady).then((res) => {
    label = res;
  });
}

function customModelReady(){
  console.log('Custom Model Set..');  
  label = 'Model ready!';  
  classifier.classify(gotResults); 
}

function videoReady() {
  label = 'videoReady..';  
  console.log('Video is ready!!!');  
}

// function whileTraining(loss){
//   console.log('Training...');
//   label = 'Training...!';
//   console.log(loss);
//   label = loss;
  
//   if(!loss){
//     label = 'Training Complete!';
//     console.log('Training Complete!');
//     classifier.classify(gotResults);
//   }
// }

function gotResults(error, results) {
  if (error) {
    label = error;
    console.error(error);
  } else {
    console.log(results);
    label = results[0].label;
    classifier.classify(gotResults);
  }
}


function setup() {
  
  var constraints = {
    audio: false,
    video: {
      facingMode: "user"
      // facingMode: {
      //   exact: "environment"
      // }
    }
  };
  
  video = createCapture(constraints);
  video.hide();
  
  createCanvas(640, 480);
  background(200);  
  
  label = 'initializing mobilenet...';
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);

  label = 'initializing classifier...';
  classifier = mobilenet.classification(video, videoReady);   
  
  sampleButton = createButton('Turbine');
  sampleButton.mousePressed(function(args){
    let res = classifier.addImage('Turbine');
    
    console.log('Turbine');
    console.log(res);           

    label = 'Turbine';     
  });
  
  meButton = createButton('Helicopter');
  meButton.mousePressed(function(args){
    let res = classifier.addImage('Helicopter');
    console.log('Helicopter!');
    console.log(res);                
    

    label = 'Helicopter';     
  });
  
  trainButton = createButton('TRAIN');
  trainButton.mousePressed(function(){
    console.log('Training Begins');
    classifier.train(whileTraining).then(function(res){
      console.log('TRAIN');
      console.log(res);   

      label = 'TRAIN';
    });
    
        
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