<?
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
$data = '';
$basePath = $_SERVER["DOCUMENT_ROOT"] . "/workspace/front/core/";
function handleClassMethod($componentName,$classMethod,$data){
	$path  = $_SERVER["DOCUMENT_ROOT"] . "/workspace/front/core/".$componentName.".class.php";
	#echo $path;
	if(file_exists($path)){
		include_once $path;
	}else{
		echo json_encode([
			'status'=>'fail',
			'data'=> 'Class '.$componentName.' not found',
			'failText'=>$path
		]);
		die();
	}
	$component = new $componentName();
	try{
		$methodData = $component->$classMethod($data);
		echo json_encode($methodData);
	} catch (Error $e){
		echo json_encode([
			'status'=>'fail',
			'data'=> 'Method `'.$classMethod.'` from class `'.$componentName.'` not found',
			'catchedError'=>$e->getMessage(),
			'catchedErrorLine'=>$e->getLine()
		]);
	}

	die();
}
function handleAssets($componentName,$file,$data=null){
	$assetsStr = $_SERVER["DOCUMENT_ROOT"] . "/workspace/front/components/";

	$path =  $assetsStr.$componentName.'/assets/'.$file.'.php';
	if(file_exists($path)){
		include_once $path;
	}else{
		echo json_encode([
				'status'=>'fail',
				'data'=> 'Handler '.$file.'.php not found'
		]);
		die();
	}
}

if($_SERVER['REQUEST_METHOD'] === 'GET'){
	$basePath = $_SERVER["DOCUMENT_ROOT"] . "/workspace/front/core/";
	$type = $_GET['type'];
	$request = 'get';
	$componentName = strtolower($_GET['componentName']);
	$method = strtolower($_GET['method']);
	handleAssets($componentName,$method);
}

if( ($_SERVER['REQUEST_METHOD'] === 'POST') && (empty($_POST))){
	$rawData = file_get_contents('php://input');
	$data = json_decode($rawData);
	$request = 'json';
	$componentName = strtolower($data->componentName);
	$method = $data->method;#strtolower($data->method);


	if(isset($data->type)){
		$type = $data->type;
		if(isset($data->data))
			$data = $data->data;
		handleClassMethod($componentName, $method, $data);
	}else{
		if(isset($data->data))
			$data = $data->data;
		handleAssets($componentName,$method, $data);
	}
#		$type = null;
	die();
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){

	$type = $_POST['type'];
	$request = 'post';
	$componentName = strtolower($_POST['componentName']);
	$method = strtolower($_POST['method']);
	handleAssets($componentName,$method);
}