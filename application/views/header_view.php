<!DOCTYPE html>
<html lang="en">
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 <title><?php echo (isset($title)) ? $title : "Barker-ph" ?> </title>
 <link rel="stylesheet" type="text/css" href="<?php echo base_url();?>css/jquery-ui_1.css"/>
 <link rel="stylesheet" type="text/css" href="<?php echo base_url();?>css/style.css" />
 <link rel="stylesheet" type="text/css" href="<?php echo base_url();?>css/rating.css" />
 <link rel="stylesheet" type="text/css" href="<?php echo base_url();?>css/jquery.dropdown.css" />
 <script type="text/javascript" src="<?php echo base_url();?>js/jquery-1.10.2_1.js"></script>
 <script type="text/javascript" src="<?php echo base_url();?>js/jquery-ui.js"></script>
 <script type="text/javascript" src="<?php echo base_url();?>js/custom.js"></script>
 <script type="text/javascript" src="<?php echo base_url();?>js/rating.js"></script>
 <script type="text/javascript" src="<?php echo base_url();?>js/jquery.dropdown.js"></script>
 <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
 <script type="text/javascript" src="<?php echo base_url();?>js/googlemaps.js"></script>
 
</head>
<body>
    <div id="samplehead">
        
    </div>
 <div id="wrapper">
     <h4><?php echo anchor('welcome/', 'Home'); ?></h4>