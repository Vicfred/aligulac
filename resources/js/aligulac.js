// Generated by CoffeeScript 1.7.1
var aligulacAutocompleteTemplates, getResults;

aligulacAutocompleteTemplates = function(obj) {
  var flag, name, race, team;
  if (!((obj.tag != null) || (obj.name != null) || (obj.fullname != null))) {
    return "<span class='autocomp-header'>" + autocomp_strings[obj.label] + "</span>";
  }
  switch (obj.type) {
    case 'player':
      obj.key = obj.tag + ' ' + obj.id;
      team = ((obj.teams != null) && obj.teams.length > 0 ? "<span class='autocomp-team pull-right'>" + obj.teams[0][0] + "</span>" : '');
      flag = (obj.country != null ? "<img src='" + (flags_dir + obj.country.toLowerCase()) + ".png' />" : '');
      race = "<img src='" + (races_dir + obj.race.toUpperCase()) + ".png' />";
      name = "<span>" + obj.tag + "</span>";
      return "<a>" + flag + race + name + team + "</a>";
    case 'team':
      obj.key = obj.name;
      return "<a>" + obj.name + "</a>";
    case 'event':
      obj.key = obj.fullname;
      return "<a>" + obj.fullname + "</a>";
  }
  return "<a>" + obj.value + "</a>";
};

getResults = function(term, restrict_to) {
  var deferred, url;
  if (restrict_to == null) {
    restrict_to = ['players', 'teams', 'events'];
  } else if (typeof restrict_to === 'string') {
    restrict_to = [restrict_to];
  }
  deferred = $.Deferred();
  url = '/search/json/';
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    data: {
      q: term,
      search_for: restrict_to.join(',')
    }
  }).success(function(ajaxData) {
    return deferred.resolve(ajaxData);
  });
  return deferred;
};

$(document).ready(function() {
  return $('#search_box').autocomplete({
    source: function(request, response) {
      return $.when(getResults(request.term)).then(function(result) {
        var eventresult, playerresult, prepare_response, teamresult;
        prepare_response = function(list, type, label) {
          var x, _i, _len;
          if ((list == null) || list.length === 0) {
            return [];
          }
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            x = list[_i];
            x.type = type;
          }
          return [
            {
              label: label
            }
          ].concat(list);
        };
        playerresult = prepare_response(result.players, 'player', 'Players');
        teamresult = prepare_response(result.teams, 'team', 'Teams');
        eventresult = prepare_response(result.events, 'event', 'Events');
        return response(playerresult.concat(teamresult.concat(eventresult)));
      });
    },
    minLength: 2,
    select: function(event, ui) {
      $('#search_box').val(ui.item.key);
      return false;
    },
    open: function() {
      return $('.ui-menu').width('auto');
    }
  }).data('ui-autocomplete')._renderItem = function(ul, item) {
    return $('<li></li>').append(aligulacAutocompleteTemplates(item)).appendTo(ul);
  };
});

$(document).ready(function() {
  var $idPalyersTextArea;
  $idPalyersTextArea = $("#id_players");
  $idPalyersTextArea.tagsInput({
    autocomplete_opt: {
      minLength: 2,
      select: function(event, ui) {
        $idPalyersTextArea.addTag(ui.item.key);
        $("#id_players_tag").focus();
        return false;
      },
      open: function() {
        return $('.ui-menu').width('auto');
      }
    },
    autocomplete_url: function(request, response) {
      return $.when(getResults(request.term, 'players')).then(function(result) {
        var p, _i, _len, _ref;
        if (result.players != null) {
          _ref = result.players;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            p.type = 'player';
          }
          return response(result.players);
        }
      });
    },
    defaultText: 'add a player',
    delimiter: '\n',
    formatAutocomplete: aligulacAutocompleteTemplates
  });
  return $("#id_players_addTag").keydown(function(event) {
    if (event.which === 13 && $("#id_players_tag").val() === "") {
      return $(this).closest("form").submit();
    }
  });
});
// Generated by CoffeeScript 1.7.1
var toggle_block;

toggle_block = function(id) {
  $('#lm-' + id).toggle();
  return $('#lma-' + id).html($('#lma-' + id).html() === autocomp_strings['hide'] ? autocomp_strings['show'] : autocomp_strings['hide']);
};
// Generated by CoffeeScript 1.7.1
var gen_short;

gen_short = function(path) {
  return $.get("/m/new/?url=" + encodeURIComponent(path), function(data) {
    $("#gen_short").hide();
    $("#disp_short").html("<a href=\"/m/" + data + "/\">/m/" + data + "</a>");
    return $("#disp_short").show();
  });
};
// Generated by CoffeeScript 1.7.1
var mobile_regex, toggle_navbar_method;

mobile_regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i;

toggle_navbar_method = function() {
  if (mobile_regex.test(navigator.userAgent) || $(window).width() <= 768) {
    return $('.navbar .dropdown').off('mouseover').off('mouseout');
  } else {
    return $('.navbar .dropdown').on('mouseover', function() {
      return $('.dropdown-toggle', this).trigger('click');
    }).on('mouseout', function() {
      return $('.dropdown-toggle', this).trigger('click').blur();
    });
  }
};

toggle_navbar_method();
