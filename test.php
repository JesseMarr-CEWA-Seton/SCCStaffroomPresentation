<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="text/javascript" src="data.json"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
* {box-sizing: border-box;}
body {
	font-family: Verdana, sans-serif;
	background-color: black;
}
.mySlides {
	display: none;
	text-align: center;
}

/* Slideshow container */
.slideshow-container {
  max-width: 100%;
  max-hight: 100%;
  position: relative;
  margin: auto;
}

/* Caption text */
.titleText {
  color: #f2f2f2;
  font-size: 128px;
  padding: 8px 12px;
  position: absolute;
  top: 5%;
  width: 100%;
  text-align: center;
  font-family: verdana;
}
.messageText {
  color: #f2f2f2;
  font-size: 72px;
  padding: 8px 12px;
  position: absolute;
  top: 25%;
  width: 100%;
  text-align: center;
  font-family: Bradley Hand, cursive;
}
/* Caption text */
.m {
  color: #f2f2f2;
  font-size: 24px;
  padding: 8px 12px;
  position: absolute;
  top: 20%;
  width: 100%;
  text-align: center;
}

/* Number text (1/3 etc) */
.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

/* The dots/bullets/indicators */
.dot {
  height: 32px;
  width: 32px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active {
  background-color: #717171;
}

/* Fading animation */
.fade {
  -webkit-animation-name: fade;
  -webkit-animation-duration: 0.5s;
  animation-name: fade;
  animation-duration: 0.5s;
}

@-webkit-keyframes fade {
  from {opacity: .4} 
  to {opacity: 1}
}

@keyframes fade {
  from {opacity: .4} 
  to {opacity: 1}
}
img {
	margin-left: auto;
	margin-right: auto;
	height:95vh;
	max-width: 99vw;
}

/* On smaller screens, decrease text size */
@media only screen and (max-width: 300px) {
  .text {font-size: 11px}
}
</style>
</head>
<body>
<div class="titleText">
<p id="title"></p>
</div>
<div class="messageText">
<p id="message" width="80%"></p>
</div>

<div style="text-align:center">
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
  <span class="dot" style="display: none"></span> 
</div>

<script>
var slideIndex = 0;
showSlides();

function reloadPage(slideIndexNumer, slideslength) {
	if (slideIndexNumer > (slideslength - 1)) {
		setTimeout(reloadPage, 2000)
		location.reload();
	}
}

function showSlides() {
  var i;
  var slides = JSON.parse(data);
  var dots = document.getElementsByClassName("dot");
  var j;
  slideIndex++;
  
  
  j = slides.length;
  reloadPage(slideIndex, j);
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
	if (i >= (slides.length - 1)) {
		dots[i].style.display = "none"; 
	} else {
		dots[i].style.display = ""; 
	}
  }
  
  // Put text to change here
  document.getElementById("title").innerHTML = slides[slideIndex-1].Title;
  document.getElementById("message").innerHTML = slides[slideIndex-1].Message;
  
  
  dots[slideIndex-1].className += " active";
  
  setTimeout(showSlides, 60000); // Change image every 30sec
}
</script>

</body>
</html> 
