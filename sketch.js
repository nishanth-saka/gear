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
let dummyResponse = [
  {
    image: './images/pexels-photo.jpg'
  },
  {
    image: './images/download.jpg'
  },
  {
    image: './images/panda.jpg'
  }
];
let index =0;
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

function setup() {

  createCanvas(windowWidth, windowHeight);

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
  // infoDiv = createDiv(label);
  // infoDiv.position(30,450);
  // img = loadImage('http://172.18.3.219:8081/pexels-photo.jpg');

  mobilenet = ml5.featureExtractor('MobileNet', function () {

  });


  console.log('capturing video..');

  video = createCapture(constraints, function (stream) {

    console.log('creating classifier..');

    classifier = mobilenet.classification(video, function () {
      video.hide();
      console.log('all set!');
    });
  });

  video.elt.setAttribute('playsinline', '');
  video.hide();



  sampleButton = createButton('Object A');
  let col = color(25, 23, 200, 50);
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
          img = loadImage(dummyResponse[index].image);
          // background(0);
          //  image(img, 0, 0, 2048, 2048);
        }, function (error) {
          console.log('error from http call :::::: ', error);
        });




      }).catch(function (err) {
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
    leftArrow.hide();
    rightArrow.hide();
  });

  leftArrow = createButton('Left Arrow');
  leftArrow.style('background-color', col);
  leftArrow.position(10, 240);
  leftArrow.hide();
  leftArrow.mousePressed(function () {
    console.log('left arrow clicked');
    if(index === 0 ){
      index = dummyResponse.length - 1;
    } else {
      index -= 1;
    }
    img = loadImage(dummyResponse[index].image);
  });

  rightArrow = createButton('rightArrow');
  rightArrow.style('background-color', col);
  rightArrow.position(775, 240);
  rightArrow.hide();
  rightArrow.mousePressed(function () {
    console.log('right arrow clicked');
    if(dummyResponse.length - 1 > index ){
      index += 1;
    } else {
      index = 0;
    }
    img = loadImage(dummyResponse[index].image);
  });

}

function draw() {
  image(video, 0, 0, 1024, 480);

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
    image(img, 0, 0, 1024, 480);
    rightArrow.show();
    leftArrow.show();
  }
  // image(video, 0, 0, width, width * video.height / video.width)
  // .then(function (obj) { 
  //     console.log('Success, You are a GEEK');       
  // })
  // .catch(function (err) { 
  //     console.log('Some error has occured'); 
  //     console.log(err);
  // }); 
}

