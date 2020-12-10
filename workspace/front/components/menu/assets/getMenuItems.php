<?
session_start();
global $data;
global $basePath;
include_once $basePath."utility.class.php";

$Utility = new Utility();

echo json_encode($Utility->getMenuItems($_SESSION['group_id']));