<?
include_once "db.class.php";
class Settings{
	private $db;
	function __construct(){
		$this->db = new Db();
	}
	function getSetting($setting){
		$name = $setting->name;
		$sql = "
			SELECT `id`,`name`,`value`,`module_id`,`type`
			FROM settings
			WHERE `name` = ?
		";
		$settingOut = $this->db->prepare($sql,'s',[$name])->fetch_assoc();
		$settingOut['value'] = unserialize($settingOut['value']);
		if(!empty($settingOut)){
			return [
				'status'=>'success',
				'data'=> $settingOut
			];
		}
		return [
				'status'=>'fail',
				'failText'=> 'Setting not found',
				'data'=>[
						'name'=>$name
				]
		];
	}
	function getSettings($setting){}
	function getSystemSettings(){
		$sql = "
			SELECT `id`,`name`,`value`,`module_id`,`type`
			FROM settings
			WHERE `module_id` IS NULL
		";
		$settingOut = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
		$outSettings  =[];
		foreach( $settingOut as $setting){
			$outSet = $setting;
			$outSet['value'] = unserialize($setting['value']);
			$outSettings[] = $outSet;
		}
		if(!empty($outSettings)){
			return [
					'status'=>'success',
					'data'=> $outSettings
			];
		}
		return [
				'status'=>'fail',
				'failText'=> 'Settings not found'
		];
	}
	function setSetting($setting){
		$name = $setting->name;
		$value = serialize($setting->value);
		$sql = "
			INSERT INTO settings (`name`,`value`)
			VALUES (?,?)
		";
		$this->db->prepare($sql,'ss',[$name,$value]);
		$id = $this->db->insert_id;
		if(!empty($id)){
			return [
					'status'=>'success',
					'data'=>[
							'id'=>$id
					]
			];
		}
		return [
				'status'=>'fail',
				'data'=> 'Setting added fail'
		];
	}
	function updateSetting($setting){
		$id = $setting->id;
		$value = serialize($setting->value);
		$sql = "
			UPDATE settings 
			SET `value` = ?
			WHERE `id` = ?
		";
		$this->db->prepare($sql,'si',[$value,$id]);

		if($this->db->errno <= 0){
			return [
					'status'=>'success',
					'data'=>[
							'id'=>$id
					]
			];
		}
		return [
				'status'=>'fail',
				'data'=> 'Setting update fail',
				'failText'=> $this->db->errno
		];
	}
}