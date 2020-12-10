<?
include_once "db.class.php";
class Rights{
	private $db;
	function __construct(){
		$this->db = new Db();
	}
	function getActions($groupData){
		$groupId = $groupData->groupId;

		$sql = "
			SELECT `id`,`name`,`type`,`group_id`,`access`
			FROM ( 
				SELECT `actions`.`id`,`name`,`type`,`group_rights`.`group_id` as `group_id`,access
				FROM `actions`
				LEFT OUTER JOIN `group_rights` ON `group_rights`.`action_id` = `actions`.`id`
				WHERE `group_id` = ? AND `actions`.`name` <> '/'
				UNION ALL
				SELECT `id`,`name`,`type`,null,null
				FROM `actions`
			  WHERE `actions`.`name` <> '/'
			) as `s`
			GROUP BY `name`
			ORDER BY `id`
		";

		$actions = $this->db->prepare($sql,'i',[$groupId])->fetch_all(MYSQLI_ASSOC);
		if($this->db->errno > 0){
			return [
				'status'=>'fail',
				'failText'=> "Get actions fail"
			];
		}
		if(!empty($actions)){
			return [
				'status'=>'success',
				'data'=> $actions
			];
		}else{
			return [
				'status'=>'success',
				'data'=>[]
			];
		}
	}
	function getModules($availSql = ''){
		$sql = "
			SELECT `id`,`name`
			FROM `modules`
			{$availSql}
			ORDER BY `modules`.`id`
		";
		$modules = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
		if(!empty($modules)){
			return $modules;
		}else{
			return [];
		}
	}
	function getModulesToAvail($data){
		$pageId = $data->pageId;
		$sql = "
			SELECT `id`,`page_id`,`module_id`,`sort`,`name`,`path`
				FROM (
	                SELECT `modules_on_page`.`id`,`page_id`,`module_id`,`sort`,`name`,`path`
	                    FROM `modules_on_page`
	                    LEFT OUTER JOIN `modules` ON `modules`.`id` = `modules_on_page`.`module_id`
	                    WHERE `page_id` = $pageId
	                        UNION ALL
	                    SELECT null,null,`modules`.`id`,null,`name`,null
	                    FROM `modules`
					) as `mp`
			GROUP BY `module_id`
		";
		$availModules = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
		$modules = array_replace($availModules);
		if($this->db->errno > 0){
			return [
				'status'=>'fail',
				'failText'=> "Get modules to avail error"
			];
		}
		if(!empty($modules)){
			return [
				'status'=>'success',
				'data'=> $modules
			];
		}else{
			return [
				'status'=>'success',
				'data'=>[]
			];
		}

	}
	function getPages(){
		$sql = "
			SELECT `id`,`name`
			FROM `actions`
			WHERE `type` = 'page'
		";
		$pages = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
		if(!empty($pages)){
			return [
				'status'=>'success',
				'data'=> $pages
			];
		}else{
			return [
					'status'=>'fail',
					'failText'=> "Get pages error"
			];
		}
	}
	function getGroups(){
		$sql = "
			SELECT `id`,`value` as `name`
			FROM `groups`
			
		";
		$groups = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
		if(!empty($groups)){
			return [
				'status'=>'success',
				'data'=> $groups
			];
		}else{
			return [
				'status'=>'fail',
				'failText'=> "Get groups error"
			];
		}
	}
	function checkRight($groupId,$actionId){
		$sql = "
			SELECT `id`
			FROM `group_rights`
			WHERE `group_id` = ?  AND `action_id` = ?
		";
		$id = $this->db->prepare($sql,'ii',[$groupId,$actionId])->fetch_assoc();

		if(!empty($id)){
			return $id['id'];
		}
		return -1;
	}
	function insertRight($groupId,$actionId,$access){
		$sql = "
			INSERT INTO `group_rights` (`group_id`,`action_id`,`access`)
			VALUES(?,?,?)
		";
		$this->db->prepare($sql,'iis',[$groupId,$actionId,$access]);
		if($this->db->errno > 0){
			return [
				'status'=>'fail',
				'failText'=> "Error insert right"
			];
		}
		$id = $this->db->insert_id;
		if(!empty($id)){
			return [
				'status'=>'success',
				'data'=>[
					'id'=>$id
				]
			];
		}
	}
	function updateRight($actionId,$access){
		$sql = "
			UPDATE `group_rights`
			SET `access`=?
			WHERE `id` = ? 
		";
		$this->db->prepare($sql,'ii',[$access,$actionId]);
		if($this->db->errno > 0){
			return [
				'status'=>'fail',
				'failText'=> "Error update right",
				'errno'=> $this->db->errno,
				'errtext'=> $this->db->errtext
			];
		}
		return [
			'status'=>'success',
			'data'=>[
				'id'=>$actionId
			]
		];
	}
	function changeActionAvail($actionData){
		$groupId = $actionData->groupId;
		$actionId = $actionData->actionId;
		$access = (int) $actionData->access;
		$actionExists = $this->checkRight($groupId,$actionId);
		if($actionExists <  0){
			return $this->insertRight($groupId,$actionId,$access);
		}else{
			return $this->updateRight($actionExists,$access);
		}
	}
	function insertModuleOnPage($pageId,$moduleId){
		$sort = 0;
		$sql = "
			INSERT INTO `modules_on_page` (`page_id`,`module_id`,`sort`)
			VALUES(?,?,?)
		";
		$this->db->prepare($sql,'iii',[$pageId,$moduleId,$sort]);
		if($this->db->errno > 0){
			return [
				'status'=>'fail',
				'failText'=> "Error insert module on page"
			];
		}
		$id = $this->db->insert_id;
		if(!empty($id)){
			return [
				'status'=>'success',
				'data'=>[
					'id'=>$id
				]
			];
		}
	}
	function deleteModuleOnPage($pageId,$moduleId){
		$sql = "
			DELETE FROM
			`modules_on_page`
			WHERE `page_id` = ? AND `module_id` = ?
		";
		$this->db->prepare($sql,'ii',[$pageId,$moduleId]);
		if($this->db->errno > 0){
			return [
				'status'=>'fail',
				'failText'=> "Error update module on page",
				'errno'=> $this->db->errno,
				'errtext'=> $this->db->errtext
			];
		}
		return [
			'status'=>'success',
			'data'=>[
				'id'=>$pageId
			]
		];
	}
	function checkModuleOnPage($pageId,$moduleId){
		$sql = "
			SELECT `id`
			FROM `modules_on_page`
			WHERE `page_id` = ?  AND `module_id` = ?
		";
		$id = $this->db->prepare($sql,'ii',[$pageId,$moduleId])->fetch_assoc();

		if(!empty($id)){
			return $id['id'];
		}
		return -1;
	}
	function changeModuleOnPage($actionData){
		$pageId = $actionData->pageId;
		$moduleId = $actionData->moduleId;
		$access = (boolean) $actionData->access;
		if($access){
			return $this->insertModuleOnPage($pageId,$moduleId);
		}else{
			return $this->deleteModuleOnPage($pageId,$moduleId);
		}
	}

}