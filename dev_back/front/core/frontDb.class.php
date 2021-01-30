<?php
class frontDb {
	private static $connect;
	public static $insert_id;
	public static $errno;
	public static $errtext;
	protected static $error;
	public function __construct (){
		self::$connect = new mysqli(GR_DB_HOST,GR_DB_LOGIN,GR_DB_PASSWORD,GR_DB_NAME);
		self::$connect->query('SET NAMES utf8');
		self::$insert_id = 0;
		self::$error = [];
	}
	public static function createNewConnect(){
		if(self::$connect) self::$connect->close();
		self::$connect = new mysqli(GR_DB_HOST,GR_DB_LOGIN,GR_DB_PASSWORD,GR_DB_NAME);
		self::$connect->query('SET NAMES utf8');
		self::$insert_id = 0;
		self::$error = [];
	}
	public static function query($sql){
		if(self::$connect){
			self::__construct();
		}
		$result = self::$connect->query($sql);
		if (!$result) {
			echo "Не удалось выполнить запрос: (" . self::$connect-->errno . ") " . self::$connect->error;
		}
		$result->close();
		return $result;
	}
	public static function multi($sql){
		if(isNull(self::$connect)){
			self::__construct();
		}
		if (!self::$connect->multi_query($sql)) {
			echo "Не удалось выполнить мультизапрос: (" . self::$connect-->errno . ") " . self::$connect->error;
		}
		do {
			if ($res = self::$connect->store_result()) {
				var_dump($res->fetch_all(MYSQLI_ASSOC));
				$res->free();
			}
		} while (self::$connect->more_results() && self::$connect->next_result());
		self::createNewConnect();
		return true;
	}
	public static function prepare($sql,$bind='',$params=''){
		self::createNewConnect();
		if (!$stmt = self::$connect->prepare($sql)) {
			self::$error['error'] = __METHOD__ . self::$connect->error;
			self::$error['sql'] = __METHOD__ . $sql;
			die(__METHOD__ . self::$connect->error);
		}
		try{
			if (isset($params) && !empty($params)) {
				$bindValues = [];
				foreach ($params as $param_key => $param_value) {
					$bindValues[] = $param_value;
				}
				if(!is_object($stmt)){
					throw new Exception('Request Db error');
				}
				$stmt->bind_param($bind, ...$bindValues);
			}
			$stmt->execute();
			$insert_id = $stmt->insert_id;
			if($insert_id > 0){
				#echo 'id: '.$insert_id;
				self::$insert_id = $insert_id;
			}
			$result = $stmt->get_result();
			self::$errno = $stmt->errno;
			self::$errtext = $stmt->error;
			if($stmt->affected_rows > 0){
				return $result;
			}
		} catch (Exception $e){
			self::$errno = $e->getLine();
			self::$errtext = $e->getMessage();
		}
		return $result;
	}
	public static function has($table,$condition){
		$whereStr = '';
		if(!empty($condition)){
			$whereStr = "WHERE {$condition}";
		}
		$sql = "
			SELECT * 
			FROM {$table}
			{$whereStr}
			";
		$field = self::$prepare($sql)->fetch_assoc();
		if(empty($field)){
			return false;
		}
		return true;
	}
	public static function get($table,$fields="",$where){
		$whereStr = '';
		if(!empty($where)){
			$whereStr = "WHERE {$where}";
		}
		$sql = "
			SELECT {$fields}
			FROM {$table}
			{$whereStr}
			";
		return self::$prepare($sql)->fetch_assoc();
	}
	public static function upgrade($table,$fields="",$condition){
		$whereStr = '';
		if(!empty($condition)){
			$whereStr = "WHERE {$condition}";
		}
		$sql = "
			UPDATE {$table}
			SET {$fields}
			{$whereStr}
			";
		return self::$prepare($sql);
	}
	public static function set($table,$fields="",$values){
		if(empty($fields)) return;
		$sql = "
			INSERT INTO {$table} ($fields)
			VALUES({$values});
			";
		return self::prepare($sql);
	}
	public static function update($updateParams){
		$tableName = $updateParams['tableName'];
		$updateData = $updateParams['updateData'];
		$fieldsToUpdate = $updateParams['fieldsToUpdate'];
		$condition = $updateParams['condition'] ? $updateParams['condition'] : '';
		$conditionFields = $updateParams['conditionFields'] ? $updateParams['conditionFields'] : [];
		$preparedStr = '';
		$sql = "UPDATE `{$tableName}` SET ";
		$values = [];
		foreach ($fieldsToUpdate as $fieldArr){
			foreach ($fieldArr as $propType=>$propName){
				if(property_exists($updateData,$propName)){
					$sql.= " `{$propName}` = ?,";
					$preparedStr.=$propType;
					array_push($values, $updateData->$propName);
				}
			}
		}
		if(!empty($values)){
			if(!empty($condition)){
				if(!empty($conditionFields)) {
					$sql= substr($sql, 0, -1);
					$sql.= $condition;
					foreach ($conditionFields as $fieldArr) {
						foreach ($fieldArr as $propType=>$propName) {
							if(property_exists($updateData,$propName)) {
								$preparedStr.=$propType;
								array_push($values, $updateData->$propName);
							}
						}
					}
				}
			}
			self::$prepare($sql,$preparedStr,$values);
		}
		return true;
	}
	public static function insert($insertParams){
		$tableName = $insertParams['tableName'];
		$insertData = $insertParams['insertData'];
		$fieldsToUpdate = $insertParams['fieldsToInsert'];
		$preparedStr = '';
		$sql = "INSERT `{$tableName}` (";
		$sqlInsert = '';
		$values = [];
		foreach ($fieldsToUpdate as $fieldArr){
			foreach ($fieldArr as $propType=>$propName){
				if(property_exists($insertData,$propName)){
					$sql.= " `{$propName}`,";
					$sqlInsert.='?,';
					$preparedStr.=$propType;
					array_push($values, $insertData->$propName);
				}
			}
		}
		if(!empty($values)){
			$sqlInsert= substr($sqlInsert, 0, -1);
			$sql= substr($sql, 0, -1);
			$sql.= ') VALUES('.$sqlInsert.')';
			self::prepare($sql,$preparedStr,$values);
		}
		$id = self::$insert_id;
		if(!empty($id)){
			return $id;
		}
		return null;
	}
	public static function filter($data,$type='s'){
		switch($type){
			case 's':{
				return htmlspecialchars(trim(strip_tags($data)));
			}
			case 'f':{
				return (float) $data;
			}
			case 'i':{
				return (int) $data;
			}
			case 'p':{
				return addslashes(htmlentities($data));
			}
			case 'path':{
				return str_replace(' ','-',$data);
			}
			default: 	return false;
		}
	}
	public function __destruct (){
		if(self::$connect)	self::$connect->close();
	}
}