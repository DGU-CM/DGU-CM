"""Pack the built Astro site (dist/) into ONE self-contained HTML file.

- Every page (EN + KO) is stored as an HTML string and shown in a full-window iframe (srcdoc).
- Images, fonts and CSS are stored once and handed to pages as blob: URLs.
- Internal links are intercepted by the shell, so the file works from file:// with no server.
"""
import base64, json, pathlib, re, subprocess, sys, tempfile

SITE = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(sys.argv[2])
DIST = SITE / 'dist'

PAGES = ['/', '/about', '/research', '/publications', '/people', '/join',
         '/ko/', '/ko/about', '/ko/research', '/ko/publications', '/ko/people', '/ko/join']

def page_file(path):
    rel = path.strip('/')
    return DIST / rel / 'index.html' if rel else DIST / 'index.html'

assets = {}          # key -> (mime, bytes)
asset_by_path = {}   # dist path -> key

def add_asset(data, mime, hint):
    key = f'a{len(assets)}'
    assets[key] = (mime, data)
    return key

def asset_for(url_path):
    if url_path in asset_by_path:
        return asset_by_path[url_path]
    f = DIST / url_path.lstrip('/')
    ext = f.suffix.lower()
    mime = {'.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
            '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff'}[ext]
    key = add_asset(f.read_bytes(), mime, url_path)
    asset_by_path[url_path] = key
    return key

# ---------- CSS (union of all bundles) ----------
css = ''.join(p.read_text(encoding='utf-8') for p in sorted((DIST / '_astro').glob('*.css')))
faces = re.findall(r'@font-face\{[^}]*\}', css)
css = re.sub(r'@font-face\{[^}]*\}', '', css)

# ---------- pages ----------
raw = {p: page_file(p).read_text(encoding='utf-8') for p in PAGES}

# Pretendard: one subset font with exactly the characters the site uses
text = ''.join(re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', h, flags=re.S)) for h in raw.values())
import html as _html
text = _html.unescape(text) + ''.join(chr(c) for c in range(32, 127)) + '·—–‘’“”…→←↗×©'
pret_src = SITE / 'node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2'
with tempfile.TemporaryDirectory() as td:
    tf = pathlib.Path(td) / 'chars.txt'; tf.write_text(text, encoding='utf-8')
    of = pathlib.Path(td) / 'pret.woff2'
    subprocess.run([sys.executable, '-m', 'fontTools.subset', str(pret_src), f'--text-file={tf}',
                    '--flavor=woff2', f'--output-file={of}', '--layout-features=*'], check=True)
    pret_key = add_asset(of.read_bytes(), 'font/woff2', 'pretendard')
font_css = ("@font-face{font-family:'Pretendard Variable';font-weight:45 920;font-style:normal;"
            f"font-display:block;src:url(__A:{pret_key}__) format('woff2-variations'),url(__A:{pret_key}__) format('woff2')}}")
# IBM Plex Mono: keep only the latin subsets (woff2)
for f in faces:
    if 'IBM Plex Mono' in f and re.search(r'ibm-plex-mono-latin-\d+', f) and 'latin-ext' not in f:
        u = re.search(r'url\((/_astro/[^)]+\.woff2)\)', f).group(1)
        f2 = re.sub(r'src:[^;]+;', f'src:url(__A:{asset_for(u)}__) format("woff2");', f)
        font_css += f2
css = font_css + css

def best_src(tag):
    ss = re.search(r'srcset="([^"]+)"', tag)
    if ss:
        cands = []
        for part in ss.group(1).split(','):
            u, _, w = part.strip().rpartition(' ')
            cands.append((int(w.rstrip('w')) if w.endswith('w') else 0, u))
        cands.sort()
        fit = [c for c in cands if c[0] <= 1300]
        return (fit[-1] if fit else cands[0])[1]
    return re.search(r'src="([^"]+)"', tag).group(1)

def process(h):
    h = re.sub(r'<link rel="stylesheet"[^>]*>', '', h)
    h = re.sub(r'<link rel="(?:canonical|alternate|icon|apple-touch-icon|preload|manifest)"[^>]*>', '', h)
    h = re.sub(r'<noscript>.*?</noscript>', '', h, flags=re.S)
    # remembered-language redirect relies on real URLs; the shell handles language instead
    h = re.sub(r'<script>\(function\(\)\{const ko = .*?</script>', '', h, flags=re.S)
    def img(m):
        tag = m.group(0)
        src = best_src(tag)
        tag = re.sub(r'\s(?:srcset|sizes)="[^"]*"', '', tag)
        tag = re.sub(r'\ssrc="[^"]*"', f' src="__A:{asset_for(src)}__"', tag)
        tag = tag.replace('loading="lazy"', 'loading="eager"')
        return tag
    h = re.sub(r'<img\b[^>]*>', img, h)
    h = h.replace('</head>', '<style>__CSS__</style></head>', 1)
    return h

pages = {p: process(h) for p, h in raw.items()}
left = sorted(set(re.findall(r'(?:src|href)="(/_astro/[^"]+)"', ''.join(pages.values()))))
assert not left, left

favicon = (DIST / 'favicon.svg').read_text(encoding='utf-8')
data = {
    'pages': pages,
    'css': css,
    'assets': {k: [m, base64.b64encode(b).decode()] for k, (m, b) in assets.items()},
}
payload = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

shell = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DGU CM Lab | Construction Management Lab, Dongguk University</title>
<link rel="icon" href="data:image/svg+xml;base64,{base64.b64encode(favicon.encode()).decode()}">
<style>
  html,body{{margin:0;height:100%;background:#F7F6F2;overflow:hidden}}
  #view{{position:fixed;inset:0;width:100%;height:100%;border:0;display:block;background:#F7F6F2}}
  #boot{{position:fixed;inset:0;display:grid;place-items:center;font:600 15px system-ui,sans-serif;color:#44515F}}
</style>
</head>
<body>
<div id="boot">Loading DGU CM Lab…</div>
<iframe id="view" title="DGU CM Lab"></iframe>
<script id="site-data" type="application/json">{payload}</script>
<script>
(function(){{
  var D = JSON.parse(document.getElementById('site-data').textContent);
  var urls = {{}};
  Object.keys(D.assets).forEach(function(k){{
    var a = D.assets[k], bin = atob(a[1]), u8 = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    urls[k] = URL.createObjectURL(new Blob([u8], {{type: a[0]}}));
  }});
  var fill = function(s){{ return s.replace(/__A:(a\\d+)__/g, function(_, k){{ return urls[k]; }}); }};
  var css = fill(D.css);
  var view = document.getElementById('view');
  var current = null, pendingHash = '';

  function norm(p){{
    p = p.replace(/index\\.html$/, '');
    if (p === '/ko') p = '/ko/';
    if (p.length > 1 && p !== '/ko/' && p.endsWith('/')) p = p.slice(0, -1);
    return D.pages[p] ? p : (p.indexOf('/ko') === 0 ? '/ko/' : '/');
  }}
  function go(path, hash, push){{
    path = norm(path);
    pendingHash = hash || '';
    if (path === current) {{ scrollToHash(); return; }}
    current = path;
    var html = fill(D.pages[path]).replace('__CSS__', function(){{ return css; }});
    view.srcdoc = html;
    if (push !== false) {{
      var h = '#' + path + (hash ? hash : '');
      if (location.hash !== h) history.pushState(null, '', h);
    }}
  }}
  function scrollToHash(){{
    var doc = view.contentDocument; if (!doc) return;
    if (!pendingHash) {{ doc.defaultView.scrollTo(0, 0); return; }}
    var el = doc.getElementById(decodeURIComponent(pendingHash.slice(1)));
    if (el) el.scrollIntoView();
  }}
  view.addEventListener('load', function(){{
    var doc = view.contentDocument; if (!doc) return;
    document.getElementById('boot').style.display = 'none';
    document.title = doc.title || document.title;
    document.documentElement.lang = doc.documentElement.lang || 'en';
    setTimeout(scrollToHash, 60);
    doc.addEventListener('click', function(e){{
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
      var href = a.getAttribute('href');
      if (/^(mailto:|tel:)/.test(href)) return;
      if (/^https?:/.test(href)) {{ a.target = '_blank'; a.rel = 'noopener'; return; }}
      e.preventDefault();
      if (href.charAt(0) === '#') {{
        if (href === '#') return;
        var t = doc.getElementById(decodeURIComponent(href.slice(1)));
        if (t) {{ t.scrollIntoView({{behavior: 'smooth'}}); if (t.tabIndex < 0 && href === '#main') t.focus && t.focus(); }}
        return;
      }}
      var i = href.indexOf('#');
      var path = i >= 0 ? href.slice(0, i) : href, hash = i >= 0 ? href.slice(i) : '';
      path = path.replace(/\\?.*$/, '');
      go(path || current, hash);
    }});
  }});
  function fromLocation(){{
    var h = location.hash.slice(1);
    if (!h) return go('/', '', false);
    var i = h.indexOf('#');
    go(i >= 0 ? h.slice(0, i) : h, i >= 0 ? h.slice(i) : '', false);
  }}
  window.addEventListener('popstate', function(){{ current = null; fromLocation(); }});
  fromLocation();
}})();
</script>
</body>
</html>'''
OUT.write_text(shell, encoding='utf-8')
print(OUT, round(OUT.stat().st_size / 1e6, 2), 'MB', 'assets', len(assets))
