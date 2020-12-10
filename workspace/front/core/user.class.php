<?
include_once "db.class.php";
include_once "utility.class.php";
include_once "ticket.class.php";
class User {
	private $db;
	public $users;
	public $table_name;
	function __construct(){
		$this->db = new Db();
	}
	function userExists($login){
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
	function checkLogin($login){
		$sql  = "
			SELECT `id`
			FROM `users`
			WHERE `login` = ?";
		$user = $this->db->prepare($sql,'s',[
				$this->db->filter($login,'s')
		])->fetch_assoc();
		if(!empty($user)){
			return [
					'status'=> 'success',
					'data' => ['id'=>$user['id']]
			];
		}else{
			return [
					'status'=> 'fail'
			];
		}
	}
	function giveTicket($uId){
		$Ticket = new Ticket();
		return $Ticket->create($uId);
	}

	function login($login,$pass){
		$sql  = "
			SELECT `id`,`group_id`,`login`,`password`
			FROM `users`
			WHERE `login` = ?";
		$user = $this->db->prepare($sql,'s',[
				$this->db->filter($login,'s')
		])->fetch_assoc();
		if(!empty($user)){
			$hashUserPassword = $user['password'];
			if( !(password_verify($pass,$hashUserPassword)) ){
				return false;
			}
			$token = $this->giveTicket($user['id']);
			return
				[
				'status'=> 'success',
				'data'=>
						[
							'id'=> $user['id'],
							'group_id'=> $user['group_id'],
							'token'=> $token
						]
			];
		}else{
			return [
					'status'=> 'fail'
			];
		}
	}
	function getName($uId){
		$sql = "
			SELECT `name`,`second_name`
			FROM `users_meta`
			WHERE `u_id` = ?
		";
		$user = $this->db->prepare($sql,'i',[$uId])->fetch_assoc();
		if($this->db->errno > 0){
			return [
					'status'=>'fail',
					'failText'=> "Get Name error"
			];
		}
		if(!empty($user)){
			return [
					'status'=>'success',
					'data'=> $user
			];
		}
	}


/*	function equalsPass($pass,$cPass){
		if( !($pass == $cPass)){
			return false;
		}
		return true;
	}
	function saveUser($user){
		if(is_array($user)){
			$user = (object) $user;
		}
		$login = $user->email  ?  $user->email : '';
		$pass = $user->pass   ?  $user->pass  : '';
		$cPass = $user->cpass  ?  $user->cpass : '';
		$groupId = $user->group  ?  $user->group : '';
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
		$name = $this->db->filter($userData['name']);
		$second_name = $this->db->filter($userData['second_name']);
		$patronymic = $this->db->filter($userData['patronymic']);
		$gender = $this->db->filter($userData['gender']);

		$month = $this->db->filter($userData['month'],'i');
		$day = $this->db->filter($userData['day'],'i');
		$year = $this->db->filter($userData['year'],'i');

		$countyId = $this->db->filter($userData['country'],'i');
		$phone = $this->db->filter($userData['phone']);

		$sql = "
			INSERT INTO users_meta (`u_id`,`name`,`second_name`,`patronymic`,`country_id`,`day`,`month`,`year`,`phone`,`gender`)
			VALUES(?,?,?,?,?,?,?,?,?,?)
		";
		$this->db->prepare($sql,'isssiiiiss',[
			$uId,
			$name,
			$second_name,
			$patronymic,
			$countyId,
			$day,
			$month,
			$year,
			$phone,
			$gender
		]);
		$id = $this->db->insert_id;
		if(isset($id) && !empty($id)){
			return [
					'status'=>'success',
					'data'=>[
							'id'=> $uId,
							'email'=> $userData['email'],
							'name'=>$name
					]
			];
		}
		return ['status'=>'fail'];
	}
	function getAll($userObj){
		$userObj = (object) $userObj;

		$pos = $userObj->pos ? $userObj->pos: 0;
		$perPage = $userObj->perPage ? $userObj->perPage: 20;
		$sql = "
			SELECT DISTINCT `users`.id,`login`,`group_id`,`users_meta`.name, `second_name`,`description`,`iin`,`phone`,`groups`.`value` as `group` 
			FROM (users
				LEFT JOIN `users_meta` ON  `users`.id = `users_meta`.u_id
				LEFT JOIN `groups` ON  `groups`.id = `users`.group_id
				    )
			WHERE `login` <> '' AND `group_id` <> 1
			LIMIT ?,?
		";
		$users = $this->db->prepare($sql,'ii',[$pos,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($users)){
			return $users;
		}
		return [];
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
	function update($user){
		if(is_array($user)){
			$user = (object) $user;
		}
		$passStr = '';
		$id = $user->id  ?  $user->id : '';
		$login = $user->login  ?  $user->login : '';
		$groupId = $user->role  ?  $user->role : '';
		$params = [
				$login,
				$groupId
		];
		$prepareStr = 'si';
		if(!empty($pass)){
			$pass = $user->pass   ?  $user->pass  : '';
			$cPass = $user->cpass  ?  $user->cpass : '';
			if(!$this->equalsPass($pass,$cPass)){
				return ['status'=>'not equals password'];
			}
			$preparedPass = password_hash($pass, PASSWORD_DEFAULT);
			$passStr = ', password = ?';
			array_push($params,$preparedPass);
			$prepareStr.='s';
		}
		array_push($params,$id);
		$sql = "
			UPDATE `users` 
			SET  `login` = ?,`group_id` = ? ".$passStr.
			"WHERE id = ?";
		$prepareStr.='i';
		#echo $prepareStr;
		$this->db->prepare($sql,$prepareStr,$params);
		return $this->updateMeta($user);
	}
	function updateMeta($user){
		#print_r($user);
		$uId = $user->id  ?  $user->id : '';
		if(empty($uId)) return ['status'=>'fail'];
		$name = $user->name  ?  $user->name : '';
		$second_name = $user->sname  ?  $user->sname : '';
		$email = $user->email  ?  $user->email : '';
		$phone = $user->phone  ?  $user->phone : '';
		$iin = $user->iin  ?  $user->iin : '';
		$sql = "
			UPDATE user_meta 
			SET `name` = ?,`second_name` = ?,`email` = ?,`iin` = ?,`phone` = ?
			WHERE id = ?
		";
		$status = $this->db->prepare($sql,'sssssi',[
				$name,
				$second_name,
				$email,
				$iin,
				$phone,
				$uId
		]);
		#print_r($this->db->stmt->errno);
		if($this->db->errno <= 0){
			return [
					'status'=>'success'
			];
		}
		return ['status'=>'fail'];
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
	function delete($obj){
		if(is_array($obj)){
			$obj = (object) $obj;
		}
		$id = $obj->id;
		$sql = "
			DELETE `users`,`user_meta` FROM `users` 
			INNER JOIN `user_meta` ON `users`.id = u_id
			WHERE `users`.`id` = ?
		";
		$this->db->prepare($sql,'i',[$id]);
		if($this->db->errno <= 0){
			return [
					'status'=>'success'
			];
		}
		return ['status'=>'fail'];
	}*/
	# ------------------
	# Работа с парнёрской программой
	# ------------------


}