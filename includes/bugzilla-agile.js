function agileBacklog() {
    if(settings.agile_backlog) {
        var bugs = [];
        var components_data = [];
        var closed_statuses = ["RESO","VERI"];
        var closed_points = 0;
        var closed_stories = 0;
        var open_points = 0;
        var open_stories = 0;
        var assigned_points = 0;
        var assigned_stories = 0;

        $('td.bz_status_whiteboard_column').each(function(){
            var bug = {};
            bug.status = $.trim($(this).siblings('.bz_bug_status_column').text());
            bug.tags = $.trim($(this).text()).split(" ");
            bug.elements = [];

            for (var i=0, j=bug.tags.length; i<j; i++) {
                var tokens = bug.tags[i].split("=");
                bug.elements[tokens[0]] = tokens[1];
            }
            bug.points = 0;
            if (bug.elements.p && typeof(parseInt(bug.elements.p,0)) == "number") {
                bug.points = parseInt(bug.elements.p,0);
            }
            if ($.inArray(bug.status, closed_statuses) > -1){
                closed_stories++;
                closed_points += bug.points;
            } else {
                if ($.trim($(this).siblings('.bz_assigned_to_column').text()) == "nobody@mozilla.org") {
                    open_stories++;
                    open_points += bug.points;
                } else {
                    assigned_stories++;
                    assigned_points += bug.points;
                }
            }

            if (bug.elements.c && bug.elements.c !== "") {
                var component = {}, existing_component_idx = -1;
                for (i=0, j=components_data.length; i<j; i++) {
                    if (bug.elements.c == components_data[i].label) {
                        existing_component_idx = i;
                    }
                }
                if (existing_component_idx > -1) {
                    component = components_data[existing_component_idx];
                    component.data += bug.points;
                } else {
                    component.label = bug.elements.c;
                    component.data = bug.points;
                    components_data.push(component);
                }
            }

            bugs.push(bug);
        });
        $('table.bz_buglist').append('<tr><td colspan="99" align="right"><div><div id="pointsGraph" class="graph"></div><div id="componentsGraph" class="graph"></div><div>Open Stories: ' + open_stories + '<br/>Open points: ' + open_points + '<br/>Closed Stories: ' + closed_stories + '<br/>Closed points: ' + closed_points + '</div></div></td></tr>');
        var points_data = [
            {label:"Open", data:open_points, color: "rgb(237, 194, 64)"},
            {label:"Closed", data:closed_points, color: "rgb(77, 167, 77)"},
            {label:"Assigned", data:assigned_points, color: "rgb(175, 216, 248)"}
        ];
        $.plot($('#pointsGraph'), points_data, {series:{pie:{show:true}},legend:{show:false}});
        $.plot($('#componentsGraph'), components_data, {series:{pie:{show:true}},legend:{show:false}});
        console.log("Open Stories: " + open_stories);
        console.log("Open points: " + open_points);
        console.log("Closed Stories: " + closed_stories);
        console.log("Closed points: " + closed_points);
    }
}

registerPref('agile_backlog', 'Agile Backlog', agileBacklog);
