<?php
include_once "db.class.php";
class Filer{
	private $uploads_dir;
	function __construct(){
		$this->uploads_dir = $_SERVER["DOCUMENT_ROOT"]."/uploads/";
		$this->uploadsPath ="/uploads/";
		if(!is_dir($this->uploads_dir)){
			mkdir($this->uploads_dir);
		}
	}
	function getFiles($fileData){
		$dir =  $fileData->dir ? $fileData->dir : '';
		ini_set('default_charset','UTF-8');
		$pathDir = $this->uploadsPath;
		$path  = (string) mb_convert_encoding($this->uploads_dir,"UTF-8");
		if(!empty($dir)) {
			$path = (string) mb_convert_encoding($this->uploads_dir.'/'.$dir,"UTF-8");
			$pathDir = $this->uploadsPath.'/'.$dir;
		}
		$commonArray = scandir($path);
		$dir_arr = [];
		$files_arr =[];
		foreach ($commonArray as $file){
			if($file == '.' || $file == '..'){
				continue;
			}
			$f = new SplFileInfo($path.'/'.$file);
			if(!file_exists($path.'/'.$file)) continue;
			$file_out['size'] = $f->getSize();
			$file_out['date'] = date('Y-d-m H:i:s',$f->getMTime());
			$file_out['role'] = $f->getPerms();
			$file_out['name'] = mb_convert_encoding($f->getFilename(),"UTF-8");
			$file_out['pathName'] = $pathDir.'/'.mb_convert_encoding($f->getFilename(),'UTF-8');
			if(!is_dir($f)){
				$file_out['type'] = $f->getExtension();
				$dir_arr[] = $file_out;
			}else{
				$file_out['type'] = 'dir';
				$files_arr[] = $file_out;
			}
		}
		$out_files = array_merge($files_arr,$dir_arr);
		# print_r($out_files);
		return $out_files;
	}
	function getFile($fileData){
		$dir = $fileData->dir;
		$fileName = $fileData->fileName;
		$path = $this->uploads_dir;
		if(!empty($dir)) $path = $this->uploads_dir.'/'.$dir;

		$f = new SplFileInfo($path.'/'.$fileName);

		if(!file_exists($path.'/'.$fileName)) return [];
		$file_out['size'] = $f->getSize();
		$file_out['date'] = date('Y-d-m H:i:s',$f->getMTime());
		$file_out['role'] = $f->getPerms();
		$file_out['name'] = mb_convert_encoding($f->getFilename(),"UTF-8");
		$file_out['pathName'] = '/uploads/'.mb_convert_encoding($f->getFilename(),'UTF-8');
		#$file_out['type'] = $f->getExtension();
		if(!is_dir($f)){
			$file_out['type'] = $f->getExtension();
		}else{
			$file_out['type'] = 'dir';
		}
		return 	$file_out;
	}
	function move_file($source,$dest){
		echo 'd'.$source;
		echo 's'.$dest;
		copy($this->uploads_dir.$source,$this->uploads_dir.$dest);
	}
	function rename($name){
		$old = mb_convert_encoding($this->uploads_dir.$name->old,'UTF-8');
		$new = mb_convert_encoding($this->uploads_dir.$name->new,'UTF-8');
		return array('answer'=>rename($old,$new));
	}
	function createFolder($dir){
		if( mkdir(mb_convert_encoding($this->uploads_dir.$dir->path.'/'.$dir->folderName,'UTF-8'))){
			return array(
					'status'=>'success',
					'data' => $this->uploads_dir.$dir->path.$dir->folderName
			);
		}
	}
	function dir_delete($path){
		$common_array = scandir($path);
		foreach ($common_array as $file){
			if($file == '.' || $file == '..'){
				continue;
			}
			$file_path = $path.'/'.$file;
			if(is_dir($file_path)){
				$empty = count(scandir($file_path));
				if($empty > 2){
					$this->dir_delete($file_path);
				}else{
					rmdir($file_path);
				}
			}else{
				unlink($file_path);
			}
		}
	}
	function delete($file){
		$dir =  $file->dir ? $file->dir : '';
		$path  = (string) mb_convert_encoding($this->uploads_dir.$file->name,'UTF-8');
		if(!empty($dir)) $path = (string) mb_convert_encoding($this->uploads_dir.'/'.$dir.'/'.$file->name,"UTF-8");
		$f = new SplFileInfo($path);
		if(is_dir($f)){
			do{
				$empty = count(scandir($f));
				if($empty == 2){
					rmdir($f);
				}
				if(!is_dir($f)){ break;}
				$this->dir_delete($f);
			}while($empty > 2);
		}else{
			unlink($f);
		}
		return array('answer'=>'success');
	}
	function download($files){
		if(!extension_loaded('zip')){
			echo 'Ошибка скачивания';
			return false;
		}
		$dir = '../../../uploads/';
		$zip = new ZipArchive();
		$zip_name = '../../../uploads/'.time().'.zip';
		$res =  $zip->open('test.zip', ZipArchive::CREATE);
		if(!$res) {
			$error = "* Sorry ZIP creation failed at this time";
			die('s');
		}
		foreach($files as $file) {
			$file_name = $dir.$file;
			echo $file_name;
			$zip->addFile( $file_name); // добавляем файлы в zip архив
		}
		$zip->close();
		if(file_exists($zip_name)){
			echo 'test';
			header('Content-type: application/zip');
			header('Content-Disposition: attachment; filename="'.$zip_name.'"');
			readfile($zip_name);
		}

	}
}
?>

