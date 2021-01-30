<?
require_once "loader.php";
//
require_once "router.class.php";
#require_once CTRL_DIR.'dater.php';

$currentRoute = Router::getCurrentRoute();

#print_r($currentRoute);

$currentModule = $currentRoute['module'];
$urlToCtr = CTRL_DIR.$currentModule.".controller.php";

require_once $urlToCtr;

$Module = new $currentModule($currentRoute);
$Module->doRender();

#print_r(Dater::getData());

