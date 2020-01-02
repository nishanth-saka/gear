
var turbineModel;
var heliModel;

var mobilenet;
var video;
var classifier;
var sampleButton;
var trainButton;
var saveButton;
var meButton;
var label = '';
var infoDiv;
var isClicked = false;
var img;

var imgWidth = 500;
var imgHeight = 500;
var imgXLoc = 0;
var imgYLoc = 0;

var w = 640;
var h = 480;

var showModel = true;
var loaded = false;
var completionMsg = 'Set Up Complete.. added turbine draw';

var detectedObj;

var modelURL = 'model.json';
var modelResponse =  [];

var leftViewImg, rightViewImg, frontViewImg;
var img_;

var closeButton;
//'http://10.0.75.1:8080/';

function preload() {
  console.log('preload.. environment');
  turbineModel = loadModel('turbine.obj');
  rightViewImg = loadImage('right-view.png');
  leftViewImg = loadImage('left-view.png');
  frontViewImg = loadImage('front-view.png');

  loadFont('avenir.otf');
}

var cnv;
function setup() {
  console.log('setup');

  // createCanvas(windowWidth, windowHeight);

    var constraints = {
    video: {
      mandatory: {
        minWidth: windowWidth,
        minHeight: windowHeight
      }//,
      // facingMode: {
      //   exact: "environment"
      // }
    },
    audio: false,
    aspectRatio: 4/3
  };

  
  video = createCapture(constraints, function (stream) {
    mobilenet = ml5.featureExtractor('MobileNet',{numLabels:3}, function () {
      classifier = mobilenet.classification(video, function () {
        classifier.load(modelURL, function(){
          video.hide();
          console.log(completionMsg);

          loaded = true;
          addCanvas();
        })
      });
    });
  });

  video.hide();  
}

function addCanvas(){
  console.log('addCanvas...');
  var canvasRefrence =  createCanvas(windowWidth, windowHeight, WEBGL);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvasRefrence.position(x, y);
  //canvasRefrence.parent('container');        
  testModel();        
}

function addCloseButton(){
  console.log('addCloseButton...');
  closeButton = createButton('close');
  closeButton.position(10, 10);
  closeButton.mousePressed(function(){
    // classifier.addImage(video, 'Left-View', function () {
    //   changeView = !changeView;
    //   console.log('Left-View...');
    //   label = 'Ready..';
    // });

    removeCloseButton(closeButton);
    hideLables();
  });

  closeButton.size(ellipseWidth, ellipseHeight);    
}

function removeCloseButton(btn){
  btn.remove();
  testModel();
}


function draw() {

  if(loaded){

    background(200);
    image(video, (0 - windowWidth/2), (0 - windowHeight/2), windowWidth, windowHeight);



    if(!showModel){

      if(detectedObj){


        if(detectedObj.label === 'Right-View'){
          // rotateX(300);
          // rotateY(300);

          image(rightViewImg, (0 - windowWidth/2), (0 - windowHeight/2), windowWidth/2, windowHeight/2);

        } else if(detectedObj.label === 'Left-View'){
          // rotateX(-300);
          // rotateY(-300);

          image(leftViewImg, (0 - windowWidth/2), (0 - windowHeight/2), windowWidth/2, windowHeight/2);

        }  else if(detectedObj.label === 'Front-View'){
          // rotateX(0);
          // rotateY(0);

          image(frontViewImg, (0 - windowWidth/2), (0 - windowHeight/2), windowWidth/2, windowHeight/2);
        }
      } else {

        // scale(100);
        // rotateX(frameCount * 0.01);
        // rotateY(frameCount * 0.01);
        // hideLables();
        // fill(255);
        // translate(0, 0, 1);
        // model(turbineModel);
      }
    } else {
      // image(video, (0 - windowWidth/2), (0 - windowHeight/2), windowWidth, windowHeight);
      // scale(100);
      // hideLables();
      // rotateX(frameCount * 0.01);
      // rotateY(frameCount * 0.01);
      // fill(255);
      // translate(0, 0, 1);
      // model(turbineModel);

    }

  }

}

function hideLables(){
  if(lableArray && lableArray.length > 0){
    for(var i = 0; i < lableArray.length; i++){
      lableArray[i].remove();
    }
  }
}

var headerLabelDiv;
var instructionLabelDiv;
var lableArray = [];

function labels(){
  hideLables();


  var y= 65;
  var divHeight = 75;
  var divWidth = 400;
  var col = color(0,0,0, 200);

   headerLabelDiv = createDiv('INSTRUCTIONS:');
   headerLabelDiv.style('background-color', col);
   headerLabelDiv.style('font-family', 'avenir');
   headerLabelDiv.style('color', 'white');
   headerLabelDiv.style('padding', '10px');
   headerLabelDiv.size(400, 30);
   headerLabelDiv.position(windowWidth - (divWidth + 100), 10);

   lableArray.push(headerLabelDiv);

  for(var index =0;index < modelResponse.length;index ++){
    var str =  modelResponse[index].label + '. '+ modelResponse[index].info;

     instructionLabelDiv = createDiv(str);
     instructionLabelDiv.style('background-color', col);
     instructionLabelDiv.style('font-family', 'avenir');
     instructionLabelDiv.style('color', 'white');
     instructionLabelDiv.style('padding', '10px');
     instructionLabelDiv.size(400, divHeight);
     instructionLabelDiv.position(windowWidth - (divWidth + 100), y);
     y += (divHeight + 30) ;
     str = '';

     lableArray.push(instructionLabelDiv);
   }

}

var changeView = false;
// function setUpButtons(){
//   rectWidth = windowWidth;
//   rectHeight = windowHeight * 0.15;
//   rectXLoc = 0;
//   rectYLoc = 0;

//   imgWidth = windowWidth;
//   imgHeight = windowHeight * 0.9;
//   imgXLoc = 0;
//   imgYLoc = rectHeight;

//   ellipse1XLoc = (windowWidth - ((ellipseWidth * 2) + gap * 1))/2;
//   ellipse1YLoc = (windowHeight - ellipseHeight) - ellipseHeight/2;


//   ellipse2XLoc = ellipse1XLoc + ellipseWidth + gap;
//   ellipse2YLoc = ellipse1YLoc;

//   ellipse3XLoc = ellipse2XLoc + ellipseWidth + gap;
//   ellipse3YLoc = ellipse2YLoc;

//   ellipse4XLoc = ellipse3XLoc + ellipseWidth + gap;
//   ellipse4YLoc = ellipse3YLoc;

//   ellipse5XLoc = ellipse4XLoc + ellipseWidth + gap;
//   ellipse5YLoc = ellipse4YLoc;

//   ellipse6XLoc = ellipse5XLoc + ellipseWidth + gap;
//   ellipse6YLoc = ellipse5YLoc;


//   //Making the canvas fill the window
//   createCanvas(windowWidth, windowHeight, WEBGL);

//   fill(bannerColor);
//   rect(rectXLoc, rectYLoc, rectWidth, rectHeight);

//   tbnTurbine = createButton('Show 3D');
//   tbnTurbine.position(ellipse1XLoc, ellipse1YLoc);
//   tbnTurbine.mousePressed(function(){
//     // classifier.addImage(video, 'Left-View', function () {
//     //   changeView = !changeView;
//     //   console.log('Left-View...');
//     //   label = 'Ready..';
//     // });
//     showModel = true;
//   });

//   tbnTurbine.size(ellipseWidth, ellipseHeight);
//   tbnTurbine.hide();


//   btnHeli = createButton('TEST');
//   btnHeli.position(ellipse2XLoc, ellipse1YLoc);
//   btnHeli.mousePressed(function(){
//     // classifier.addImage(video, 'Front-View', function () {
//     //   console.log('Front-View...');
//     //   label = 'Ready..';
//     // });

//     showModel = false;
//     testModel();

//   });

//   btnHeli.size(ellipseWidth, ellipseHeight);
//   btnHeli.hide();

//   // tbnTurbine = createButton('Left-View');
//   // tbnTurbine.position(ellipse1XLoc, ellipse1YLoc);
//   // tbnTurbine.mousePressed(function(){
//   //   classifier.addImage(video, 'Left-View', function () {
//   //     changeView = !changeView;
//   //     console.log('Left-View...');
//   //     label = 'Ready..';
//   //   });
//   // });
//   // tbnTurbine.size(ellipseWidth, ellipseHeight);
//   // tbnTurbine.hide();


//   // btnHeli = createButton('Front-View');
//   // btnHeli.position(ellipse2XLoc, ellipse1YLoc);
//   // btnHeli.mousePressed(function(){
//   //   classifier.addImage(video, 'Front-View', function () {
//   //     console.log('Front-View...');
//   //     label = 'Ready..';
//   //   });
//   // });

//   // btnHeli.size(ellipseWidth, ellipseHeight);
//   // btnHeli.hide();

//   // btn3 = createButton('Right-View');
//   // btn3.position(ellipse3XLoc, ellipse1YLoc);
//   // btn3.mousePressed(function(){
//   //   classifier.addImage(video, 'Right-View', function () {
//   //     console.log('Right-View...');
//   //     label = 'Ready..';
//   //   });
//   // });
//   // btn3.size(ellipseWidth, ellipseHeight);
//   // btn3.hide();

//   // btnTrain = createButton('TRAIN');
//   // btnTrain.position(ellipse4XLoc, ellipse1YLoc);
//   // btnTrain.mousePressed(function(){
//   //     trainModel();
//   // });
//   // btnTrain.size(ellipseWidth, ellipseHeight);
//   // btnTrain.hide();

//   // btnTest = createButton('TEST');
//   // btnTest.position(ellipse5XLoc, ellipse1YLoc);
//   // btnTest.mousePressed(function(){
//   //   testModel();
//   // });
//   // btnTest.size(ellipseWidth, ellipseHeight);
//   // btnTest.hide();

//   // btnSave = createButton('Save');
//   // btnSave.position(ellipse6XLoc, ellipse1YLoc);
//   // btnSave.mousePressed(function(){
//   //   classifier.save();
//   // });
//   // btnSave.size(ellipseWidth, ellipseHeight);
//   // btnSave.hide();

//   console.log('3 images...');
// }

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
      
      console.log('...');

      detectedObj = obj[0];
      modelResponse = [];

      if(detectedObj.confidence > 0.999){
        console.log('');
        console.log((detectedObj.confidence * 100));   
      }
      

      // label = 'Object Identified: ' + obj[0].label;
      

      if(detectedObj.confidence > 0.9991){
        
        console.log('');
        console.log((detectedObj.confidence * 100));
        console.log(detectedObj.label);
        console.log('Detected Images with Confidence > 99.99% - stop detecting..');

        var url = 'response.json';
        httpGet(url, 'json', false, function(response) {
        //console.log('success response for get call   ::::  ' ,response[obj[0].label].data);
          modelResponse =  response[detectedObj.label].data;
          labels();
          addCloseButton();
        })              
       } else {
        testModel();
       }      

      

      
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
    })
}



function showButtons(){
  closeButton.show();
  // btnHeli.show();
  // btnTrain.show();
  // btnTest.show();
  // btn3.show();
  // btnSave.show();
}



var rectWidth;
var rectHeight;
var rectXLoc;
var rectYLoc;



var bannerColor = 'rgb(83,73,156)';
var buttonColor = 'rgb(255, 255, 255)';

var gap = 20;
var ellipseWidth = 80;
var ellipseHeight = ellipseWidth;

var ellipse1XLoc;
var ellipse1YLoc;

var ellipse2XLoc;
var ellipse2YLoc;

var ellipse3XLoc;
var ellipse3YLoc;

var ellipse4XLoc;
var ellipse4YLoc;

var ellipse5XLoc;
var ellipse5YLoc;

var tbnTurbine, btnHeli, btn3, btnTrain, btnTest, btnSave;
// var containerId;
// function demo(){
//   containerId = str;
// }
