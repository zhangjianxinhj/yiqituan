<?php
header("Content-Type:application/json;charset=utf-8");
require('init.php');
@$kw=$_REQUEST['kw'];
if(empty($kw)){
  echo '[]';
  return;
}
$sql="SELECT did,name,img_sm,material,price FROM yqt_dish WHERE material LIKE '%$kw%' OR name LIKE '%$kw%'";
$result=mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
$str=json_encode($rows);
echo $str;
?>