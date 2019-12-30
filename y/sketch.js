// 

let turbineModel;
let heliModel;

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

let imgWidth = 500;
let imgHeight = 500;
let imgXLoc = 0;
let imgYLoc = 0;

var w = 640;
var h = 480;

let showModel = true;
let loaded = false;
let completionMsg = 'Set Up Complete.. added turbine draw';

let detectedObj;
let textureObj;

let modelURL = 'https://firebasestorage.googleapis.com/v0/b/gear-v1.appspot.com/o/model.json?alt=media&token=363e381f-afb9-40ca-a2e0-9f226004b4a2';

function preload() {
  console.log('preload ');
  turbineModel = loadModel('turbine.obj');
  textureObj = loadImage('tex.jpg');  
}

let cnv;
function setup() {
  console.log('setup');
  createCanvas(windowWidth, windowHeight, WEBGL);

  // createCanvas(windowWidth, windowHeight);

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
    mobilenet = ml5.featureExtractor('MobileNet',{numLabels:3}, function () {
      classifier = mobilenet.classification(video, function () {
        classifier.load(modelURL, function(){
          video.hide();
          console.log(completionMsg);
          loaded = true;
          setUpButtons();
          showButtons();

          // testModel();

        })        
      });
    });
  });

  video.elt.setAttribute('playsinline', '');
  video.hide();

  console.log('scale 3 images');
  
}


function draw() {
  
  if(loaded){

    background(200);
    image(video, (0 - windowWidth/2), (0 - windowHeight/2), windowWidth, windowHeight);  
    scale(150);

    if(!showModel){
      if(detectedObj){
        if(detectedObj.label === 'Right-View'){
          rotateX(300);
          rotateY(300);
        } else if(detectedObj.label === 'Left-View'){
          rotateX(-300);
          rotateY(-300);
        }  else if(detectedObj.label === 'Front-View'){
          rotateX(0);
          rotateY(0);
        }  
      } else {
        rotateX(frameCount * 0.01);
        rotateY(frameCount * 0.01);  
      }      
    } else {
      rotateX(frameCount * 0.01);
      rotateY(frameCount * 0.01);
    
    }
    fill(255);
    model(turbineModel);            
  }
  
}

let changeView = false;
function setUpButtons(){
  rectWidth = windowWidth;
  rectHeight = windowHeight * 0.15;
  rectXLoc = 0;
  rectYLoc = 0;

  imgWidth = windowWidth;
  imgHeight = windowHeight * 0.9;
  imgXLoc = 0;
  imgYLoc = rectHeight;

  ellipse1XLoc = (windowWidth - ((ellipseWidth * 2) + gap * 1))/2;
  ellipse1YLoc = (windowHeight - ellipseHeight) - ellipseHeight/2;


  ellipse2XLoc = ellipse1XLoc + ellipseWidth + gap;
  ellipse2YLoc = ellipse1YLoc;

  ellipse3XLoc = ellipse2XLoc + ellipseWidth + gap;
  ellipse3YLoc = ellipse2YLoc;

  ellipse4XLoc = ellipse3XLoc + ellipseWidth + gap;
  ellipse4YLoc = ellipse3YLoc;

  ellipse5XLoc = ellipse4XLoc + ellipseWidth + gap;
  ellipse5YLoc = ellipse4YLoc;

  ellipse6XLoc = ellipse5XLoc + ellipseWidth + gap;
  ellipse6YLoc = ellipse5YLoc;

  
  //Making the canvas fill the window
  createCanvas(windowWidth, windowHeight, WEBGL);

  fill(bannerColor);
  rect(rectXLoc, rectYLoc, rectWidth, rectHeight);

  tbnTurbine = createButton('Show 3D');
  tbnTurbine.position(ellipse1XLoc, ellipse1YLoc);
  tbnTurbine.mousePressed(function(){
    // classifier.addImage(video, 'Left-View', function () {
    //   changeView = !changeView;
    //   console.log('Left-View...');   
    //   label = 'Ready..';     
    // });

    showModel = true;
  });
  tbnTurbine.size(ellipseWidth, ellipseHeight);
  tbnTurbine.hide();


  btnHeli = createButton('TEST');
  btnHeli.position(ellipse2XLoc, ellipse1YLoc);
  btnHeli.mousePressed(function(){
    // classifier.addImage(video, 'Front-View', function () {
    //   console.log('Front-View...');   
    //   label = 'Ready..';     
    // });

    showModel = false;
    testModel();

  });
  btnHeli.size(ellipseWidth, ellipseHeight);
  btnHeli.hide();

  btn3 = createButton('Right-View');
  btn3.position(ellipse3XLoc, ellipse1YLoc);
  btn3.mousePressed(function(){
    classifier.addImage(video, 'Right-View', function () {
      console.log('Right-View...');   
      label = 'Ready..';     
    });
  });
  btn3.size(ellipseWidth, ellipseHeight);
  btn3.hide();

  btnTrain = createButton('TRAIN');
  btnTrain.position(ellipse4XLoc, ellipse1YLoc);
  btnTrain.mousePressed(function(){
      trainModel();
  });
  btnTrain.size(ellipseWidth, ellipseHeight);
  btnTrain.hide();

  btnTest = createButton('TEST');
  btnTest.position(ellipse5XLoc, ellipse1YLoc);
  btnTest.mousePressed(function(){
    testModel();
  });
  btnTest.size(ellipseWidth, ellipseHeight);
  btnTest.hide();

  btnSave = createButton('Save');
  btnSave.position(ellipse6XLoc, ellipse1YLoc);
  btnSave.mousePressed(function(){
    classifier.save();
  });
  btnSave.size(ellipseWidth, ellipseHeight);
  btnSave.hide();

  console.log('3 images...');
}

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

function trainModel(){
  console.log('Training Begins Please wait...');
    label = 'Training Begins Please wait...';
    classifier.train(whileTraining);  
}

function testModel() {
  // label = '';
      classifier.classify(video)
        .then(function (obj) {
          console.log('');
          console.log('');
          console.log('obj');
          console.log(obj[0].label);
          console.log(obj[0].confidence);
          // label = 'Object Identified: ' + obj[0].label;

          detectedObj = obj[0];

          // testModel();
          // httpPost('https://reqres.in/api/users', 'json', { "name": "morpheus", "job": "leader" }, function (success) {
          //   console.log('success from http call :::::: ', success);
          //   img = loadImage('./images/pexels-photo.jpg');
          //   // background(0);
          //   //  image(img, 0, 0, 2048, 2048);
          // }, function (error) {
          //   console.log('error from http call :::::: ', error);
          // });


        })
        .catch(function (err) {
          console.log('Some error has occured');
          console.log(err);
          // label = 'Some error has occured';
        });;
}

function showButtons(){
  tbnTurbine.show();
  btnHeli.show();
  // btnTrain.show();
  // btnTest.show();
  // btn3.show();
  // btnSave.show();
}



let rectWidth;
let rectHeight;
let rectXLoc;
let rectYLoc;



let bannerColor = 'rgb(83,73,156)';
let buttonColor = 'rgb(255, 255, 255)';

let gap = 20;
let ellipseWidth = 80;
let ellipseHeight = ellipseWidth;

let ellipse1XLoc;
let ellipse1YLoc;

let ellipse2XLoc;
let ellipse2YLoc;

let ellipse3XLoc;
let ellipse3YLoc;

let ellipse4XLoc;
let ellipse4YLoc;

let ellipse5XLoc;
let ellipse5YLoc;

let tbnTurbine, btnHeli, btn3, btnTrain, btnTest, btnSave;


// function setup() {
//   console.log('setting up the scene..');
//   rectWidth = windowWidth;
//   rectHeight = windowHeight * 0.15;
//   rectXLoc = 0;
//   rectYLoc = 0;

//   imgWidth = windowWidth;
//   imgHeight = windowHeight * 0.9;
//   imgXLoc = 0;
//   imgYLoc = rectHeight;

//   ellipse1XLoc = (windowWidth - ((ellipseWidth * 5) + gap * 4))/2;
//   ellipse1YLoc = windowWidth;


//   ellipse2XLoc = ellipse1XLoc + ellipseWidth + gap;
//   ellipse2YLoc = ellipse1YLoc;

//   ellipse3XLoc = ellipse2XLoc + ellipseWidth + gap;
//   ellipse3YLoc = ellipse2YLoc;

//   ellipse4XLoc = ellipse3XLoc + ellipseWidth + gap;
//   ellipse4YLoc = ellipse3YLoc;

//   ellipse5XLoc = ellipse4XLoc + ellipseWidth + gap;
//   ellipse5YLoc = ellipse4YLoc;

  
//   //Making the canvas fill the window
//   createCanvas(windowWidth, windowHeight, WEBGL);

//   fill(bannerColor);
//   rect(rectXLoc, rectYLoc, rectWidth, rectHeight);

//   tbnTurbine = createButton('Turbine');
//   tbnTurbine.position(ellipse1XLoc, ellipse1XLoc);
//   tbnTurbine.mousePressed(function(){
//     classifier.addImage(video, 'Turbine', function () {
//       console.log('Turbine...');   
//       label = 'Ready..';     
//     });
//   });
//   tbnTurbine.size(ellipseWidth, ellipseHeight);
//   tbnTurbine.hide();


//   btnHeli = createButton('Helicopter');
//   btnHeli.position(ellipse2XLoc, ellipse1XLoc);
//   btnHeli.mousePressed(function(){
//     classifier.addImage(video, 'Helicopter', function () {
//       console.log('Helicopter...');   
//       label = 'Ready..';     
//     });
//   });
//   btnHeli.size(ellipseWidth, ellipseHeight);
//   btnHeli.hide();

//   btnTrain = createButton('TRAIN');
//   btnTrain.position(ellipse3XLoc, ellipse1XLoc);
//   btnTrain.mousePressed(function(){
//       trainModel();
//   });
//   btnTrain.size(ellipseWidth, ellipseHeight);
//   btnTrain.hide();

//   btnTest = createButton('TEST');
//   btnTest.position(ellipse4XLoc, ellipse1XLoc);
//   btnTest.mousePressed(function(){
//     testModel();
//   });
//   btnTest.size(ellipseWidth, ellipseHeight);
//   btnTest.hide();
  

//   let constraints = {
//     video: {
//       mandatory: {
//         minWidth: windowWidth,
//         minHeight: windowHeight
//       },
//       // optional: [{ maxFrameRate: 10 }]
//     },
//     audio: false
//   };
  
 
//   video = createCapture(constraints, function (stream) {
//     mobilenet = ml5.featureExtractor('MobileNet', function () {
//       classifier = mobilenet.classification(video, function () {
//         // classifier.load('model.json', function(){
//           video.hide();
//           console.log(completionMsg);
//           loaded = true;

//           console.log(classifier);

//           // testModel();

//         // })        
//       });
//     });
//   });

//   video.elt.setAttribute('playsinline', '');
//   video.hide();

// }





// function draw() {

//   if(loaded){
//     // showButtons();
    
//     image(video, imgXLoc, imgYLoc, imgWidth, imgHeight);
//     rotateX(frameCount * 0.01);
//   rotateY(frameCount * 0.01);
//   model(turbineModel);
//   model(theliodel);

//     // fill(204, 101, 192, 127);
//     // ellipse(ellipse1XLoc, ellipse1YLoc, ellipseWidth, ellipseHeight);
//     // textSize(10);
//     // textAlign(CENTER, CENTER);
//     // fill(255, 255, 255);
//     // text("Turbine", ellipse1XLoc, ellipse1YLoc);




//     // fill(204, 22, 12, 190);
//     // ellipse(ellipse2XLoc, ellipse2YLoc, ellipseWidth, ellipseHeight);
//     // textSize(10);
//     // textAlign(CENTER, CENTER);
//     // fill(255, 255, 255);
//     // text("Helicopter", ellipse2XLoc, ellipse2YLoc);

//     // fill(10, 255, 255, 77);
//     // ellipse(ellipse3XLoc, ellipse3YLoc, ellipseWidth, ellipseHeight);
//     // textSize(10);
//     // textAlign(CENTER, CENTER);
//     // fill(255, 255, 255);
//     // text("TRAIN", ellipse3XLoc, ellipse3YLoc);

//     // fill(83,73,156, 100);
//     // ellipse(ellipse4XLoc, ellipse4YLoc, ellipseWidth, ellipseHeight);
//     // textSize(10);
//     // textAlign(CENTER, CENTER);
//     // fill(255, 255, 255);
//     // text("TEST", ellipse4XLoc, ellipse4YLoc);

//     // fill(3,3,6, 100);
//     // ellipse(ellipse5XLoc, ellipse5YLoc, ellipseWidth, ellipseHeight);
//     // textSize(10);
//     // textAlign(CENTER, CENTER);
//     // fill(255, 255, 255);
//     // text("SAVE", ellipse5XLoc, ellipse5YLoc);

//     textSize(22);
//     fill(255, 255, 255);
//     textAlign(LEFT, LEFT);
//     text(label, rectXLoc, rectYLoc);

//     // if (!window.navigator.onLine) {
//     //   label = 'Please check internet connection.';
//     //   isOnline = true;
//     // } else if (label === 'Please check internet connection.') {
//     //   label = '';
//     // }
//     // if (img) {
//     //   image(img, 0, 0, windowWidth, windowHeight);
//     // }  

//   }  
// }

// function mousePressed() {

  
//   // Check if mouse is inside the circle
//   let d = dist(mouseX, mouseY, ellipse1XLoc, ellipse1YLoc);

//   if (d < ellipseWidth) {
//     console.log('Ellipse 1');
//     scanObject('Turbine');
//     return;
//   }

//   d = dist(mouseX, mouseY, ellipse2XLoc, ellipse2YLoc);

//   if (d < ellipseWidth) {
//     console.log('Ellipse 2');
//     scanObject('Helicopter');
//     return;
//   }

//   d = dist(mouseX, mouseY, ellipse3XLoc, ellipse3YLoc);

//   if (d < ellipseWidth) {
//     console.log('Ellipse 3');
//     scanObject('Train');
//     return;
//   }

//   d = dist(mouseX, mouseY, ellipse4XLoc, ellipse4YLoc);

//   if (d < ellipseWidth) {
//     console.log('Ellipse 4');
//     scanObject('TEST');
//     return;
//   }

//   d = dist(mouseX, mouseY, ellipse5XLoc, ellipse5YLoc);

//   if (d < ellipseWidth) {
//     console.log('Ellipse 5');
//     scanObject('SAVE');
//     return;
//   }
// }

// function scanObject(objectType){
//   if(loaded){
//       label = 'Capturing Please wait...';

//     if(objectType == 'Turbine'){

      
//       isClicked = true;
//       setTimeout(() => {
//         classifier.addImage(video, 'Turbine', function () {
//           console.log('Turbine...');   
//           label = 'Ready..';     
//         });
//       }, 0);

//     } else if(objectType == 'Helicopter'){

//       isClicked = true;
//       setTimeout(() => {
//         classifier.addImage(video, 'Helicopter', function () {
//           console.log('Helicopter...');   
//           label = 'Ready..';           
//         });
//       }, 0);

//     } else if(objectType == 'Train'){
//       console.log('Training Begins Please wait...');
//       label = 'Training Begins Please wait...';
//       classifier.train(whileTraining);    
//     } else if(objectType == 'TEST'){
//       label = '';
//       classifier.classify(video)
//         .then(function (obj) {

//           console.log(obj[0].label);
//           label = 'Object Identified: ' + obj[0].label;


//           // httpPost('https://reqres.in/api/users', 'json', { "name": "morpheus", "job": "leader" }, function (success) {
//           //   console.log('success from http call :::::: ', success);
//           //   img = loadImage('./images/pexels-photo.jpg');
//           //   // background(0);
//           //   //  image(img, 0, 0, 2048, 2048);
//           // }, function (error) {
//           //   console.log('error from http call :::::: ', error);
//           // });


//         })
//         .catch(function (err) {
//           console.log('Some error has occured');
//           console.log(err);
//           label = 'Some error has occured';
//         });;
//       //   label = 'Reset';   
//     } else if(objectType == 'SAVE'){ 
//       classifier.save();
//     }
//   } else {

//   }

// }