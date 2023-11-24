<?php
  $file_name =  $_FILES['file']['name'];
  $tmp_name = $_FILES['file']['tmp_name'];
  $file_up_name = time().$file_name;
  $file_name = str_replace(' ', '-', $_FILES['file']['name']);
  move_uploaded_file($tmp_name, "files/".$file_up_name);
?>