
var turbineModel;

var mobilenet;
var video;
var classifier;


var ellipseWidth = 80;
var ellipseHeight = ellipseWidth;


var showModel = false;
var loaded = false;
var completionMsg = 'Set Up Complete.. ';

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

var canvaPositionX;
var canvaPositionY;
function addCanvas(){
  console.log('addCanvas...');
  var canvasRefrence =  createCanvas(windowWidth, windowHeight, WEBGL);
  canvaPositionX = (windowWidth - width) / 2;
  canvaPositionY = (windowHeight - height) / 2;
  canvasRefrence.position(canvaPositionX, canvaPositionY);
  canvasRefrence.parent('divContainer');   

  console.log(canvasRefrence);

  testModel();        
}

function addCloseButton(){
  console.log('addCloseButton...');
  closeButton = createButton('close');
  closeButton.position(10, 10);
  closeButton.mousePressed(function(){

    showModel = false;
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

    if(detectedObj && showModel){

      console.log('Drawing ' + detectedObj.label);
      
      if(detectedObj.label === 'Right-View'){
       
        image(rightViewImg, (0 - windowWidth/2), (0 - windowHeight/2), rightViewImg.width/3, rightViewImg.height/3);

      } else if(detectedObj.label === 'Left-View'){
        // rotateX(-300);
        image(leftViewImg, (0 - windowWidth/2), (0 - windowHeight/2), leftViewImg.width/3, leftViewImg.height/3);

      }  else if(detectedObj.label === 'Front-View'){

        image(frontViewImg, (0 - windowWidth/2), (0 - windowHeight/2), (windowWidth * (frontViewImg.height/frontViewImg.width)), (windowHeight * (frontViewImg.height/frontViewImg.width)));

      }
    }

  }

}

function testModel() {
  classifier.classify(video)
    .then(function (obj) {
      
      console.log('...');

      detectedObj = obj[0];
      modelResponse = [];

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
          showModel = true;
        })              
       } else {
        showModel = false;
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



var headerLabelDiv;
var instructionLabelDiv;
var lableArray = [];

function labels(){
  hideLables();


  var y= 65;
  var divHeight = 75;
  var divWidth = windowWidth/3;
  var col = color(0,0,0, 200);

   headerLabelDiv = createDiv('INSTRUCTIONS:');
   headerLabelDiv.style('background-color', col);
   headerLabelDiv.style('font-family', 'avenir');
   headerLabelDiv.style('color', 'white');
   headerLabelDiv.style('padding', '10px');
   headerLabelDiv.size(divWidth, 30);
   headerLabelDiv.position(windowWidth - (divWidth + 100), 10);

   lableArray.push(headerLabelDiv);

  for(var index =0;index < modelResponse.length;index ++){
    var str =  modelResponse[index].label + '. '+ modelResponse[index].info;

     instructionLabelDiv = createDiv(str);
     instructionLabelDiv.style('background-color', col);
     instructionLabelDiv.style('font-family', 'avenir');
     instructionLabelDiv.style('color', 'white');
     instructionLabelDiv.style('padding', '10px');
     instructionLabelDiv.size(divWidth, divHeight);
     instructionLabelDiv.position(windowWidth - (divWidth + 100), y);
     y += (divHeight + 30) ;
     str = '';

     lableArray.push(instructionLabelDiv);
   }

}

function hideLables(){
  if(lableArray && lableArray.length > 0){
    for(var i = 0; i < lableArray.length; i++){
      lableArray[i].remove();
    }
  }
}



