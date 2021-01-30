<?
include_once "db.class.php";
include_once "utility.class.php";
class Consultant{
	private $db;
	private $tempJoin;
	private $metaJoin;
	function __construct(){
		$this->db = new Db();
		$this->tempJoin = "
		    INNER JOIN `temp_users` ON `consultant_chats`.`source` = `temp_users`
		";
		$this->metaJoin = "
		    INNER JOIN `users_meta` ON `users_meta`.`u_id` = `consultant_chats`.`uId`
		";
	}

	function sendMessage($messageData){
		if(empty($messageData->message)) return [
			'status'=>'fail',
			'failText'=>'Message empty',
			'errorText'=>$this->db->errtext,
			'errorNo'=>$this->db->errno
		];
		$messageData->status = 0;
		$messageId = $this->db->insert([
			'tableName'=>'consultant_messages',
			'insertData'=>$messageData,
			'fieldsToInsert'=> [
				['s'=>'uId'],
				['s'=>'dialogId'],
				['s'=>'source'],
				['s'=>'message'],
				['s'=>'status']
			]
		]);
		if(!is_null($messageId)){
			return [
				'status'=>'success',
				'data'=>[
					'message'=>$messageData->message,
					'messageId'=>$messageId
				]
			];
		}
		return [
			'status'=>'fail',
			'failText'=>'Message creating error',
			'errorText'=>$this->db->errtext,
			'errorNo'=>$this->db->errno
		];
	}
	function createChat($chatData){
		$chatData->status = 0;
		$chatData->answerUid = 0;
		$chatData->id = $this->db->insert([
			'tableName'=>'consultant_chats',
			'insertData'=>$chatData,
			'fieldsToInsert'=> [
                ['s'=>'id'],
				['s'=>'uId'],
                ['s'=>'answerUid'],
				['s'=>'status'],
                ['s'=>'source']
			]
		]);
		if(!is_null($chatData->id)){
			return [
				'status'=>'success',
				'data'=>[
					'chatId'=>$chatData->id
				]
			];
		}
		return [
			'status'=>'fail',
			'failText'=>'Chat creating error',
			'errorText'=>$this->db->errtext,
			'errorNo'=>$this->db->errno
		];
	}

	function updateMessage($updateData){
		$this->db->update(
			[
				'tableName'=>'consultant_messages',
				'updateData' => $updateData,
				'fieldsToUpdate'=>[
					['i'=>'status']
				],
				'condition'=> ' WHERE `id` = ?',
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
	function updateChat($updateData){
		$this->db->update(
			[
				'tableName'=>'consultant_chats',
				'updateData' => $updateData,
				'fieldsToUpdate'=>[
					['i'=>'status']
				],
				'condition'=> ' WHERE `id` = ?',
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
	function updateAnswerUidInChat($updateData){
		$this->db->update(
			[
				'tableName'=>'consultant_chats',
				'updateData' => $updateData,
				'fieldsToUpdate'=>[
					['i'=>'answerUid']
				],
				'condition'=> ' WHERE `id` = ?',
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

	function getItemsCnt(){
		$sql = "
			SELECT COUNT(`id`) as `cnt` FROM `consultant_chats`
		";
		$cnt = $this->db->prepare($sql)->fetch_assoc();
		if(!empty($cnt)){
			return [
				'status' => 'success',
				'data'=>[
					'cnt'=>$cnt
				]
			];
		}
		return [
			'status' => 'fail',
			'failText'=> $this->db->errtext
		];
	}
	function getSearchedCnt($chatData){
		$status = $chatData->query;
		$sql = "
			SELECT COUNT(`id`) as `cnt` FROM `consultant_chats`
			WHERE `status` = ?
		";
		$cnt = $this->db->prepare($sql,'i',[$status])->fetch_assoc();
		if(!empty($cnt)){
			return [
				'status' => 'success',
				'data'=>[
					'cnt'=>$cnt
				]
			];
		}
		return [
			'status' => 'fail',
			'failText'=> $this->db->errtext
		];
	}
	function getMessagesCnt($messageData){
		$dialogId = $messageData -> dialogId;
		$sql = "
			SELECT COUNT(`id`) as `cnt` FROM `consultant_messages`
			WHERE `dialogId` = ?
		";
		$cnt = $this->db->prepare($sql,'i',[$dialogId])->fetch_assoc();
		if(!empty($cnt)){
			return [
				'status' => 'success',
				'data'=>[
					'cnt'=>$cnt
				]
			];
		}
		return [
			'status' => 'fail',
			'failText'=> $this->db->errtext
		];
	}

    function prepareChats($prepared){
        $chats = [];
        while($row = $prepared->fetch_assoc()){
            $chat['status'] = $row['status'];
            $chat['source'] = $row['source'];
            $chat['dialogId'] = $row['dialogId'];
            $chat['uId'] = $row['uId'];
            $chat['answerUid'] = $row['answerUid'];
            if($row['source'] == 'temp_users'){
                $chat['user'] = $this->getUserInfoFromTemp($row['uId']);
            }else{
                $chat['user'] = $this->getUserInfoFromMeta($row['uId']);
            }
            $chats[] = $chat;
        }
        if(!empty($chats)){
            return $chats;
        }
        return [];
    }
	function getChats($messageData){
		$perPage = $messageData->perPage;
		$page =  $messageData->page - 1;
		$page = ($perPage * $page);
		$sql = "
			SELECT `id` as `dialogId`,`status`,`uId`,`answerUid`,`source`
			FROM `consultant_chats`
			ORDER BY `id` ASC
			LIMIT ?,?
		";
		$prepared = $this->db->prepare($sql,'ii',[$page,$perPage]);
		return $this->prepareChats($prepared);
	}
    function getChatsByStatus($messageData){
        $perPage = $messageData->perPage;
        $page =  $messageData->page - 1;
        $page = ($perPage * $page);
        $status = $messageData->status;
        $sql = "
			SELECT `id` as `dialogId`,`status`,`uId`,`answerUid`,`source`
			FROM `consultant_chats`
			WHERE `status` = ?
			ORDER BY `id` DESC
			LIMIT ?,?
		";
        $prepared = $this->db->prepare($sql,'iii',[$status,$page,$perPage]);
        return $this->prepareChats($prepared);
    }
    function getChatById($messageData){
        $chatId = $messageData->chatId;
        $sql = "
			SELECT `id` as `dialogId`,`status`,`uId`,`answerUid`,`source`
			FROM `consultant_chats`
			WHERE `id` = ?
			ORDER BY `id` DESC
		";
        $chat = $this->db->prepare($sql,'i',[$chatId]);
        return $this->prepareChats($chat);
    }
    function getChatByUid($messageData){
        $uId = $messageData->uId;
        $sql = "
                SELECT `uId`,`id`
                FROM `consultant_chats`
                WHERE `uId` = ?
                ORDER BY `uId` DESC
		";
        $chat = $this->db->prepare($sql,'i',[$uId])->fetch_assoc();
        if(!empty($chat)){
            return $chat;
        }
        return null;
    }
    function getChatsByAnswerUid($messageData){
        $perPage = $messageData->perPage;
        $page =  $messageData->page - 1;
        $page = ($perPage * $page);
        $answerUid = $messageData->answerUid;
        $sql= "
			SELECT `id` as `dialogId`,`uId`,`answerUid`,`source`,`status`
			FROM `consultant_chats`
			WHERE `answerUid` = ?
			ORDER BY `id` DESC
			LIMIT ?,?
		";
        $chats = $this->db->prepare($sql,'iii',[$answerUid,$page,$perPage]);
        return $this->prepareChats($chats);
    }
	function getChatsByAnswerUidAndStatus($messageData){
		$perPage = $messageData->perPage;
		$page =  $messageData->page - 1;
		$page = ($perPage * $page);
        $answerUid = $messageData->answerUid;
        $status = $messageData->status;
		$sql= "
			SELECT `id` as `dialogId`,`status`,`uId`,`answerUid`,`source`
			FROM `consultant_chats`
			WHERE `answerUid` = ? and `status` = ?
			ORDER BY `id` DESC
			LIMIT ?,?
		";
		$chats = $this->db->prepare($sql,'iiii',[$answerUid,$status,$page,$perPage]);
        return $this->prepareChats($chats);
	}

    function getUserInfoFromMeta($u_id){
        $sql = "
                SELECT `name`,`second_name`,`email`,`u_id` as `id`
                FROM `users_meta`
                WHERE `u_id` = ?
                ORDER BY `u_id` DESC
		";
        $userInfo = $this->db->prepare($sql,'s',[$u_id])->fetch_assoc();
        if(!empty($userInfo)){
            return $userInfo;
        }
        return null;
    }
    function getUserInfoFromTemp($id){
        $sql = "
                SELECT `name`,`mail` as `email`,`id`
                FROM `temp_users`
                WHERE `id` = ?
                ORDER BY `id` DESC
		";
        $userInfo = $this->db->prepare($sql,'s',[$id])->fetch_assoc();
        if(!empty($userInfo)){
            return $userInfo;
        }
        return null;
    }

	function getLastMessage($messageData){
		$dialogId = $messageData->dialogId;
		$sql= "
				SELECT `consultant_messages`.`id`,`message`,`addDate`,`status`,`source`
				FROM `consultant_messages`
				WHERE `dialogId` = ?
				ORDER BY `id` DESC
				LIMIT 0,1
		";
		$message = $this->db->prepare($sql,'i',[$dialogId])->fetch_assoc();
		if(!empty($message)){
			return $message;
		}
		return [];
	}
	function getLastMessageId($messageData){
		$dialogId = $messageData->dialogId;
		$sql= "
				SELECT `id`
				FROM `consultant_messages`
				WHERE `dialogId` = ?
				ORDER BY `id` DESC
				LIMIT 0,1
		";
		$message = $this->db->prepare($sql,'i',[$dialogId])->fetch_assoc();
		if(!empty($message)){
			return $message['id'];
		}
		return null;
	}
	function getChatMessages($messageData){
		$perPage = $messageData->perPage;
		$page =  $messageData->page - 1;
		$page = ($perPage * $page);
		$dialogId = $messageData->dialogId;
		$sql= "
			SELECT `id`,`message`,`addDate`,`status`,`uId`,`source`
			FROM `consultant_messages`
			WHERE `dialogId` = ?
			ORDER BY `id` DESC
			LIMIT ?,?
		";
		$messages= $this->db->prepare($sql,'iii',[$dialogId,$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($messages)){
			return $messages;
		}
		return [];
	}
	function getNewChatMessages($messageData){
		$dialogId = $messageData->dialogId;
		$lastMessageId = $messageData->id;
		$sql= "
			SELECT `id`,`message`,`addDate`,`status`,`uId`,`source`
			FROM `consultant_messages`
			WHERE `id` > ? AND `dialogId` = ?
			ORDER BY `id` ASC
		";
		$messages = $this->db->prepare($sql,'ii',[$lastMessageId,$dialogId])->fetch_all(MYSQLI_ASSOC);
		if(!empty($messages)){
			return $messages;
		}
		return [];
	}
	function getChatMessagesFromId($messageData){
		$dialogId = $messageData->dialogId;
		$lastMessageId = $messageData->id;
		$sql= "
			SELECT `id`,`message`,`addDate`,`status`,`uId`,`source`
			FROM `consultant_messages`
			WHERE `id` < ? AND `dialogId` = ?
			ORDER BY `id` DESC
		";
		$messages = $this->db->prepare($sql,'ii',[$lastMessageId,$dialogId])->fetch_all(MYSQLI_ASSOC);
		if(!empty($messages)){
			return $messages;
		}
		return [];
	}
    function getMessageById($messageData){
        $messageId = $messageData->messageId;
        $sql= "
			SELECT `consultant_messages`.`status` as `status`,`addDate`,`uId`,`source`
			FROM `consultant_messages`
			WHERE `consultant_messages`.`id` = ?
		";
        $message = $this->db->prepare($sql,'i',[$messageId])->fetch_assoc();
        if(!empty($message)){
            return $message;
        }
        return null;
    }


}