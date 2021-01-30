<?
// Main const variables
#print_r($_SERVER);
define('ROOT_DIR',$_SERVER['DOCUMENT_ROOT']);
define('HOST',$_SERVER['HTTP_HOST']);
define('URI',$_SERVER['REQUEST_URI']);
define('HOST_STATUS',$_SERVER['REDIRECT_STATUS']);
define('METHOD',$_SERVER['REQUEST_METHOD']);
define('REMOTE_IP',$_SERVER['REMOTE_ADDR']);


//

define('CTRL_DIR',ROOT_DIR.'/controllers/');
define('VIEWS_DIR',ROOT_DIR.'/views/');

