<?
include_once "db.class.php";

class Migrate{
	private $db;
	private $path;
	private $localStates;
	private $dbStates;
	function __construct(){
		$this->db = new Db();
		$this->path = $_SERVER["DOCUMENT_ROOT"].'/migrates';
		$this->getDbMigrateStates();
		$this->getLocalMigrateStates();
	}
	function getLocalMigrateStates(){
		$migratesArray = 	scandir($this->path);
		$states = [];
		foreach ($migratesArray as $file){
			if($file == '.' || $file == '..'){
				continue;
			}
			$f = file_get_contents($this->path.'/'.$file);
			if(!file_exists($this->path.'/'.$file)) continue;
			$outState = [];
			$outState['sql'] =  $f;
			$outState['state'] =  md5($f);
			$states[$file] = $outState;
		}
		$this->localStates = $states;
	}
	function getDbMigrateStates(){
		$states = $this->db->get('settings','value',"name='migrate'");
		$this->dbStates = [];
		if(empty($states)){
			$this->dbStates = [];
			return;
		}
		$states = unserialize($states['value']);
		if(is_array($states)){
			foreach ($states as $name=>$state){
				$this->dbStates[$name] = $state;
			}
		}else{
			$this->dbStates = [];
		}
	}
	function compareStates(){
		if(empty($this->localStates)){
			return 'Database is actual';
		}
		$needMigrate = false;
		foreach($this->localStates as $fileName=>$state){
				$db = $this->dbStates[$fileName];
				$local = $this->localStates[$fileName];
				if(isset($db)){
					if($db['state'] != $local['state']){
						$needMigrate = true;
						$this->migrate($local['sql']);
						$this->dbStates[$fileName]['state'] = $local['state'];
					}
				}else{
					$needMigrate = true;
					$this->migrate($this->localStates[$fileName]['sql']);
					$this->dbStates[$fileName]['state'] = $this->localStates[$fileName]['state'];
				}
		}
		$this->save(
			serialize($this->dbStates)
		);
		if(!$needMigrate){
			return 'Database is actual';
		}
		return 'Migrate is done';
	}
	function migrate($sql){
		$this->db->multi($sql);
	}
	function save($migrateStr){
			if($this->db->has('settings',"name='migrate'")){
				$this->db->upgrade('settings',"value='{$migrateStr}'","name='migrate'");
				return ;
			}
			$this->db->set('settings',"name,value","'migrate','{$migrateStr}'");
	}
	function doMigrate(){
			return $this->compareStates();
	}
}