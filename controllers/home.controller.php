<?
require_once 'main.controller.php';
class home extends main{
	private $parent;
	const componentName = 'home';
	function __construct($params){
		$this->parent = new parent($params);
		parent::__construct($params);
	}
	function prepareData(){
		$data = [
			'favicon'=>'/uploads/favicon.png',
			'title'=>'Home',
			'lang'=>'en'
		];
		return Dater::add($data);
	}
	function render(){
		include_once VIEWS_DIR.self::componentName."/index.php";
	}

}