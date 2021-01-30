<?
global $data;
global $basePath;
include_once $basePath."log.class.php";

$Log = new Log();

echo json_encode($Log->getLogs($data));