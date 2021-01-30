<?
include_once 'main.controller.php';

class cat extends main{
	private $parent;
	const componentName = 'cat';
	function __construct($params){
		$this->parent = new parent($params);
		parent::__construct($params);
	}
	public function prepareData(){
		return  Dater::add([
			'title' => 'Category',
			'lang' => 'en'
		]);
	}
	function render(){
		include_once VIEWS_DIR . self::componentName."/index.php";
	}
}