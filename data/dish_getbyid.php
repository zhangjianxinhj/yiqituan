<?php
header("Content-Type:application/json;charset=utf-8");
require('init.php');
@$id = $_REQUEST['id'];
if(empty($id)){
  echo '[]';
    return;
}
$sql="SELECT did,name,price,img_lg,material,detail FROM yqt_dish WHERE did=$id";
$result=mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
$str=json_encode($rows);
echo $str;
?>