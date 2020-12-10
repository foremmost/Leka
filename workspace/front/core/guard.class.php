<?php
include_once"db.class.php";

class Guard{
	private $db;
	function __construct(){
		$this->db = new Db();
	}
	function getActionId($action){
		$sql = "
			SELECT id 
			FROM actions
			WHERE `name` = ?";
		$action = $this->db->prepare($sql,'s',[$action])->fetch_assoc();
		if(!empty($action)){
			return $action['id'];
		}
		return false;
	}
	function checkRightForPage($actionName,$groupId,$uId=null){
		$actionId = $this->getActionId($actionName);
		if(!$actionId) return [
			'status'=>'fail',
			'text'=>'You havent access'
		];
		$sql =  "
			SELECT access
			FROM `group_rights`
			WHERE  `action_id` = ? AND `group_id` = ?
		";
		$rights = $this->db->prepare($sql,'ii',[$actionId,$groupId])->fetch_assoc();
		if(!empty($rights)){
			return [
					'status'=>'success',
					'access'=>$rights['access']
			];
		}else{
			return [
					'status'=>'success',
					'access'=> false
			];
		}
	}
}