<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title><?php echo (isset($title)) ? $title : "Barker-ph" ?> </title>
        <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>css/jquery-ui_1.css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>css/style.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>css/rating.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>css/jquery.dropdown.css" />
        <script type="text/javascript" src="<?php echo base_url(); ?>js/jquery-1.10.2_1.js"></script>
        <script type="text/javascript" src="<?php echo base_url(); ?>js/jquery-ui.js"></script>
        <script type="text/javascript" src="<?php echo base_url(); ?>js/custom.js"></script>
        <script type="text/javascript" src="<?php echo base_url(); ?>js/rating.js"></script>
        <script type="text/javascript" src="<?php echo base_url(); ?>js/jquery.dropdown.js"></script>
        <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
        <script type="text/javascript" src="<?php echo base_url(); ?>js/googlemaps.js"></script>

    </head>
    <body>
        <div id="head" style='text-align: center;'>
            <img id='headerpic1' src='<?php echo base_url();?>images/Logoko3.jpg'/>
            <img id='headerpic2' src='<?php echo base_url();?>images/name1.jpg'/>
        </div>
        <div id="wrapper">
            <div class='topmenu'>
                <div class="menubtn"><?php echo anchor('welcome/', 'Home', array('class' => 'button')); ?></div>
                <div class="menubtn"><?php echo anchor('user/', 'New/Login', array('class' => 'button')); ?></div>
                <div class="menubtn"><?php echo anchor('findaway', 'Find A Way', array('class' => 'button')); ?></div>
                <div id="user">
                    <span id="welcomeuser">Welcome <?php echo ($username != "") ? '<span data-dropdown="#dropdown-1" data-horizontal-offset="-100">' . $username . '</span> | ' . anchor('user/logout/', 'logout', array('class' => 'button')) : 'visitor' ?> </span>
                </div> 
            </div>
