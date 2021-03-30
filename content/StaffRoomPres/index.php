<!DOCTYPE html>
<html>
	<head>
	  <meta http-equiv="Content-Type" content="text/html; charset=utf8" />
	  <title>Notices</title>
<style>
	body {
		background-color: black;
		color: white;
		font-family: Cursive;
	}
	
	h1 {
		font-family: Cursive;
		font-size: 400%;
		text-align: center;
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
	
	/* The dots/bullets/indicators */
	.dot {
		height: 20px;
		width: 20px;
		margin: 0 2px;
		background-color: #404040;
		border-radius: 50%;
		display: inline-block;
		transition: background-color 0.6s ease;
		color: #bbb;
	}
	
	.active {
		background-color: #bbb;
		color: #404040;
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
	
	/* On smaller screens, decrease text size */
	@media only screen and (max-width: 300px) {
		.text {font-size: 11px}
	}
</style>
	</head>

	<body onload="init()">
		<h1>Notices</h1>
	
		<div style="text-align:center">
			<span class="dot" style="display: none">1</span> 
			<span class="dot" style="display: none">2</span> 
			<span class="dot" style="display: none">3</span> 
			<span class="dot" style="display: none">4</span> 
			<span class="dot" style="display: none">5</span> 
			<span class="dot" style="display: none">6</span> 
			<span class="dot" style="display: none">7</span> 
			<span class="dot" style="display: none">8</span> 
			<span class="dot" style="display: none">9</span> 
			<span class="dot" style="display: none">10</span> 
			<span class="dot" style="display: none">11</span> 
			<span class="dot" style="display: none">12</span> 
		</div>
		
		<div class="slideshow-container">
			<div class="mySlides fade">
				<h2 id="Notice1"></h2>
			</div>

			<div class="mySlides fade">
				<h2 id="Notice"></h2>
			</div>

			<div class="mySlides fade">
				<h2 id="Notice3"></h2>
			</div>
			
			<div class="mySlides fade">
				<h2 id="Notice4"></h2>
			</div>
		</div>
		
<script>
var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active", "");
		if (i >= (slides.length)) {
			dots[i].style.display = "none"; 
		} else {
			dots[i].style.display = ""; 
		}
	  }

  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}

function refresh() {
	  var req = new XMLHttpRequest();
	  req.onreadystatechange = function () {
		if (req.readyState == 4 && req.status == 200) {
		  document.getElementById('Notice').innerText = req.responseText;
		}
	  }
	  req.open("GET", 'reload.txt', true);
	  req.send(null);
	}

	function init() {
	  refresh()
	  var int = self.setInterval(function () {
		refresh()
	  }, 1000);
	}
</script>
	</body>
</html>