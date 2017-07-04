<?php
header("Content-Type:application/json;charset=utf-8");
require('init.php');
@$phone = $_REQUEST['phone'];
if(empty($phone)){
  echo '[]';
    return;
}
$sql="SELECT o.oid,d.img_sm,d.did,o.order_time,o.user_name FROM yqt_dish d,yqt_order o WHERE d.did=o.did AND o.phone=$phone";
$result=mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
$str=json_encode($rows);
echo $str;
?>