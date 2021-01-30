<?
global $data;
global $basePath;
include_once $basePath . "categorier.class.php";

$Categorier = new Categorier();

echo json_encode($Categorier->getParentCategories($data));