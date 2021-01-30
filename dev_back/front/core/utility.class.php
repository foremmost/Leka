<?php
require 'mail/Exception.php';
require 'mail/PHPMailer.php';
require 'mail/SMTP.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
include_once "db.class.php";
include_once "languager.class.php";

class Utility{
	private $db;

	function __construct(){
		$this->db = new Db();
	}
	function sendMail($mailData,$template){
		$Languager = new Languager();
		$mail = new PHPMailer(true);
		try {
			$mail->SMTPDebug = false;
		}catch (Exception $e) {
			echo "Message could not be sent. : {$mail->ErrorInfo}";
		}
		if(isset($mailData['lang'])){
			$lang = $mailData['lang'];
		}else{
			$lang = 'en';
		}
		global $mailPath;
		$mail->setLanguage(	$lang, $mailPath.'/language/');

		$email = $mailData['email'];
		$name = $mailData['name'];
		$msg = $mailData['msg'];
		$subject = $Languager->getTranslateToFront('Site Registration',$lang);#'Регистрация на сайте';
		//
		$mail->setFrom('noreply@ivprogram.com', 'Ivprogram Registration');
		$mail->addAddress($email, 'User');
		$mail->addCC('foremost186@gmail.com', 'Admin');
		$mail->addBCC('ivprgrm@gmail.com', 'Admin');

		// Content
		$mail->isHTML(true);                                  // Set email format to HTML
		$mail->Subject =  $subject;





		$from = "<br>";
		$from .= "<span style='color:red;font-size:1.3em;'>".$Languager->getTranslateToFront('E-mail',$lang).": </span>" . $email . "\n";
		$from .= "<br>";
		$from .= "<span style='color:red;font-size:1.3em;'>".$Languager->getTranslateToFront('Full name',$lang).": </span>" . $name . "\n";
		$from .= "<br>";
		$from .= "<span style='color:red;font-size:1.3em;'>".$Languager->getTranslateToFront('Message',$lang).": </span>" . $msg . "\n";
		$from .= "<br>";
		$from .= "<span style='color:red;font-size:1.3em;'>".$Languager->getTranslateToFront("Ip address",$lang).": </span>" . $_SERVER["SERVER_ADDR"];
		$from .= "<br>";
		$from .= "<span style='color:red;font-size:1.3em;'>".$Languager->getTranslateToFront('Browser',$lang).":</span>" . $_SERVER["HTTP_USER_AGENT"];
		$from .= "<br>";
		$from .= "<span style='color:red;font-size:1.3em;'>".$Languager->getTranslateToFront('Page',$lang).":</span>" . $_SERVER["HTTP_REFERER"];

		$mail->Body    = $from;

		$mail->send();
	}


	function getPageId($page){
		//,`group_id`,`user_id`,`access`
		$sql = "
			SELECT `id` 
			FROM `actions`
			WHERE `name` = ? AND `type` = 'page'
		";
		$id = $this->db->prepare($sql,'s',[$this->db->filter($page,'s')])->fetch_row();
		if(!empty($id)){
			return $id[0];
		}
		return null;
	}
	function getModuleName($moduleId){
		//,`group_id`,`user_id`,`access`
		$sql = "
			SELECT `name` 
			FROM `modules`
			WHERE `id` = ?
		";
		$name = $this->db->prepare($sql,'i',[$this->db->filter($moduleId,'i')])->fetch_row();
		#print_r($moduleId);
		if(!empty($name)){
			return $name[0];
		}
		return null;
	}
	function getModulesOnPage($pageId){
		$sql = "
			SELECT `module_id` 
			FROM `modules_on_page`
			WHERE `page_id` = ?
			ORDER BY `sort`
		";
		$modules = [];
		$moduleIds = $this->db->prepare($sql,'i',[$this->db->filter($pageId,'i')])->fetch_all(MYSQLI_ASSOC);
		#print_r($moduleIds);
		if(!empty($moduleIds)){
			foreach ($moduleIds as $moduleArr => $module){
				array_push($modules,$this->getModuleName($module['module_id']));
			}
			return $modules;
		}
		return null;
	}


	function getMenuItems($groupId){
		$sql = "
			SELECT `actions`.`id`,`actions`.`name`
			FROM `actions`
			INNER JOIN `group_rights` ON  `group_rights`.`action_id` = `actions`.`id`
			WHERE `type` = 'page' AND `group_rights`.`group_id` = ? AND `actions`.`name` <> '/'  AND `access` = TRUE 
			ORDER BY `actions`.`sort`,`actions`.`name`
		";

		$pages = $this->db->prepare($sql,'i',[$groupId])->fetch_all(MYSQLI_ASSOC);
		if($this->db->errno > 0){
			return [
					'status'=>'fail',
					'failText'=> "Get Menu items error"
			];
		}
		if(!empty($pages)){
			return [
					'status'=>'success',
					'data'=> $pages
			];
		}
	}

	function getSuperGroup(){
		return 1;
	}
	function isSuper(){
		session_start();
		$groupId = $_SESSION['group_id'];
		if($groupId == 1){
			return true;
		}
		return false;
	}

}