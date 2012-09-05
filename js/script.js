(function (window, document) {
  "use strict";

  var track = document.getElementById('track')
    , nodes
    ;

  track.play();

  /*
  track.addEventListener('timeupdate', function (e) {
    var tick = e.target.currentTime;
    document.getElementById("slider-value").innerHTML = Math.floor(tick);
  }, false);

  document.getElementById("slider").addEventListener("change", function (e) {
    var count = parseInt(e.target.value, 10)
      ;
    track.currentTime = count;
    track.play();
    document.getElementById("slider-value").innerHTML = count;
  });
  */

  function extractValue(str) {
    var res = parseFloat(str, 10);
    res = res || 0;
    return res;
  }

  function show(el, collapse) {
    if (collapse) { el.style.display = "block"; }
    window.setTimeout(function () {
      el.style.opacity = "1";
    }, 0);
  }

  function hide(el, collapse) {
    var die = el.getAttribute('data-die')
      , disp = 'none'
      ;
    el.style.opacity = "0";

    if (collapse) {
      window.setTimeout(function () {
        el.style.display = disp;
        if (die) {
          el.className += ' die';
        }
      }, 1000);
    }
  }

  function renderItem(node) {
    var start = extractValue(node.getAttribute('data-start'))
      , end = extractValue(node.getAttribute('data-end'))
      , collapse = node.getAttribute('data-collapse')
      , inFrame = false
      ;

    return function (e) {
      var tick = e.target.currentTime;

      if (tick > start && tick < end) {
        !inFrame && show(node, collapse);
        inFrame = true;
      } else if (inFrame === true) {
        hide(node, collapse);
        inFrame = false;
      }
    };
  }

  function showAll(node) {
    var nodes
      , i, ii
      ;

    nodes = document.querySelectorAll('[data-start]');

    show(track, true);
    for (i = 0, ii = nodes.length; i < ii; i++) {
      show(nodes[i], true);
    }
  }

  function fadeColor(node) {
    var start = extractValue(node.getAttribute('data-color-start'))
      , targets = document.querySelectorAll(node.getAttribute("data-target"))
      , cssProp = node.getAttribute("data-prop")
      , color = node.getAttribute("data-color-fade")
      , completed = false
      ;
    return function (e) {
      var i, ii
        , tick = e.target.currentTime
        ;

      if (tick > start && !completed) {
        completed = true;
        for (i = 0, ii = targets.length; i < ii; i++) {
          targets[i].style[cssProp] = color;
        }
      }
    };
  }

  function bindor(selector, fn) {
    var i, ii
      , count
      , nodes = document.querySelectorAll('[' + selector + ']')
      ;

    for (i = 0, ii = nodes.length; i < ii; i++) {
      track.addEventListener('timeupdate', fn(nodes[i]), false);
    }
  }

  function tween(start, end, fn) {
    var duration = end - start
      ;

    fn = fn || function (v) { return v; };

    return function (continuation, now) {
      var relativeNow = now - start
        , normalNow
        , res
        ;

      normalNow = duration === 0 ? -1 : relativeNow / duration;

      if (normalNow < 0) {
        res = 0;
      } else if (normalNow > 1) {
        res = 1;
      } else {
        res = fn(normalNow);
      }

      continuation(res);
    };
  }

  function sprintf(text) {
    var i = 1
      , args = arguments
      ;

    return text.replace(/%s/g, function (pattern) {
      return (i < args.length) ? args[i++] : "";
    });
  }


  function calcHsl(val) {
    var h, s, l;

    h = 360 - ((360 - 240) * val);
    s = 42 - ((42 - 20) * val);
    l = 28 - ((28 - 25) * val);

    return sprintf("hsl(%s, %s%, %s%)", h, s, l);
  }

  function updateBg() {
    var intermission = tween(179, 209);

    return function (e) {
      var t = e.target.currentTime;
      intermission(function (val) {
        document.body.style.background = calcHsl(val);

        if (val === 0) {
          document.body.style.color = '#bd9d9d';
        } else if (val === 1) {
          document.body.style.color = '#cbdad5';
        }
      }, t);
    };
  }

  track.addEventListener('timeupdate', updateBg(), false);

  bindor('data-start', renderItem);
  track.addEventListener('ended', showAll, false);
  track.addEventListener('play', function () {
    hide(track, true);
  }, false);
}(this, this.document));
