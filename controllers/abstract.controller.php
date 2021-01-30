<?php
require_once "define.php";
require_once "dater.php";
abstract class ctrl{
	function __construct($params){
		$this->params = $params;
		$this->prepareData();
	}
	protected function replaceData($buffer){
		$replaceStrArr = [];
		$replaceValArr = [];
		foreach(Dater::getData() as $param=>$value){
			$replaceStrArr[] = "/{{(\W*)$param(\W*)}}/i";
			$replaceValArr[] = $value;
		}
		return preg_replace($replaceStrArr, $replaceValArr, $buffer);
	}
	function getAction(){
		if(isset($this->params['action'])){
			return $this->params['action'];
		}
		return false;
	}
	abstract function prepareData();

}