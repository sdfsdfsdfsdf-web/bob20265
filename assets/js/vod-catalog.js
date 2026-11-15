(function () {
  var grid = document.getElementById('mediaGrid');
  if (!grid) return;

  var type   = grid.getAttribute('data-vod-type');
  var src    = grid.getAttribute('data-vod-src');
  var input  = document.getElementById('vodSearch');
  var count  = document.getElementById('vodCount');
  var page   = 1;
  var PER    = 60;
  var all    = [];
  var view   = [];

  var more = document.createElement('div');
  more.className = 'text-center mt-4';
  more.innerHTML = '<button type="button" class="btn btn-lg" style="background:#f43f5e;color:#fff;font-weight:600;border-radius:10px;padding:12px 32px;">Load more</button>';
  var moreBtn = more.firstChild;
  grid.parentNode.insertBefore(more, grid.nextSibling);
  moreBtn.addEventListener('click', function () { page++; render(); });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function card(item) {
    return '<div class="col-12 col-md-6 col-lg-4 media-item">'
      + '<div class="glass-card">'
      + '<div class="item-title"><i class="fas fa-play-circle text-danger me-2" style="font-size:0.9rem;"></i>'
      + esc(item.t) + '</div>'
      + (item.d ? '<div class="item-desc">' + esc(item.d) + '</div>' : '')
      + '<div class="mt-3"><span class="text-uppercase" style="font-size:0.7rem;color:#f43f5e;letter-spacing:1px;font-weight:800;">Streaming Now</span></div>'
      + '</div></div>';
  }

  function render() {
    var shown = view.slice(0, page * PER);
    grid.innerHTML = shown.map(card).join('');
    more.style.display = shown.length < view.length ? '' : 'none';
    moreBtn.textContent = 'Load more (' + (view.length - shown.length) + ' left)';
    if (count) {
      count.textContent = view.length.toLocaleString() + ' titles'
        + (view.length !== all.length ? ' matching your search' : '');
    }
  }

  function search() {
    var q = (input && input.value || '').toLowerCase().trim();
    view = q ? all.filter(function (i) {
      return i.t.toLowerCase().indexOf(q) !== -1 || i.d.toLowerCase().indexOf(q) !== -1;
    }) : all;
    page = 1;
    render();
  }

  if (input) input.addEventListener('input', search);

  fetch(src)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) { all = data; view = data; render(); })
    .catch(function () {
      // Keep the server-rendered first page visible if the data file can't load.
      more.style.display = 'none';
      if (count) count.textContent = 'Search is unavailable right now.';
    });
})();