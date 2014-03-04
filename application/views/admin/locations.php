<div id="locations">
    <?php
    foreach ($results as $data) {
        echo "<div id='disp" . $data->ID . "' class='location'>";
        echo "<div class='locationdet'>";
        echo $data->LOC_NAME;
        echo "</div>";
        echo "<div class='locationdet'>";
        echo "<a href='" . $data->ID . "' class='loc'>ADD TO</a>";
        echo " &bull; ";
        echo "<a href='" . base_url() . "index.php/findaway/dellocsuggestion/" . $data->ID . "/' class='loc'>DELETE</a>";
        echo "</div>";
        echo "</div>";
    }
    ?>
    <p><?php echo $links; ?></p>
    <p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds</p>
</div>
<div id="location list" title="Add To">
    <select>
       
    </select>
</div>
<script type="text/javascript">
    $(document).ready(function(){
        $.ajax({
            type: "POST",
            url: "findaway/uniquelocation",
            data: {},
            success: function(result){
                
            }
        });
    });
    $(document).on('click', '.loc', function(e) {
        e.preventDefault();
        var func = $(this).text();
        var url = $(this).attr('href');
        if (func == 'ADD TO') {
            
        } else if (func == "DELETE") {
            $.ajax({
                type: "POST",
                url: url,
                data: {},
                success: function(id) {
                    $('#disp' + id).remove();
                },
                error: function(result) {
                }
            });
        }
        $.ajax({
            type: "POST",
            url: url,
            data: {},
            success: function(id) {
                $('#disp' + id).html(access);
            },
            error: function(result) {
            }
        });
    });
</script>