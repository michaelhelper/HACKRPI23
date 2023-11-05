<?php
if (isset($_GET['hosp'])) {
	$curl = curl_init();

	curl_setopt($curl, CURLOPT_URL, "https://hospitalstats.org/hospital-ratings/".$_GET['hosp'].".htm");
	//curl_setopt($curl, CURLOPT_USERAGENT, 'Chrome/79');
	curl_setopt($curl, CURLOPT_USERAGENT, 'HackRPI23/1');
	curl_setopt($curl, CURLOPT_AUTOREFERER, true);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_TIMEOUT, 10);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

	$html = curl_exec($curl);
	if(curl_error($curl)) {
		$logger->error('CURL Error', curl_error($curl));
	}
	curl_close($curl);

	$out = explode("Time until initial exam: <span class=\"bigstat\">", $html);
	$out = explode("</span><br/><br/>", $out[1]);
	die ("{\"wait\": \"".$out[0]."\"}");
}
?>