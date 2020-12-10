<?php
session_start();
include_once $_SERVER["DOCUMENT_ROOT"]."/workspace/front/core/utility.class.php";

$Utility = new Utility();

/*if(!isset($_SESSION['group_id'])){
	$page = '/';
}else{
	if(!empty($_GET)){
		$page = '/';
	}else{
		$page =  $_GET['page'];
	}
}*/
#print_r($_GET);
if(isset($_SESSION['page'])) {
	if (!empty($_GET['page'])) {
		$page = $_GET['page'];
	} else {
		$page = '/';
	}
}else{
	$page = '/';
}
$pageId = $Utility->getPageId($page);

if(!empty($pageId)){
	$modules = $Utility->getModulesOnPage($pageId);
}else{
	$modules = [];
}

echo json_encode($modules);


#
die();
//


