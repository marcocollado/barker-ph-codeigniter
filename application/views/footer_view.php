
<div id="footer">
 </div><!-- <div class="footer">-->
 </div><!--<div id="wrapper">-->
 <div id="samplefoot"></div>
    <?php 
        if(isset($loginsuccess)){
            if($loginsuccess){
                echo "<script>alert('Login Successful! You have 0 invalid attempts since last login.')</script>";
            }else{
                echo "<script>alert('Invalid login.')<script>";
            }
        }
    ?>
</body>
</html>