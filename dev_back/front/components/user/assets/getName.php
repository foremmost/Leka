<?
session_start();
global $data;
global $basePath;
include_once $basePath."user.class.php";

$User = new User();

echo json_encode($User->getName($_SESSION['u_id']));