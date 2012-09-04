(function (window, document) {
  "use strict";

  var track = document.getElementById('track')
    , nodes
    ;

  track.play();

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

  bindor('data-start', renderItem);
  bindor('data-color-fade', fadeColor);
  track.addEventListener('ended', showAll, false);
}(this, this.document));
