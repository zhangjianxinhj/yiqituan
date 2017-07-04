<?php
header("Content-Type:application/json;charset=utf-8");
require('init.php');
@$phone = $_REQUEST['phone'];
@$user_name = $_REQUEST['user_name'];
@$sex = $_REQUEST['sex'];
@$addr = $_REQUEST['addr'];
@$did= $_REQUEST['did'];
if(empty($phone)||empty($user_name)||empty($sex)||empty($addr)||empty($did)){
  echo '[]';
    return;
}
$order_time=time()*1000;
//echo time();
$sql="INSERT INTO yqt_order VALUES (null,'$phone','$user_name','$sex','$order_time','$addr','$did')";
$result=mysqli_query($conn,$sql);
$addResult = [];
if($result){
    //返回订单编号
    $addResult['oid']=mysqli_insert_id($conn);
    $addResult['msg']='succ';
}else{
    $addResult['msg']='error';
}
$output = [];
$output[] = $addResult;

echo json_encode($output);
?>