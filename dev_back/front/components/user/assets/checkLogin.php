<?php
session_start();
if (!isset($_SESSION['page'])) {
	session_destroy();
	echo json_encode([
		'status'=>'success',
		'page'=>'/'
	]);
} else {
	echo json_encode([
		'status'=>'success',
		'page' => $_SESSION['page'],
		'uId' => $_SESSION['u_id']
	]);
}



