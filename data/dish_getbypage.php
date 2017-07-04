<?php
header("Content-Type:application/json;charset=utf-8");
require('init.php');
@$start = $_REQUEST['start'];
if(empty($start)){
  $start = 0;
}
$sql="SELECT did,name,price,img_sm,material FROM yqt_dish LIMIT $start,3";
$result=mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
$str=json_encode($rows);
echo $str;
?>