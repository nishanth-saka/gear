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
  label = 'Model Ready!';
}

// function customModelReady(){
//   console.log('Custom Model Set..');  
//   label = 'Model ready!';  
//   classifier.classify(gotResults);
// }

// function videoReady() {
//   console.log('Video is ready!!!');  
// }

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

// function gotResults(error, results) {
//   if (error) {
//     label = error;
//     console.error(error);
//   } else {
//     console.log(results);
//     label = results[0].label;
//     classifier.classify(gotResults);
//   }
// }


function setup() {
  
  var constraints = {
    audio: false,
    video: {
      facingMode: "user"
    }
  };


  label = 'Initializing video..';
  video = createCapture(constraints);
  label = 'VIDEO READY..';
  video.hide();
  
  createCanvas(640, 480);
  background(200);  
  
  label = 'Initializing video..';
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  label = 'mobilenet READY..';

  // classifier = mobilenet.classification(video, videoReady);   
  
  // sampleButton = createButton('Turbine');
  // sampleButton.mousePressed(function(args){
  //   let res = classifier.addImage('Turbine');
    
  //   console.log('Turbine');
  //   console.log(res);           

  //   label = 'Turbine';     
  // });
  
  // meButton = createButton('Helicopter');
  // meButton.mousePressed(function(args){
  //   let res = classifier.addImage('Helicopter');
  //   console.log('Helicopter!');
  //   console.log(res);                
    

  //   label = 'Helicopter';     
  // });
  
  // trainButton = createButton('TRAIN');
  // trainButton.mousePressed(function(){
  //   console.log('Training Begins');
  //   classifier.train(whileTraining).then(function(res){
  //     console.log('TRAIN');
  //     console.log(res);   

  //     label = 'TRAIN';
  //   });
    
        
  // });
  
  // saveButton = createButton('Reset');
  // saveButton.mousePressed(function(){
  //   // classifier.save();
  //   classifier = mobilenet.classification(video, videoReady);   
  //   label = 'Reset';    
  // });
}

function draw() {
  background(0);
  image(video, 0, 0);
  fill(255);
  textSize(32);
  text(label, 10, height - 20);
}