<?
require_once 'main.controller.php';
require_once ROOT_DIR.'/workspace/front/core/goodser.class.php';
class goods extends main{
	private $parent;
	private $model;
	const componentName = 'goods';
	function __construct($params){
		$this->parent = new parent($params);
		parent::__construct($params);
	}
	public function prepareData(){
		$action = $this->getAction();
		if($action){
			$item = Goodser::getFull($action);
		}
		print_r($item);
		return Dater::add($item);
	}
	function render(){
		include_once VIEWS_DIR . self::componentName."/index.php";
	}
}