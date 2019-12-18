let mobilenet;
let video;
let classifier;
let sampleButton;
let trainButton;
let saveButton;
let meButton;
let label = '';

var w = 640;
var h = 480;


// function modelReady() {
//   console.log('Model is ready!!!');  
//   // classifier.load('model.json', customModelReady);  
// }

// function customModelReady(){
//   console.log('Custom Model Set..');  
////   label = 'Model ready!';  
//   classifier.classify(gotResults);
// }

// function videoReady() {
//   console.log('Video is ready!!!');  
//   console.log('Adding Image...');  
  
//   // classifier.addImage(video,'Turbine')
//   //   .then(function (obj) { 
//   //       console.log('Image ready...');               
//   //   })
//   //   .catch(function (err) { 
//   //       console.log('Some error has occured'); 
//   //       console.log(err);
//   //   });  
// }

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

  createCanvas(480, 480);
  
  let constraints = {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      },
      optional: [{ maxFrameRate: 10 }]
    },
    audio: false
  };

  mobilenet = ml5.featureExtractor('MobileNet', function(){

  });


  console.log('capturing video..');

  video = createCapture(constraints, function(stream) {
  
    console.log('creating classifier..');

    classifier = mobilenet.classification(video, function(){
        video.hide();
        console.log('all set!');          
    });       
  });

  video.elt.setAttribute('playsinline', '');
  video.hide();
  


  
  
  


  // //label = 'VIDEO READY..';
  // video.hide();
  
  // background(200);  
  
  //label = 'Initializing ml5..';
  // 
  // // //label = 'ml5 READY..';

  // // //label = 'Initializing mobilenet..';
  // classifier = mobilenet.classification(video, videoReady);   
  // // //label = 'mobilenet READY..';
  
  sampleButton = createButton('Turbine');
  sampleButton.mousePressed(function(args){
     classifier.addImage('Turbine');   
     console.log('Turbine...');
    //label = 'Turbine';     
  });
  
  meButton = createButton('Helicopter');
  meButton.mousePressed(function(args){
    classifier.addImage('Helicopter');        
    console.log('Helicopter...');  
  });
  
  trainButton = createButton('TRAIN');
  trainButton.mousePressed(function(){
    console.log('Training Begins...');
    classifier.train(whileTraining);
  });
  
  // saveButton = createButton('Check');
  // saveButton.mousePressed(function(){
  //   // classifier.save();
  //   classifier.classify(video)
  //   .then(function (obj) { 
  //       console.log('Success, You are a GEEK'); 
  //       console.log(obj[0].label);
  //   })
  //   .catch(function (err) { 
  //       console.log('Some error has occured'); 
  //       console.log(err);
  //   }); ;
  // //   label = 'Reset';    
  // });
}

function draw() {
  image(video, 0, 0, 320, 240);

  // background(0);
  // image(video, 0, 0, 320, 240);
  // fill(255);
  // textSize(16);
  // text(label, 10, height - 10);

  // image(video, 0, 0, width, width * video.height / video.width)
  // .then(function (obj) { 
  //     console.log('Success, You are a GEEK');       
  // })
  // .catch(function (err) { 
  //     console.log('Some error has occured'); 
  //     console.log(err);
  // }); 
}