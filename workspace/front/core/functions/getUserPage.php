<?php
session_start();


$pageArr = [
		'status'=>'success',
		'access'=>true,
		'page'=> '/',
		'title'=>'Авторизация'
];

function getPageModules($page){
	include_once $_SERVER["DOCUMENT_ROOT"]."/workspace/front/core/utility.class.php";
	$Utility = new Utility();
	$pageId = $Utility->getPageId($page);

	if(!empty($pageId)){
		return $modules = $Utility->getModulesOnPage($pageId);
	}
	return 	$modules = [];

}

function searchAvailablePage(){

}



if(!isset($_SESSION['page'])) {
	$page = '/';
	$pageArr['modules'] = getPageModules($page);
	echo json_encode($pageArr);
	die();
}

if(!empty($_GET)){
	if(isset($_GET['page'])){
		if($_GET['page'] == '/'){
			$page = $_GET['page'];
			$pageArr['modules'] = getPageModules($page);
			echo json_encode($pageArr);
			die();
		}
		include_once $_SERVER["DOCUMENT_ROOT"]."/workspace/front/core/guard.class.php";
		$Guard = new Guard();
		$action = $_GET['page'];
		$response = $Guard->checkRightForPage($action,$_SESSION['group_id']);
		if( ($response['status'] == 'success') &&  ($response['access']) ){
			$_SESSION['page'] = $action;
		}
		$pageArr['access'] = $response['access'];
		$pageArr['modules'] = getPageModules($action);
		echo json_encode($pageArr);
	}
}else{
	echo json_encode($pageArr);
}



