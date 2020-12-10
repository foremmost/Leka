<?
include_once "db.class.php";
class Route{
    private $db;
    function __construct(){
        $this->db = new Db();
    }
    function getRoutes(){
        $sql = "
            SELECT `id`,``
        ";
    }
    function getRoute(){
        $sql = "";
    }

    function addRoute($route){
        $sql = "";
    }
    function updateRoute(){
        $sql = "";
    }
}