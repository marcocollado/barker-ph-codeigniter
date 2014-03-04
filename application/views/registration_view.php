<div id="content">
    <div class="signup_wrap">
        <div class="signin_form">
            <?php echo form_open("user/login"); ?>
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" value="" />
            <label for="pass">Password:</label>
            <input type="password" id="pass" name="pass" value="" />
            <input type="submit" class="" value="Sign in" />
            <?php echo form_close(); ?>
        </div><!--<div class="signin_form">-->
    </div><!--<div class="signup_wrap">-->
    <div id="newuser" ><a href="#">Newbie?</a></div>
    <div id="regdialog" class="reg_form" title="Sign Up">
        <?php echo validation_errors('<p class="error">'); ?>
        <?php echo form_open("user/registration"); ?>
        <p>
            <label for="user_name">User Name:</label>
            <input type="text" id="user_name" name="user_name" value="<?php echo set_value('user_name'); ?>" />
            <span id="usr_verify" class="verify"></span>
            <div id="usr_err" class="errsignup"></div>
        </p>        
        <p>
            <label for="email_address">Your Email:</label>
            <input type="text" id="email_address" name="email_address" value="<?php echo set_value('email_address'); ?>" />
            <span id="email_verify" class="verify"></span>
            <div id="email_err" class="errsignup"></div>
        </p>
        <p>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" value="<?php echo set_value('password'); ?>" />
            <span id="password_verify" class="verify"></span>
            <div id="password_err" class="errsignup"></div>
        </p>
        <p>
            <label for="con_password">Confirm Password:</label>
            <input type="password" id="con_password" name="con_password" value="<?php echo set_value('con_password'); ?>" />
            <span id="confrimpwd_verify" class="verify"></span>
            <div id="confrimpwd_err" class="errsignup"></div>
        </p>        
        <p>
            <input id="signup" type="submit" class="greenButton" value="Submit" />
        </p>
        <?php echo form_close(); ?>
    </div><!--<div class="reg_form">-->    
</div><!--<div id="content">-->
<script type="text/javascript">
    $(document).ready(function() {
        $('#regdialog').dialog({
            autoOpen: false,
            modal: true
        });
        $(document).on('click','#newuser',function(e){
            e.preventDefault();
            $('#regdialog').dialog('open');
        });
        $(document).on('click','#signup', function(e){
//            e.preventDefault();
            var goodtogo = true;
            if($('#usr_verify').css('background-image').indexOf('yes') == -1){
                goodtogo = false;
            }
            if($('#email_verify').css('background-image').indexOf('yes') == -1){
                goodtogo = false;
            }
            if($('#password_verify').css('background-image').indexOf('yes') == -1){
                goodtogo = false;
            }
            if($('#confrimpwd_verify').css('background-image').indexOf('yes') == -1){
                goodtogo = false;
            }
            if(goodtogo){
            }else{
                e.preventDefault();
                alert('You still have invalid fields.');
            }
        });
        $("#user_name").keyup(function() {
            if ($("#user_name").val().length >= 4)
            {
                $.ajax({
                    type: "POST",
                    url: "<?php echo base_url(); ?>index.php/user/check_user",
                    data: "name=" + $("#user_name").val(),
                    success: function(msg) {
                        if (msg == true)
                        {
                            $("#usr_verify").css({"background-image": "url('<?php echo base_url(); ?>images/yes.png')"});
                            $('#usr_err').html('');
                        }
                        else
                        {
                            $("#usr_verify").css({"background-image": "url('<?php echo base_url(); ?>images/no.png')"});
                            $('#usr_err').html('User already exists!');
                        }
                    }
                });

            }
            else
            {
                $("#usr_verify").css({"background-image": "none"});
                $('#usr_err').html('');
            }
        });

        $("#email_address").keyup(function() {
            var email = $("#email_address").val();

            if (email != 0)
            {

                if (isValidEmailAddress(email))
                {
                    $("#email_verify").css({"background-image": "url('<?php echo base_url(); ?>images/yes.png')"});
                    email_con = true;
//                    register_show();
                    $('#email_err').html('');
                } else {
                    $("#email_verify").css({"background-image": "url('<?php echo base_url(); ?>images/no.png')"});
                    $('#email_err').html('Invalid email.');
                }

            }
            else {
                $("#email_verify").css({"background-image": "none"});
                $('#email_err').html('');
            }

        });

        $("#password").keyup(function() {

            if ($("#con_password").val().length >= 4)
            {
                if ($("#con_password").val() != $("#password").val())
                {
                    $("#confrimpwd_verify").css({"background-image": "url('<?php echo base_url(); ?>images/no.png')"});
                    $("#password_verify").css({"background-image": "url('<?php echo base_url(); ?>images/no.png')"});
                    pwd = false;
//                    register_show();
                    $('#password_err').html('Password does not match.');
                }
                else {
                    $("#confrimpwd_verify").css({"background-image": "url('<?php echo base_url(); ?>images/yes.png')"});
                    $("#password_verify").css({"background-image": "url('<?php echo base_url(); ?>images/yes.png')"});
                    $('#password_err').html('');
                }
            }else{
                $("#password_verify").css({"background-image": "none"});
                $('#password_err').html('');
            }
        });

        $("#con_password").keyup(function() {

            if ($("#password").val().length >= 4)
            {
                if ($("#con_password").val() != $("#password").val())
                {
                    $("#confrimpwd_verify").css({"background-image": "url('<?php echo base_url(); ?>images/no.png')"});
                    $("#password_verify").css({"background-image": "url('<?php echo base_url(); ?>images/no.png')"});
                    pwd = false;
//                    register_show();
                    $('#password_err').html('Password does not match');
                }
                else {
                    $("#confrimpwd_verify").css({"background-image": "url('<?php echo base_url(); ?>images/yes.png')"});
                    $("#password_verify").css({"background-image": "url('<?php echo base_url(); ?>images/yes.png')"});
                    $('#password_err').html('');
                }
            }else{
                $("#password_verify").css({"background-image": "none"});
                $('#password_err').html('');
            }
        });
    });
    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    }
</script>
