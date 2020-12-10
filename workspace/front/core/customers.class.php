<?
include_once "db.class.php";
include_once "utility.class.php";
include_once "ticket.class.php";
class Customers {
	private $db;
	private $util;
	public $customers;
	function __construct(){
		$this->db = new Db();
		$this->util = new Utility();
	}
	function getGroups(){
	    $sql = "
	        SELECT `id`,`name`,`value`
	        FROM `groups`
	    ";
	    $groups = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
        if(!empty($groups)){
            return $groups;
        }
        return [];
    }
  function checkSuper(){
		$superGroup = $this->util->getSuperGroup();
		$hasDefault = "
			WHERE `group_id` <> '{$superGroup}'
		";
		return $hasDefault;
  }

	function customerExists($login){
		$sql = "
			SELECT id FROM 
			`users`
			WHERE `login` = ? 
		";
		$id = $this->db->prepare($sql,'s',[$login]);
		if($id->num_rows > 0){
			return true;
		}
		return false;
	} 

	function search($searchData){
		$perPage = $searchData->perPage;
		$page =  $searchData->page - 1;
		$page = ($perPage * $page);
		$query = $searchData->searchQuery;
		$whereAnd = " AND `group_id` <> 1";
		if($this->util->isSuper()){
			$whereAnd = '';
		}
		$sql = "
			SELECT `users`.`id`,`login`,`group_id`,`description`,
			       `name`,`second_name`,`patronymic`,`phone`,`gender`,`country_id`
			FROM `users`
			INNER JOIN `users_meta` ON `users`.`id` = `users_meta`.`u_id`
			WHERE `login` <> '' {$whereAnd}  AND (`name` LIKE ? OR `second_name` LIKE ? OR `login` LIKE ?)
			
			LIMIT ?,?
		";
		$customers = $this->db->prepare($sql,'sssii',["%{$query}%","%{$query}%","%{$query}%",$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($customers)){
			return $customers;
		}
		return [];
	}


	function saveUser($user){
		if(is_array($user)){
			$user = (object) $user;
		}
		$login = $user->login  ?  $user->login : '';
		$pass = $user->pass   ?  $user->pass  : '';
		$cPass = $user->cpass  ?  $user->cpass : '';
		$groupId = $user->group_id  ?  $user->group_id : '3';
		if(!$this->equalsPass($pass,$cPass)){
			return [
					'status'=>'fail',
					'failText'=>'Password not equals'
			];
		}
		$preparedPass = password_hash($pass, PASSWORD_DEFAULT);
		$sql = "
            INSERT INTO `users` 
                (`login`,`password`,`group_id`)
            VALUES (?,?,?)";
		$this->db->prepare($sql,"ssi",[
				$login,
				$preparedPass,
				$groupId
		]);
		$id = $this->db->insert_id;
		return $this->addMeta($id,$user);
	}
	function addMeta($uId,$userData){
		$userData = (array) $userData;
		$name = $this->db->filter($userData['name']);
		$second_name = $this->db->filter($userData['second_name']);
		$description = $this->db->filter($userData['description']);
		$sql = "
			INSERT INTO users_meta (`u_id`,`name`,`second_name`,`description`)
			VALUES(?,?,?,?)
		";
		$this->db->prepare($sql,'isss',[
				$uId,
				$name,
				$second_name,
				$description
		]);
		$id = $this->db->insert_id;
		if(isset($id) && !empty($id)){
			return [
					'status'=>'success',
					'data'=>[
							'id'=> $uId,
							'login'=> $userData['login'],
							'name'=>$name
					]
			];
		}
		return ['status'=>'fail'];
	}
	function getAll($userData){
		$userData = (object) $userData;
		$perPage = $userData->perPage;
		$page =  $userData->page - 1;
		$page = ($perPage * $page);

		$whereAnd = " AND `group_id` <> 1";
		if($this->util->isSuper()){
			$whereAnd = '';
		}

		$sql = "
			SELECT DISTINCT `users`.id,`login`,`group_id`,`users_meta`.name, `second_name`,`description`,`iin`,`phone`,`groups`.`value` as `group` 
			FROM (users
				LEFT JOIN `users_meta` ON  `users`.id = `users_meta`.u_id
				LEFT JOIN `groups` ON  `groups`.id = `users`.group_id
				    )
			WHERE `login` <> '' {$whereAnd}
			LIMIT ?,?
		";
		$users = $this->db->prepare($sql,'ii',[$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($users)){
			return $users;
		}
		return [];
	}

	function equalsPass($pass,$cPass){
		if( !($pass == $cPass)){
			return false;
		}
		return true;
	}


	function addUserType($obj){
		$name = $obj['name'];
		$sql = "
			INSERT INTO user_types
			(name)
			VALUES(?)
			";
		$this->db->prepare($sql,'s',[
				$this->db->filter($name)
		]);
		$id = $this->db->insert_id;
		if(isset($id) && !empty($id)){
			return [
					'status'=> 'success',
					'data'=>[
							'id'=>$id,
							'name'=>$name
					]
			];
		}else{
			return [
					'status'=>'fail'
			];
		}
	}



	function updateMeta($itemData,$id){
		$this->db->update(
			[
				'tableName'=>'users_meta',
				'updateData' => $itemData,
				'fieldsToUpdate'=>[
						['s'=>'name'],
						['s'=>'second_name'],
						['s'=>'description']
				],
				'condition'=> ' WHERE `u_id` = ?',
				'conditionFields'=>[['i'=>'id']]
			]
		);
		if($this->db->errno <= 0){
			return [
				'status'=>'success'
			];
		}
		return ['status'=>'fail'];
	}
	function editUser($itemData){
		if(is_array($itemData)){
			$itemData = (object) $itemData;
		}
		$id = $itemData->id;
		if( (!isset($id)) || (empty($id))  ) return null;

		if($this->db->update(
				[
					'tableName'=>'users',
					'updateData' => $itemData,
					'fieldsToUpdate'=>[['s'=>'login'],['i'=>'group_id'],['s'=>'pass']],
					'condition'=> ' WHERE `id` = ?',
					'conditionFields'=>[['i'=>'id']]
				]
		)){
			$this->db->update(
				[
					'tableName'=>'users_meta',
					'updateData' => $itemData,
					'fieldsToUpdate'=>[
						['s'=>'name'],
						['s'=>'second_name'],
						['s'=>'description']
					],
					'condition'=> ' WHERE `u_id` = ?',
					'conditionFields'=>[['i'=>'id']]
				]
			);
		};
		return $this->updateMeta($itemData,$id);
	}
	function getItemsCnt(){
		$hasDefault = $this->checkSuper();
		$sql = "
			SELECT COUNT(id) as `cnt`
			FROM `users`
		{$hasDefault}
		";
		$response = $this->db->prepare($sql)->fetch_assoc();
		if(!empty($response)){
		    return [
		    		'status'=>'success',
		    		'data' => [
		    			'cnt'=>$response['cnt']
						]
				];
		}
		return 0;
    }
	function getSearchedCnt($searchData){
			$query = $searchData->searchQuery;
			$sql = "
				SELECT  COUNT(`users`.`id`) as `cnt`
				FROM `users`
				INNER JOIN `users_meta` ON `users`.`id` = `users_meta`.`u_id`
				WHERE `login` <> '' AND `group_id` <> 1  AND (`name` LIKE ? OR `second_name` LIKE ? OR `login` LIKE ? )
			";
			$response = $this->db->prepare($sql,'sss',["%{$query}%","%{$query}%","%{$query}%"])->fetch_assoc();
			if(!empty($response)){
					return (int) $response['cnt'];
			}
			return 0;
	}



	function getUserMeta($user){
		if(is_array($user)){
			$user = (object) $user;
		}
		$uId = $user->id  ?  $user->id : '';
		$sql = "
			SELECT DISTINCT `users`.id,`user_meta`.name, `second_name`,`iin`,`email`
			FROM users
				INNER JOIN user_meta ON  users.id = user_meta.u_id
			WHERE `users`.id = ? AND  `user_meta`.u_id = ?
		";
		$user = $this->db->prepare($sql,'ii',[
				$this->db->filter($uId,'i'),
				$this->db->filter($uId,'i')
		])->fetch_assoc();
		if(!empty($user)){
			return [
					'status'=> 'success',
					'data'=>$user
			];
		}
		return [];
	}



	function delete($itemObj){
		if(is_array($itemObj)){
			$itemObj = (object) $itemObj;
		}
		$id = $itemObj->id;
		$sql = "
			DELETE `users` FROM `users` 
			WHERE `users`.`id` = ?
		";
		$this->db->prepare($sql,'i',[$id]);
		if($this->db->errno <= 0){
			return [
					'status'=>'success'
			];
		}
		return [
			'status'=>'fail',
			'failText'=>$this->db->errtext
		];
	}


}