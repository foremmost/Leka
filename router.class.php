<?

class Router{
	public static $routes;
	function __construct() {
	#	$this->routes = [];
	}
	static function getCurrentRoute(){
		if( URI === '/'){
			return [
				'module'=>'home'
			];
		}
		$rawUri = explode('?',URI);
		$currentAction = [];
		$path = $rawUri[0];
		$query = $rawUri[1];
		$path = explode('/',$path);
		$currentAction['method'] = METHOD;
		$currentAction['module'] = $path[1];
		$currentAction['action'] = $path[2];
		parse_str($query,$queryParams);
		$currentAction['query'] = $queryParams;
		return $currentAction;
	}
	public static function add($route = null){
		if( empty(self::$routes) || !is_array(self::$routes)){
			self::$routes = [];
		}
		if( empty($route) || !is_null($route)){
			$route = self::getCurrentRoute();
		}
		array_push(self::$routes,$route);
	}
	public static function showRoutes(){
		print_r(self::$routes);
	}

	function get(){}
	function post(){}
	function head(){}
	function put(){}
}