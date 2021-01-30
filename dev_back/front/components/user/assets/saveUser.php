<?
global $data;
global $basePath;
include_once $basePath."user.class.php";

$User = new User();

echo json_encode($User->saveUser($data));