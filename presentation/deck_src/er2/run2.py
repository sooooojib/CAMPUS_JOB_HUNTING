import sys, io, contextlib, random, pickle, time
exec(open('er.py').read())
def rebuild_used():
    USED.clear(); PORTS_USED.clear()
    for r in ROUTES:
        mark(r["path"])
        for q in r["ends"]: USED[q] = 'x'
        p, side, k = r["port"]; PORTS_USED[(p, side)].add(k)
def count_cross():
    segs = []
    for ri, r in enumerate(ROUTES):
        pts = simplify(r["pts"])
        for a, b in zip(pts, pts[1:]): segs.append((ri, a, b))
    per = [0] * len(ROUTES); tot = 0
    hs = [(ri, a, b) for ri, a, b in segs if a[1] == b[1]]
    vs = [(ri, a, b) for ri, a, b in segs if a[0] == b[0]]
    for rh, h1, h2 in hs:
        for rv, v1, v2 in vs:
            if rh == rv: continue
            if min(h1[0], h2[0]) < v1[0] < max(h1[0], h2[0]) and min(v1[1], v2[1]) < h1[1] < max(v1[1], v2[1]):
                tot += 1; per[rh] += 1; per[rv] += 1
    return tot, per
random.seed(int(sys.argv[1]))
plan_ports(); reserve_all()
order = sorted(LINKS, key=order_key)
if len(sys.argv) > 3: random.shuffle(order)
with contextlib.redirect_stdout(io.StringIO()):
    for lk in order: do_link(lk)
routed = {r["link"] for r in ROUTES}
tot, per = count_cross(); print("initial", tot, "missing", len(LINKS) - len(ROUTES), flush=True)
T0 = time.time()
for ps in range(int(sys.argv[2])):
    improved = False
    idx = sorted(range(len(ROUTES)), key=lambda i: -per[i])
    for i in idx:
        if per[i] == 0: continue
        lk = ROUTES[i]["link"]; old = ROUTES.pop(i); rebuild_used()
        bestc = None
        for relax in (False, True):
            w = WANT.pop(lk, None) if relax else None
            with contextlib.redirect_stdout(io.StringIO()): do_link(lk)
            if w is not None: WANT[lk] = w
            if ROUTES and ROUTES[-1]["link"] == lk:
                nt, nper = count_cross()
                cand = ROUTES.pop(); rebuild_used()
                if nt < tot and (bestc is None or nt < bestc[0]): bestc = (nt, nper, cand)
        if bestc:
            tot, per = bestc[0], bestc[1]; ROUTES.insert(i, bestc[2]); rebuild_used(); improved = True
            continue
        ROUTES.insert(i, old); rebuild_used()
        tot, per = count_cross()
    # also retry missing links
    for lk in LINKS:
        if lk not in {r["link"] for r in ROUTES}:
            with contextlib.redirect_stdout(io.StringIO()): do_link(lk)
            routed = {r["link"] for r in ROUTES}; tot, per = count_cross()
    print("pass", ps, "crossings", tot, "missing", [l[:3] for l in LINKS if l not in {r["link"] for r in ROUTES}], "t=%.0f" % (time.time() - T0), flush=True)
    if not improved: break
# pair rip-up: reroute two crossing lines together, in both orders
def crossing_pairs():
    segs = []
    for ri, rr in enumerate(ROUTES):
        pts = simplify(rr["pts"])
        for a, b in zip(pts, pts[1:]): segs.append((ri, a, b))
    hs = [x for x in segs if x[1][1] == x[2][1]]; vs = [x for x in segs if x[1][0] == x[2][0]]
    out = set()
    for rh, h1, h2 in hs:
        for rv, v1, v2 in vs:
            if rh != rv and min(h1[0], h2[0]) < v1[0] < max(h1[0], h2[0]) and min(v1[1], v2[1]) < h1[1] < max(v1[1], v2[1]):
                out.add((ROUTES[rh]["link"], ROUTES[rv]["link"]))
    return out
for rnd in range(int(sys.argv[4]) if len(sys.argv) > 4 else 3):
    gained = False
    for la, lb in list(crossing_pairs()):
        cur = [dict(x) for x in ROUTES]
        if la not in {x["link"] for x in ROUTES} or lb not in {x["link"] for x in ROUTES}: continue
        best_local = None
        for first, second in ((la, lb), (lb, la)):
            for relax in (False, True):
                ROUTES[:] = [x for x in cur if x["link"] not in (la, lb)]; rebuild_used()
                saved = {k: WANT.pop(k) for k in (la, lb) if relax and k in WANT}
                with contextlib.redirect_stdout(io.StringIO()):
                    do_link(first); do_link(second)
                WANT.update(saved)
                if len(ROUTES) == len(cur):
                    nt, _ = count_cross()
                    if nt < tot and (best_local is None or nt < best_local[0]): best_local = (nt, [dict(x) for x in ROUTES])
        if best_local:
            tot = best_local[0]; ROUTES[:] = best_local[1]; gained = True
        else:
            ROUTES[:] = cur
        rebuild_used()
    tot, per = count_cross()
    print("pair round", rnd, "crossings", tot, flush=True)
    if not gained: break
# fallback for links that could not be routed with the preferred sides
SF = sides_for
for lk in LINKS:
    if lk not in {r["link"] for r in ROUTES}:
        WANT.pop(lk, None)
        globals()["sides_for"] = lambda l, _lk=lk: ("lr", None) if l == _lk else SF(l)
        with contextlib.redirect_stdout(io.StringIO()): do_link(lk)
        globals()["sides_for"] = SF
s, cr = svg(); open("er.svg", "w").write(s)
pickle.dump([dict(r) for r in ROUTES], open("routes.pkl", "wb"))
print("FINAL crossings", cr, "missing", len(LINKS) - len(ROUTES))
