<?
global $data;
global $basePath;
include_once $basePath . "Categorier.class.php";

$Categorier = new Categorier();

echo json_encode($Categorier->getAllCategories());