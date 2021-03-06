/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ajaxComments(from, to, start, end) {
    var loggedin = false;
    $.ajax({
        type: "POST",
        url: "findaway/suggestions/",
        data: {from: from, to: to, start: start, end: end},
        success: function(result) {
            try {
//                    json format
//                    $data[] = array('ID','USERNAME','DATE_CREATED','TITLE','RATING','CONTENT','COMMENTS')     
                var jsonData = JSON.parse(result);
                
                var flagJSON = jsonData['flag'];
                var flag = flagJSON['FLAG'];
                
                if(flag == 1){
                    var output = "<div id='accordion-resizer' class='ui-widget-content'>" +
                            "<div id='accordion'>";
                    var stat = jsonData['status'];
                    loggedin = stat['LOGGED_IN'];
                    var pages = jsonData['paging'];
                    var paging = "<span class='pageofstyle'>" + pages['pageof']['VALUE'] + " </span> &bull;";
                    for (var i in pages){
                        if(i != 'pageof'){
                            var value = pages[i]['VALUE'];
                            var id = pages[i]['ID'];
                            if(id != -1){
                                //url string
                                paging += "<span class='page' onclick=\"" + value + "\" style='cursor:pointer'><u>" + id + "</u></span>"
                            }else{
                                paging += "<span class='pages'>" + value + "</span>";
                            }
                        }
                    }
                    var firstcommset = false;
                    for (var i in jsonData) {
                        if (i != 'status' && i != 'paging' && i != 'flag' && i != 'suggest' && i != 'modes') {
                            var row = jsonData[i];

                            output += "<h3 class='title'><a href='" + row['ID'] + "' class='suggestion'>" + row['TITLE'] + "</a></h3>" +
                                    "<div class='titlebot'>" +
                                    "<div class='createdby sugdet'>Created by: <strong><i>" + row['USERNAME'] + "</i></strong></div>" +
//                                    "<div id='rating" + row['ID'] + "' class='rating'>Ratings: " + row['RATING'] + "</div>" +
                                    "<div class='createddate sugdet'>Date Created: " + row['DATE_CREATED'] + "</div>"+
                                    "<div id='rating" + row['ID'] + "' class='rating'></div>";

                            var commentdiv = "";
                            if (!firstcommset) {
                                getComments(row['ID']);
                                getRoute(row['ID']);
                                commentdiv = "<div id='" + row['ID'] + "' class='commentlist" + row['ID'] + " activecomment'>";
                                firstcommset = true;
                            } else {
                                commentdiv = "<div id='" + row['ID'] + "' class='commentlist" + row['ID'] + "' style='display:none;'>";
                            }
                            commentdiv += "</div>";
                            output += commentdiv;
                            //star ratings

                            output += "</div>";
                        } 
                    }
                    output += "</div></div>";
                    
                    var suggestJSON1 = jsonData['suggest'];
                    var cansuggest1 = suggestJSON1['SUGGEST'];
                    //portion for suggest
//                    alert('here');
                    if(cansuggest1 && loggedin){
//                        alert("Give your own suggestion!");
                        var modesJSON1 = jsonData['modes'];
                        var inputtitlestring1 = buildInputTitle(-1);
                        var addroutestring1 = buildAddRouteString(modesJSON1);
                        var routeeditstring1 = buildRouteDetailString('routeeditdetails','');
                        var suggestString1 = "<div class='suggrouteauth'><a class='editroute button' href='#'>Suggest</a></div>";
                        $('#suggauth').html(suggestString1);
                        $('#routeEdit').html(inputtitlestring1 + routeeditstring1 + addroutestring1);
                        initEditRouteDialog();
                        initEditButtons();
                    }else{
                        var suggestString1 = "<div class='suggrouteauth'></div>";
                        $('#suggauth').html(suggestString1);
                    }
                    $('#SearchOutput').html(output);
                    $('#pagingOutput').html(paging);
                    //portion to set rating
                    for (var i in jsonData) {
                        if (i != 'status' && i != 'paging' && i != 'flag' && i != 'suggest' && i != 'modes') {
                            var row = jsonData[i];
                            $('#rating' + row['ID']).rating('findaway/rating/' + row['ID'] + '/', {maxvalue:5, curvalue:row['RATING']});
                        }
                    }
                }else if(flag == 2){
                    var outputJSON = jsonData['output'];
                    var outputString = "<span class='noresult'>" + outputJSON['OUTPUT'] + "</span>";
                    var suggestJSON = jsonData['suggest'];
                    var cansuggest = suggestJSON['SUGGEST'];
                    var suggestString = "";
                    var stat = jsonData['status'];
                    loggedin = stat['LOGGED_IN'];
                    if(cansuggest && loggedin){
                        var modesJSON = jsonData['modes'];
                        var inputtitlestring = buildInputTitle(-1);
                        var addroutestring = buildAddRouteString(modesJSON);
                        var routeeditstring = buildRouteDetailString('routeeditdetails','');
                        suggestString = "<div class='editrouteauth'><a class='editroute button' href='#'>Suggest</a></div>";
                    }
                    $('#SearchOutput').html(outputString);
                    $('#routeEdit').html(inputtitlestring + routeeditstring + addroutestring);
                    $('#pagingOutput').html('');
                    $('#routeOutput').html('');
                    $('#editauth').html(suggestString);
                    $('#routeEditTemplate').html('');
                    initEditRouteDialog();
                    initEditButtons();
                }else if (flag == 3){
                    var msgString = "";
                    for (var i in jsonData) {
                        var msg = "";
                        if(i == 'from_not_in_db'){
                            if(jsonData[i]['FROM_NOT_IN_DB']){
                                var from = $('#from').val();
                                msg = from + " not yet in our database. Send as suggestion? <a id='nofrom' href='search/suggest_location/' class='newlocsuggestion'>Yes</a>";
                                msgString += buildMessage('INFO',msg);
                            }
                        }else if(i == 'to_not_in_db'){
                            if(jsonData[i]['TO_NOT_IN_DB']){
                                var to = $('#to').val();
                                msg = to + " not yet in our database. Send as suggestion? <a id='noto' href='search/suggest_location/' class='newlocsuggestion'>Yes</a>";
                                msgString += buildMessage('INFO',msg);
                            }
                        }else if(i == 'route_combi_not_in_db'){
                            msg = "Route combination not yet available. Send as a suggestion? <a href='search/newroute/" +jsonData[i]['FROM'] +"/" + jsonData[i]['TO'] + "' class='newcombi'>Yes</a>";
                            msgString += buildMessage('INFO',msg);
                        }
                    }
                    $('#routeOutput').html('');
                    $('#editauth').html('');
                    $('#pagingOutput').html('');
                    $('#routeEditTemplate').html('');
                    $('#SearchOutput').html(msgString);
                    $('#outputGmap').hide();
                }
            } catch (err) {
                $('#SearchOutput').html(result);
                $('#pagingOutput').html('');
                $('#routeOutput').html('');
                $('#editauth').html('');
                $('#routeEditTemplate').html('');
                $('#outputGmap').hide();
            }
        }
    }).done(function() {
        $("a.suggestion").on('click', function(event) {
            event.preventDefault();
            $('.activecomment').slideUp();
            $('.activecomment').html('');
            $('.activecomment').removeClass('activecomment');
            var id = $(this).attr('href');
            $('#' + id).addClass('activecomment');
            $('#' + id).hide();
            getComments(id);
            getRoute(id)
        });
    });
}

function buildMessage(msgclass,msg){
    if(msgclass == 'ERROR'){
        msgclass = 'ui-state-error';
    }else if(msgclass = 'INFO'){
        msgclass = 'ui-state-highlight';
    }
    var message = "<div class='ui-widget'>" + 
        "<div class='" + msgclass + " ui-corner-all' style='padding: 0 .7em;'>" +  
        "<p>" +
//        "<span class='ui-icon ui-icon-alert' style='float: left; margin-right: .3em;'></span>" +
        msg + 
        "</p>" +
        "</div>" +
        "</div>";
    return message;
}

function getAddRoute(travelmodes) {
    var addroutestring = "";
    try {
        var modes = JSON.parse(travelmodes);
        var modeoptions = "";
        for (var i in modes) {
            var mode = modes[i];
            modeoptions += "<option value='" + mode['ID'] + "_" + mode['COLOR'] + "'>" + mode['NAME'] + "</option>";
        }
        addroutestring += "<div class='addroutediv'><div class='addroutelabeldiv'><label class='addroutelabel' for='newmode'>Mode of Trans:</label></div>";
        addroutestring += "<select id='newmode'>" + modeoptions + "</select></div>";
        addroutestring += "<div class='addroutediv'><div class='addroutelabeldiv'><label class='addroutelabel' for='newmoderemark'>Transportation Description:</label></div>";
        addroutestring += "<textarea id='newmoderemark' placeholder='Write description for the mode of transportation' value=''/></div>";
        addroutestring += "<div class='addroutediv'><div class='addroutelabeldiv'><label class='addroutelabel' for='newtravelremark'>Travel Description:</label></div>";
        addroutestring += "<textarea id='newtravelremark' placeholder='Write description during travel or where to alight' value=''/></div>";
        addroutestring += "<div class='addroutediv'><div class='addroutelabeldiv'><label class='addroutelabel' for='newfare'>Estimated Fare:</label></div>";
        addroutestring += "<input type='text' id='newfare' value=''/></div>";
        addroutestring += "<div class='addroutediv'><div class='addroutelabeldiv'><label class='addroutelabel' for='neweta'>Estimated Travel Time:</label></div>";
        addroutestring += "<input type='text' id='neweta' value=''/></div>";
        addroutestring += "<span class='newroute'>Add</span>";
    } catch (err) {
        alert(err);
    }
    return addroutestring;
}

function buildRouteDetail(mode_name, mode_id,mode_color, mode_desc, travel_desc, fare, eta, editmode) {
    var tempstring = "";
    tempstring += "<div class='transpomode' style='color:" + mode_color + "' modeid='" + mode_id + "'>" +
            mode_name + "</div>";
    tempstring += "<div class='transpomode_desc'>" +
            mode_desc + "</div>";
    tempstring += "<div class='travel_desc'>" +
            travel_desc + "</div>";
    tempstring += "<div class='fare'>" +
            fare + "</div>";
    tempstring += "<div class='ETA'>" +
            eta + "</div>";
    if (editmode) {
        tempstring += "<div class='moveupdown'>";
        tempstring += "<div class='moveup'><span class='moveupbtn'>up</span></div>";
        tempstring += "<div class='movedown'><span class='movedownbtn'>down</span></div>";
        tempstring += "</div>";
        tempstring += "<div class='removebtn'><span class='removeroutebtn'>delete</span></div>";
    }
    return tempstring;
}
function getRoute(sug_id) {
    $.ajax({
        type: "POST",
        url: "findaway/route/",
        data: {sug_id: sug_id},
        success: function(result) {
            var routestring = "";
            var routeeditstring = "";
            var inputtitlestring = "";
            var owner = false;
            var addRouteString = "";
            try {
                var routes = JSON.parse(result);
                owner = routes['SUG_OWNER'];
                for (var i in routes) {
                    var route = routes[i];
                    if (i != 'SUG_OWNER' && i != 'MODES') {
                        var tempstring = buildRouteDetail(route['TRANSPOMODE_NAME'],route['TRANSPOMODE_ID'],
                                route['TRANSPOMODE_COLOR'], route['TRANSPOMODE_DESC'], route['TRAVEL_DESC'],
                                route['FARE'], route['ETA'], false);
                        if (owner) {
                            routeeditstring += "<div class='routedetail'>";
                            '    '
                            routeeditstring += buildRouteDetail(route['TRANSPOMODE_NAME'],route['TRANSPOMODE_ID'],
                                    route['TRANSPOMODE_COLOR'], route['TRANSPOMODE_DESC'], route['TRAVEL_DESC'],
                                    route['FARE'], route['ETA'], true);
                            routeeditstring += "</div>";
                        }
                        routestring += "<div class='routedetail'>";
                        routestring += tempstring;
                        routestring += "</div>";
                    }
                }
                inputtitlestring = buildInputTitle(sug_id);
                addRouteString = buildAddRouteString(routes['MODES']);
            } catch (err) {
            }
//            var from = $('#from').val();
//            var to = $('#to').val();
//            routestring = "<div class='routedetails'>" + routestring + "</div><div class='fromto'> To: " + to + "</div>";
//            routestring = "<div class='fromto'> From: " + from + "</div>" + routestring;
            routestring = buildRouteDetailString('routedetails',routestring);

//            routeeditstring = "<div class='routeeditdetails'>" + routeeditstring + "</div><div class='fromto'> To: " + to + "</div>";
//            routeeditstring = "<div class='fromto'> From: " + from + "</div>" + routeeditstring;
            routeeditstring = buildRouteDetailString('routeeditdetails',routeeditstring);

            var editroute = "";
            if (owner) {
                editroute = "<div id='editrouteauth'><a class='editroute button' href='#'>Edit</a></div>";
                $('#routeEdit').html(inputtitlestring + routeeditstring + addRouteString);
                $('#routeEditTemplate').html(routeeditstring);
            } else {
                editroute = "<div id='editrouteauth'></div>";
                $('#routeEdit').html('');
                $('#routeEditTemplate').html('');
            }
            $('#routeOutput').html(routestring);
            $('#editauth').html(editroute);
        }
    }).done(function() {
        initEditButtons();
        initEditRouteDialog();
    });
}
function initEditRouteDialog(){
    $("#routeEdit").dialog({
            width: 770,
            autoOpen: false,
            modal: true,
            buttons: {
                save: function() {  
                        var newroutes = [];
                        var sug_id = $('.routetitle').attr('id');
                        var newtitle = $('.routetitle').val();
                    $('#routeEdit .routeeditdetails .routedetail').each(function(index,element){
                        var elementclass = $(element).attr('class');
                        var modeid = "";
                        var modedesc = "";
                        var traveldesc = "";
                        var fare = "";
                        var eta = "";
                        $(element).children().each(function(index,child){
//                            alert("child attr " + $(child).attr);
                            if($(child).attr('class') == 'transpomode'){
                                modeid = $(child).attr('modeid');
                            }else if($(child).attr('class') == 'transpomode_desc'){
                                modedesc = $(child).html();
                            }else if($(child).attr('class') == 'travel_desc'){
                                traveldesc = $(child).html();
                            }else if($(child).attr('class') == 'fare'){
                                fare = $(child).html();
                            }else if($(child).attr('class') == 'ETA'){
                                eta = $(child).html();
                            } 
                            
                        });
                        
                        var newroute = {};
                        newroute.modeid = modeid;
                        newroute.modedesc = modedesc;
                        newroute.traveldesc = traveldesc;
                        newroute.fare = fare;
                        newroute.eta = eta;
//                        newroutes.push(JSON.stringify(newroute));
                        newroutes.push(newroute);
//                        alert(modeid + " " + modedesc + " " + traveldesc + " " + fare + " " + eta);
                    });
                    updateRoute(newroutes,sug_id,newtitle);
                    $(this).dialog("close");
                },
                cancel: function() {
                    var newtitleinput = "<div id='routetitlediv'>" + $('#routetitlediv').html() + "</div>";
                    var newroutetemplate = "<div id='newroutediv' class='newroutebot'>" + $('#newroutediv').html() + "</div>";
                    $('#routeEdit').html(newtitleinput + $('#routeEditTemplate').html() + newroutetemplate);
                    $(this).dialog("close");
                }
            }
        });
}
function buildInputTitle(sug_id){
    var inputval = "";
    if(sug_id != -1){
        $('a.suggestion').each(function(index,element){
            if($(element).attr('href') == sug_id){
                inputval = $(element).text();
            }
        });
    }
    return "<div id='routetitlediv'><span class='routetitleclass'>Title:</span><input id='" + sug_id + "' class='routetitle' type='text' value='" + inputval + "'/></div>";
}
function buildRouteDetailString(classname,routestring){
    var from = $('#from').val();
    var to = $('#to').val();
    routestring = "<div class='" + classname + " routebot'>" + routestring + "</div><div class='fromto botbot'> To: " + to + "</div>";
    return routestring = "<div class='fromto titleroute'> From: " + from + "</div>" + routestring;
}
function buildAddRouteString(modes){
    return "<div id='newroutediv' class='newroutebot'>" + getAddRoute(modes) + "</div>";
}
function updateRoute(newroutes,sug_id,newtitle){
//    var sug_id = $('.activecomment').attr('id');
    var from = $('#from').val();
    var to = $('#to').val();
    $.ajax({
        type: "POST",
        url: "findaway/update/",
        data: {sug_id: sug_id,from: from,to: to, newroutes: newroutes,newtitle: newtitle},
        success: function(result) {
            if(result == "Success"){
                //update template
                $('#routeOutput .routedetails').html('');                     
                $('#routeEditTemplate .routedetails').html('');
                $('#routeEdit .routeeditdetails .routedetail').each(function(index,element){
                    var routedetail = $(element).html();  
                    routedetail = "<div class='routedetail'>" + routedetail + "</div>";
                    $('#routeOutput .routedetails').append(routedetail);
                    $('#routeEditTemplate .routedetails').append(routedetail);
                    initEditButtons();
                });
                $('#routeOutput .routedetails').children().each(function(index,element){
                    $(element).children().each(function(index2,child){
                        if($(child).attr('class') == 'moveupdown' || $(child).attr('class') == 'removebtn'){
                            $(child).remove();
                        }
                    });
                });
                $('#routeEditTemplate .routedetails').children().each(function(index,element){
                    $(element).children().each(function(index2,child){
                        if($(child).attr('class') == 'moveupdown' || $(child).attr('class') == 'removebtn'){
                            $(child).remove();
                        }
                    });
                });
                if(sug_id != -1){
                    $('a.suggestion').each(function(index,element){
                        if($(element).attr('href') == sug_id){
                            $(element).text(newtitle);
                        }
                    });
                }else{
                    var from = $("#from").val();
                    var to = $("#to").val();
                    ajaxComments(from, to, 0, 4);
                }
            }else{
                //restore edit dialog
                var inputtitlediv = "<div id='routetitlediv'>" + $('#routetitlediv').html() + "</div>";
                var newroutetemplate = "<div id='newroutediv'>" + $('#newroutediv').html() + "</div>";
                $('#routeEdit').html(inputtitlediv + $('#routeEditTemplate').html() + newroutetemplate);
            }
        },
        error: function(result){
            //restore edit dialog
            var inputtitlediv = "<div id='routetitlediv'>" + $('#routetitlediv').html() + "</div>";
            var newroutetemplate = "<div id='newroutediv'>" + $('#newroutediv').html() + "</div>";
            $('#routeEdit').html(inputtitlediv + $('#routeEditTemplate').html() + newroutetemplate);
            alert("Error in updating routes");
        }
    });
}

function initEditButtons() {
    $(".newroute").button({
        icons: {
            primary: "ui-icon-circle-plus",
        },
        text: true
    });
    $(".moveupbtn").button({
        icons: {
            primary: "ui-icon-carat-1-n",
        },
        text: false
    });
    $(".movedownbtn").button({
        icons: {
            primary: "ui-icon-carat-1-s",
        },
        text: false
    });
    $(".removeroutebtn").button({
        icons: {
            primary: "ui-icon-close",
        },
        text: false
    });
}

function getComments(sug_id) {
    $.ajax({
        type: "POST",
        url: "findaway/comments/",
        data: {SUG_ID: sug_id},
        success: function(result) {
            var commentstring = "<p>Comments:</p><div id='existingcomments'>";
            try {
                var comments = JSON.parse(result);
                for (var j in comments) {
                    if (j != 'status') {
//                        $commentlist[] = array('USERNAME','DATE_CREATED','CONTENT');
                        var comment = comments[j];
                        commentstring += "<p class='comment_cont'>" + comment['CONTENT'];
                        +"</p><br/>";
                        commentstring += "<span class='comment_uname'> - " + comment['USERNAME'] + "</span>";
                        commentstring += "<span class='comment_dateposted'> [" + comment['DATE_CREATED'] + "]</span>";
                    }
                }
                commentstring += "</div>";
                if (comments['status']['LOGGED_IN']) {
                    commentstring += "<textarea class='text-holder newcomment' placeholder='Write a comment..' ></textarea><div id='charleft' class='newcomment></div>";
                } else {
                    commentstring += "<p>No you can't post a comment. <a href='user/'>Login</a> first</p>";
                }
            } catch (err) {
                commentstring += "</div>";
                if (comments['status']['LOGGED_IN']) {
                    commentstring += "<textarea class='text-holder newcomment' placeholder='Write a comment..' ></textarea><div id='charleft' class='newcomment'></div>";
                } else {
                    commentstring += "<p>No you can't post a comment. <a href='user/'>Login</a> first</p>";
                }
            }
            $('#' + sug_id).html(commentstring);
            $('#' + sug_id).slideDown();
            if (comments['status']['LOGGED_IN']) {
                $(".newcomment").limiter(100, $('#charleft'));
            }
        }
    });

}
function showMap(from,to){
    $.ajax({
        type: "POST",
        url: "maps/latlong",
        data: {from:from,to:to},
        success: function(result){
            var jsonData = JSON.parse(result);
            var fromLoc = jsonData['from'];
            var toLoc = jsonData['to'];
            $('#outputGmap').show();
            try{
            initialize('outputGmap',from,fromLoc[0]['LAT'], fromLoc[0]['LONG'], to,toLoc[0]['LAT'],toLoc[0]['LONG']);
            }catch(err){
                $('#outputGmap').hide();
            }
        },
        error: function(result){
            $('#outputGmap').hide();
            alert("Error encountered showing map.");
        }
    });
}
$(function() {
    function split(val) {
        return val.split(/,\s*/);
//        return val;
    }
    function extractLast(term) {
        return split(term).pop();
    }
    $(".search").bind("keydown", function(event) {
        if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).data("ui-autocomplete").menu.active) {
            event.preventDefault();
        }
    }).autocomplete({
        source: function(request, response) {
            $.getJSON("search/", {
                term: extractLast(request.term)
            }, response);
        },
        search: function() {
            if (this.value.length < 2) {
                return false;
            }
        },
        focus: function() {
            return false;
        },
        messages: {
            noResults: '',
            results: function() {
            }
        }
    });
    $(".searchexisting").bind("keydown", function(event) {
        if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).data("ui-autocomplete").menu.active) {
            event.preventDefault();
        }
    }).autocomplete({
        source: function(request, response) {
            $.getJSON("../../search/", {
                term: extractLast(request.term)
            }, response);
        },
        search: function() {
            if (this.value.length < 2) {
                return false;
            }
        },
        focus: function() {
            return false;
        },
        messages: {
            noResults: '',
            results: function() {
            }
        }
    });

    $("#FindRoute").click(function() {
        var from = $("#from").val();
        var to = $("#to").val();
        if(from == '' || to == ''){
            alert("Some fields missing.");
        }else{
        ajaxComments(from, to, 0, 4);
        showMap(from,to);
        }
    });
    $("#showMap").click(function() {
        var from = $("#from").val();
        var to = $("#to").val();
        showMap(from,to);
    });
    $(document).on('click', '.movedownbtn', function(event) {
        var source = $(this).parent().parent().parent();
        var nextElement = source.next();
        var sourcehtml = source.html();
        if (nextElement.html()) {
            nextElement.after("<div class='routedetail'>" + sourcehtml + "</div>");
            source.remove();
        } else {
            alert('This is the last element already!');
        }
    });
    $(document).on('click', '.moveupbtn', function(event) {
        var source = $(this).parent().parent().parent();
        var previousElement = source.prev();
        var sourcehtml = source.html();
        if (previousElement.html()) {
            previousElement.before("<div class='routedetail'>" + sourcehtml + "</div>");
            source.remove();
        } else {
            alert('This is the first element already!');
        }
//                alert($(this).parent().parent().parent().attr('class'));
//                var content = $(this).parent().parent().parent().prev().html();
    });
    $(document).on('click', '.removeroutebtn', function(event) {
        $(this).parent().parent().remove();
    });
    $(document).on('click','a.editroute',function(event){
        event.preventDefault();
        $("#routeEdit").dialog("open");
    }); 
    $(document).on('click', '.newroute', function(event) { 
        var newmodearr = $('#newmode').val().split("_");
        var newmode = $('#newmode :selected').text();
        var newmoderemark = $('#newmoderemark').val();
        var newtravelremark = $('#newtravelremark').val();
        var newfare = $('#newfare').val();
        var neweta = $('#neweta').val();

        var newroutedetail = buildRouteDetail(newmode, newmodearr[0],newmodearr[1], newmoderemark,
                newtravelremark, newfare, neweta, true);

        var newroutedetaildiv = "<div class='routedetail'>" + newroutedetail + "</div>";

        $('#newroutediv').prev().prev().append(newroutedetaildiv);
        initEditButtons();
    });
    $(document).on('click','.newlocsuggestion',function(event){
        event.preventDefault();
        var url = $(this).attr('href');
        var id = $(this).attr('id');
        var val = "";
        if(id == 'nofrom'){
            val = $('#from').val();
        }else if(id == 'noto'){
            val = $('#to').val();
        }
        $.ajax({
            type: "POST",
            url: url,
            data: {val: val},
            success: function(result){
                alert('SUCCESS!');
            },
            error: function(result){
                alert('FAILED!');
            }
        });
    });
    $(document).on('click','.newcombi',function(event){
        event.preventDefault();
        var url = $(this).attr('href');
        $.ajax({
            type: "POST",
            url: url,
            data: {},
            success: function(result){
                alert('SUCCESS!');
            },
            error: function(result){
                alert('FAILED!');
            }
        });
    });
    $(document).on('click','.test',function(e){
        var x = $('#long').val();
        var y = $('#lat').val();
//        initialize('outputGmap',14.535067000000,120.982153000000,14.560833000000,120.988333000000);
    });
    $(document).on('keypress', '.newcomment', function(e) {
//        alert(e.which);
        if (e.which === 13) {
            var msg = $(this).val();
            var sug_id = $('.activecomment').attr('id');
            $.ajax({
                url: 'post/comment/',
                type: 'POST',
                data: {sug_id: sug_id, msg: msg},
                success: function(data) {
                    $('.newcomment').val('');
                    $('.newcomment').css('height', '14px');
                    var commentstring = "";
                    try {
                        var comments = JSON.parse(data);
                        for (var j in comments) {
                            var comment = comments[j];
                            commentstring += "<p class='comment_cont'>" + comment['CONTENT'];
                            +"</p><br/>";
                            commentstring += "<span class='comment_uname'> - " + comment['USERNAME'] + "</span>";
                            commentstring += "<span class='comment_dateposted'> [" + comment['DATE_CREATED'] + "]</span>";
                        }
                    } catch (err) {

                    }
                    $('#existingcomments').append(commentstring);
                }
            });
        }
    });
//    $(document).on('change',':radio',function(e){
//        alert($(this).parent().attr('id'));
//         $('.choice').text( this.value + ' stars' );
//    });
});

(function($) {
    $.fn.extend({
        limiter: function(limit, elem) {
            $(this).on("keyup focus", function() {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html(limit - chars);
            }
            setCount($(this)[0], elem);
        }
    });
})(jQuery);