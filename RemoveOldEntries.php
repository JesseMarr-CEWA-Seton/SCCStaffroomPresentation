<?php 

date_default_timezone_set("Australia/Perth"); 
$datetime=(date("Y-m-d H:i:s"));




$find = "testtertetet";

$file = file_get_contents('data.json');

$pieces = explode("},{", $file);

foreach ($pieces as $piece) {
	$data = count ($pieces);
}


echo $data;


//save the file
//file_put_contents('data.json',$file);


?> 