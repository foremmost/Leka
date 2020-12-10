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
			}break;
			case 'f':{
				return (float) $data;
			}break;
			case 'i':{
				return (int) $data;
			}break;
			case 'p':{
				return addslashes(htmlentities($data));
			}break;
			case 'path':{
				return str_replace(' ','-',$data);
			}
		}
	}
	public function __destruct (){
		$this->connect->close();
	}
}