// Allow clicking hours in a Harvest detailed report to jump to the timesheet for that date and staffperson
(function() {

    $('td.dt-hours.number').each(function() {
        var user;
        var date;
        var $td = $(this);
        var $tr = $td.closest('tr');
        var $group_tr;
        var $trs = $tr.siblings();
        var i = $tr.index() - 1;
        while (i >= 0 && !$group_tr) {
            if ($trs.eq(i).is('tr.dt-group')) {
                $group_tr = $trs.eq(i);
            }
            i -= 1;
        }
        if ($tr.find('td.dt-date').length) {
            date = $tr.find('td.dt-date').html();
        }
        else {
            date = $group_tr.find('td').first().html();
        }
        if ($tr.find('td.dt-staff').length) {
            user = $tr.find('td.dt-staff').html();
        }
        else {
            user = $group_tr.find('td').first().html();
        }
        var link;
        if (date) {
            var mdy = $.trim(date).split('/');
            link = '/time/day/' + mdy[2] + '/' + mdy[0] + '/' + mdy[1];
            if (user) {
                var user_id;
                $('#filter_users option').each(function() {
                    var $option = $(this);
                    if ($.trim($option.html()) == $.trim(user)) {
                        user_id = $option.val();
                        return false;
                    }
                });
                if (user_id) link += '/' + user_id;
            }
        }
        if (link) {
            $td.wrapInner('<a href="' + link + '" />')
        }
    });


}).call(this);
