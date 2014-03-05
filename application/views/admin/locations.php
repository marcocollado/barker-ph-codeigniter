<div id="locations">
    <?php
    $i = 0;
    if (count($results)>0) {
        foreach ($results as $data) {
            echo "<div id='disp" . $data->ID . "' class='location " . (($i % 2 == 1) ? "grayrow" : "") . "'>";
            echo "<div id='val" . $data->ID . "'class='locationdet'>";
            echo $data->LOC_NAME;
            echo "</div>";
            echo "<div class='locationdet'>";
            echo "<a href='" . $data->ID . "' class='loc'>ADD TO</a>";
            echo " &bull; ";
            echo "<a href='" . $data->ID . "' class='loc'>NEW</a>";
            echo " &bull; ";
            echo "<a href='" . $data->ID . "' class='loc'>DELETE</a>";
            echo "</div>";
            echo "</div>";
            $i++;
        }
    }
    ?>
    <p><?php echo $links; ?></p>
    <p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds</p>
</div>
<div id="locationlist" title="Add To">
    <label for="sameloc">Same as: </label>
    <input id="sameloc" class="searchexisting" size="50"/>
    <input id="hiddenid" type='hidden'/>
    <input id="hiddenvalue" type='hidden'/>
</div>
<script type="text/javascript">
    $(document).ready(function() {
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
                data: {id:id},
                success: function(id) {
                    $('#disp' + id).remove();
                },
                error: function(result) {
                }
            });
        } else if (func == "NEW") {
            $.ajax({
                type: "POST",
                url: "<?php echo base_url() ?>index.php/findaway/addnewlocsuggestion/",
                data: {id:id,value:text},
                success: function(id) {
                    $('#disp' + id).remove();
                },
                error: function(result) {
                }
            });
        }
    });
</script>