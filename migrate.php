<?
include_once "dev_back/front/core/migrate.class.php";
$Migrate = new Migrate();
$migrate = $Migrate->doMigrate();
echo "<h1>{$migrate}</h1>";