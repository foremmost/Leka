<?
include_once "config.php";
class Db {
	private $connect;
	public $insert_id;
	public $errno;
	public $errtext;
	protected $error;
	public function __construct (){
		$this->connect = new mysqli(GR_DB_HOST,GR_DB_LOGIN,GR_DB_PASSWORD,GR_DB_NAME);
		$this->connect->query('SET NAMES utf8');
		$this->insert_id = 0;
		$this->error = [];
	}
	function createNewConnect(){
		$this->connect->close();
		$this->connect = new mysqli(GR_DB_HOST,GR_DB_LOGIN,GR_DB_PASSWORD,GR_DB_NAME);
		$this->connect->query('SET NAMES utf8');
		$this->insert_id = 0;
		$this->error = [];
	}
	function query($sql){
		$result = $this->connect->query($sql);
		if (!$result) {
			echo "Не удалось выполнить запрос: (" . $this->connect-->errno . ") " . $this->connect->error;
		}
		$result->close();
		return $result;
	}
	function multi($sql){
		if (!$this->connect->multi_query($sql)) {
			echo "Не удалось выполнить мультизапрос: (" . $this->connect-->errno . ") " . $this->connect->error;
		}
		do {
			if ($res = $this->connect->store_result()) {
				var_dump($res->fetch_all(MYSQLI_ASSOC));
				$res->free();
			}
		} while ($this->connect->more_results() && $this->connect->next_result());
		$this->createNewConnect();
		return true;
	}
	public function prepare($sql,$bind='',$params=''){
		if (!$stmt = $this->connect->prepare($sql)) {
			$this->error['error'] = __METHOD__ . $this->connect->error;
			$this->error['sql'] = __METHOD__ . $sql;
			die(__METHOD__ . $this->connect->error);
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
				$this->insert_id = $insert_id;
			}
			$result = $stmt->get_result();
			$this->errno = $stmt->errno;
			$this->errtext = $stmt->error;
			if($stmt->affected_rows > 0){
				return $result;
			}
		} catch (Exception $e){
			$this->errno = $e->getLine();
			$this->errtext = $e->getMessage();
		}
		return $result;
	}
	function has($table,$condition){
		$whereStr = '';
		if(!empty($condition)){
			$whereStr = "WHERE {$condition}";
		}
		$sql = "
			SELECT * 
			FROM {$table}
			{$whereStr}
			";
		$field = $this->prepare($sql)->fetch_assoc();
		if(empty($field)){
			return false;
		}
		return true;
	}
	function get($table,$fields="",$where){
		$whereStr = '';
		if(!empty($where)){
			$whereStr = "WHERE {$where}";
		}
		$sql = "
			SELECT {$fields}
			FROM {$table}
			{$whereStr}
			";
		return $this->prepare($sql)->fetch_assoc();
	}
	function upgrade($table,$fields="",$condition){
		$whereStr = '';
		if(!empty($condition)){
			$whereStr = "WHERE {$condition}";
		}
		$sql = "
			UPDATE {$table}
			SET {$fields}
			{$whereStr}
			";
		return $this->prepare($sql);
	}
	function set($table,$fields="",$values){
		if(empty($fields)) return;
		$sql = "
			INSERT INTO {$table} ($fields)
			VALUES({$values});
			";
		return $this->prepare($sql);
	}
	function update($updateParams){
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
			$this->prepare($sql,$preparedStr,$values);
		}
		return true;
	}
	function insert($insertParams){
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
			$this->prepare($sql,$preparedStr,$values);
		}
		$id = $this->insert_id;
		if(!empty($id)){
			return $id;
		}
		return null;
	}
	function filter($data,$type='s'){
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
		$this->connect->close();
	}
}