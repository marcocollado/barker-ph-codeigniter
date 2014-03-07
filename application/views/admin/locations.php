<div class="locationlist_wrapper">
    <div id="list" class="loginBox">
        <div class="heading cf">
            <h3>Location Suggestions</h3>
        </div>
        <div id="locations">
            <?php
            $i = 0;
            if (count($results) > 0) {
                echo "<table style='width:100%'>";
                foreach ($results as $data) {
                    echo "<tr id='disp" . $data->ID . "' class='location " . (($i % 2 == 1) ? "grayrow" : "") . "'>";
//            echo "<div id='disp" . $data->ID . "' class='location " . (($i % 2 == 1) ? "grayrow" : "") . "'>";
                    echo "<td>";
                    echo "<div id='val" . $data->ID . "'class='locationdet'>";
                    echo $data->LOC_NAME;
                    echo "</div>";
                    echo "</td>";
                    echo "<td>";
                    echo "<div class='locationdet'>";
                    echo "<a href='" . $data->ID . "' class='loc'>ADD TO</a>";
                    echo " &bull; ";
                    echo "<a href='" . $data->ID . "' class='loc'>NEW</a>";
                    echo " &bull; ";
                    echo "<a href='" . $data->ID . "' class='loc'>DELETE</a>";
                    echo "</div>";
                    echo "</td>";
//            echo "</div>";
                    echo "</tr>";
                    $i++;
                }
                echo "</table>";
            }
            ?>
            <p><?php echo $links; ?></p>
            <p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds</p>
        </div>
    </div>
</div>
<div id="locationlist" title="Add To">
    <label for="sameloc">Same as: </label>
    <input id="sameloc" class="searchexisting" size="50"/>
    <input id="hiddenid" type='hidden'/>
    <input id="hiddenvalue" type='hidden'/>
</div>
<div id="latlongdialog" title="Location">
    <label for="lat">Latitude: </label>
    <input id="lat" />
    <label for="long">Longitude</label>
    <input id="long"/>
    <input id="latlongid" type='hidden'/>
    <input id="latlongval" type='hidden'/>
</div>
<script type="text/javascript">
    $(document).ready(function() {
        $('#latlongdialog').dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                save: function() {
                    var id = $('#latlongid').val();
                    var text = $('#latlongval').val();
                    var lat = $('#lat').val();
                    var long = $('#long').val();
                    $.ajax({
                        type: "POST",
                        url: "<?php echo base_url() ?>index.php/findaway/addnewlocsuggestion/",
                        data: {id: id, value: text, lat: lat, long: long},
                        success: function(id) {
                            alert('Successfully Added!');
                            $('#disp' + id).remove();
                            $('#latlongdialog').dialog("close");
                        },
                        error: function(result) {
                            alert('Error');
                            $('#latlongdialog').dialog("close");
                        }
                    });
                },
                cancel: function() {
                    $('#latlongdialog').dialog("close");
                }
            }
        });
        $('#locationlist').dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                save: function() {
                    var existingname = $('#sameloc').val();
                    var id = $('#hiddenid').val();
                    var value = $('#hiddenvalue').val();
                    $.ajax({
                        type: "POST",
                        url: "findaway/addnewlocvariant/",
                        data: {
                            existingname: existingname,
                            id: id,
                            value: value
                        },
                        success: function(id) {
                            $('#disp' + id).remove();
                            alert('Successfully Added!');
                            $('#locationlist').dialog("close");
                        },
                        error: function(id) {
                            alert('Failed adding!');
                            $('#locationlist').dialog("close");
                        }
                    });
                },
                cancel: function() {
                    $('#locationlist').dialog("close");
                }
            }
        });
    });
    $(document).on('click', '.loc', function(e) {
        e.preventDefault();
        var func = $(this).text();
        var id = $(this).attr('href');
        var text = $('#val' + id).text();
        if (func == 'ADD TO') {
            $('#hiddenvalue').val(text);
            $('#hiddenid').val(id);
            $('#locationlist').dialog("open");
        } else if (func == "DELETE") {
            $.ajax({
                type: "POST",
                url: "<?php echo base_url() ?>index.php/findaway/dellocsuggestion/",
                data: {id: id},
                success: function(id) {
                    $('#disp' + id).remove();
                },
                error: function(result) {
                }
            });
        } else if (func == "NEW") {
            $('#latlongval').val(text);
            $('#latlongid').val(id);
            $('#latlongdialog').dialog("open");
        }
    });
</script>