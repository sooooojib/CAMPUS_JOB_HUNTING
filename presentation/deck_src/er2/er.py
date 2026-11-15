"""UniCareer ER diagram (flat database-tool style, crow's-foot notation).
Hand-placed tables inside 6 group zones, orthogonal A* routing on an 11 px grid that
never enters foreign zones, never overlaps another line and avoids crossings.
Output: er.svg (+ crossing report). Render to PNG/PDF with render.js."""
import json, heapq, sys, math
from collections import defaultdict

G = 11
XPEN = 200
SCHEMA = {m["table"]: m for m in (lambda d: d if isinstance(d, list) else list(d.values()))(json.load(open("../data/schema.json"))["models"])}
BUILTIN = {"String": "text", "Int": "int", "Float": "float", "Boolean": "bool", "DateTime": "timestamp", "Json": "json"}
def tlabel(t):
    lst = t.endswith("[]"); b = t.replace("?", "").replace("[]", "")
    return (BUILTIN.get(b, "enum")) + ("[]" if lst else "")

COLS = {
    "users": ["id", "email", "name", "membershipType", "verificationStatus"],
    "profiles": ["id", "userId", "department", "studentId"],
    "membership_requests": ["id", "userId", "reviewerId", "status"],
    "academic_records": ["id", "userId", "semester", "gpa"],
    "sessions": ["id", "userId", "token", "expiresAt"],
    "accounts": ["id", "userId", "providerId"],
    "verifications": ["id", "identifier", "expiresAt"],
    "departments": ["id", "code", "name"],
    "skills": ["id", "name", "category"],
    "opportunities": ["id", "companyId", "posterId", "reviewerId", "title", "status", "deadline"],
    "companies": ["id", "createdById", "name", "slug"],
    "applications": ["id", "opportunityId", "applicantId", "resumeId", "reviewedById", "status"],
    "application_status_history": ["id", "applicationId", "changedById", "status"],
    "opportunity_bookmarks": ["id", "userId", "opportunityId"],
    "opportunity_comments": ["id", "opportunityId", "authorId", "content"],
    "manual_applications": ["id", "userId", "companyName", "status"],
    "posts": ["id", "authorId", "attachedOpportunityId", "title", "postType"],
    "comments": ["id", "postId", "authorId", "parentId", "content"],
    "post_reactions": ["id", "postId", "userId", "type"],
    "post_bookmarks": ["id", "postId", "userId"],
    "content_reports": ["id", "reporterId", "postId", "commentId", "reviewedById", "reason"],
    "connections": ["id", "senderId", "receiverId", "status"],
    "referral_requests": ["id", "requesterId", "recipientId", "companyId", "opportunityId", "status"],
    "notifications": ["id", "recipientId", "type", "title"],
    "notification_preferences": ["id", "userId", "remindersEmail"],
    "career_calendar_events": ["id", "userId", "title", "startDate"],
    "deadline_reminder_logs": ["id", "userId", "opportunityId", "reminderType"],
    "admin_audit_logs": ["id", "adminId", "action", "targetType"],
    "resumes": ["id", "userId", "fileName"],
    "company_members": ["id", "companyId", "userId", "role"],
}
GROUP = {}
GROUPS = [
    ("people", "People and login", ["users", "profiles", "membership_requests", "academic_records", "sessions", "accounts", "verifications", "departments", "skills"]),
    ("jobs", "Jobs and applications", ["opportunities", "companies", "applications", "application_status_history", "opportunity_bookmarks", "opportunity_comments", "manual_applications"]),
    ("comm", "Community and referrals", ["posts", "comments", "post_reactions", "post_bookmarks", "content_reports", "connections", "referral_requests"]),
    ("alerts", "Alerts and calendar", ["notifications", "notification_preferences", "career_calendar_events", "deadline_reminder_logs"]),
    ("admin", "Admin", ["admin_audit_logs"]),
    ("left", "Left over (no longer used)", ["resumes", "company_members"]),
]
for k, _, ts in GROUPS:
    for t in ts: GROUP[t] = k

HDR, RH, PAD = 33, 22, 11
def field(t, c):
    return next(f for f in SCHEMA[t]["fields"] if f["name"] == c)
def width(t):
    w = len(t) * 8.6 + 40
    for c in COLS[t]:
        f = field(t, c); tag = "PK" if f["pk"] else "FK" if f["fk"] else "UQ" if f["uq"] else ""
        w = max(w, len(c) * 7.3 + len(tlabel(f["type"])) * 6.3 + (26 if tag else 0) + 44)
    return int(math.ceil(w / G) * G)
def height(t): return HDR + len(COLS[t]) * RH + PAD

# ---------------- layout (top-left corners, multiples of 11) ----------------
POS = {}
ZONES = {}
def place(t, x, y): POS[t] = (x * G, y * G)
CW_, CH_ = 260, 132   # canvas in grid cells
WIDTH = {"users": 33}
def W_(t): return WIDTH.get(t, width(t) // G) * G
COLS["users"] = ["id", "email", "name", "membershipType", "systemRole", "verificationStatus", "accountStatus", "emailVerified", "createdAt"]

ZONES = {  # x0, y0, x1, y1 in cells
    "jobs": (2, 8, 45, 130), "comm": (214, 8, 258, 130), "people": (48, 36, 208, 106),
    "left": (48, 8, 118, 32), "admin": (160, 8, 208, 32), "alerts": (48, 110, 208, 130),
}
COLS["users"] = [f["name"] for f in SCHEMA["users"]["fields"]]
def _column(order, x, y0, gap):
    out = {}; y = y0
    for t in order: out[t] = (x, y); y += height(t) // G + gap
    return out
L = {}
# Jobs and Community are single columns facing users; their internal links run on the back side
L.update(_column(["companies", "opportunities", "applications", "application_status_history", "opportunity_bookmarks", "opportunity_comments", "manual_applications"], 13, 13, 3))
L.update(_column(["referral_requests", "posts", "comments", "content_reports", "post_reactions", "post_bookmarks", "connections"], 221, 13, 3))
L.update({
    # people: users in the middle, linked tables above/below, lookups at the corners
    "verifications": (51, 41), "profiles": (70, 41), "membership_requests": (89, 41),
    "academic_records": (150, 41), "departments": (171, 41), "skills": (189, 41),
    "users": (112, 56), "sessions": (93, 92), "accounts": (150, 92),
    # left over / admin (top middle), alerts (bottom middle)
    "resumes": (60, 15), "company_members": (90, 15), "admin_audit_logs": (174, 15),
    "notifications": (60, 114), "notification_preferences": (82, 115), "deadline_reminder_logs": (122, 114), "career_calendar_events": (150, 114),
})
# which side of users each group's links use, and the band of that side (fraction of the side)
USIDE = {"jobs": ("l", 0.0, 1.0), "comm": ("r", 0.0, 1.0), "left": ("t", 0.0, 0.5), "admin": ("t", 0.5, 1.0), "alerts": ("b", 0.0, 1.0)}
# ---------------- links ----------------
LINKS = []  # (child, col, parent, optional, unique)
for t in COLS:
    for c in COLS[t]:
        f = field(t, c)
        if f["fk"]: LINKS.append((t, c, f["fk"], f["type"].endswith("?"), f["uq"]))
def box(t):
    x, y = L[t]; return (x, y, x + W_(t) // G, y + height(t) // G)
def row_y(t, c):  # grid row of a column's centre
    return L[t][1] + (HDR + COLS[t].index(c) * RH + RH // 2) // G

# ---------------- router ----------------
BLOCK = set()
for t in L:
    a, b, c, d = box(t)
    for x in range(a - 1, c + 2):
        for y in range(b - 1, d + 2): BLOCK.add((x, y))
LEG = (122, 8, 156, 32)
LABEL_OFF = {"jobs": 11}
for x in range(LEG[0] - 1, LEG[2] + 2):
    for y in range(LEG[1] - 1, LEG[3] + 2): BLOCK.add((x, y))
for k, (a, b, c, d) in ZONES.items():
    n = next(len(nm) + 10 for kk, nm, _ in GROUPS if kk == k)
    off = LABEL_OFF.get(k, 0)
    for x in range(a + off, a + off + int(n * 0.85) + 2):
        for y in range(b, b + 4): BLOCK.add((x, y))
USED = {}       # (x,y) -> 'h' | 'v' | 'x' (corner/endpoint, impassable)
def zone_of(p):
    for k, (a, b, c, d) in ZONES.items():
        if a <= p[0] <= c and b <= p[1] <= d: return k
    return None
DIRS = [(1, 0), (-1, 0), (0, 1), (0, -1)]
def route(starts, goals, allowed, maxit=400000):
    """starts: list of (point, dir) ; goals: dict point -> required final dir"""
    pq = []; best = {}
    for p, d in starts:
        heapq.heappush(pq, (0, 0, p, d, None)); best[(p, d)] = 0
    came = {}
    gx0 = min(g[0] for g in goals); gx1 = max(g[0] for g in goals); gy0 = min(g[1] for g in goals); gy1 = max(g[1] for g in goals)
    def h(p):  # distance to the goal bounding box (ports surround the parent box)
        dx = gx0 - p[0] if p[0] < gx0 else p[0] - gx1 if p[0] > gx1 else 0
        dy = gy0 - p[1] if p[1] < gy0 else p[1] - gy1 if p[1] > gy1 else 0
        return dx + dy
    it = 0
    while pq and it < maxit:
        it += 1
        f, g, p, d, _ = heapq.heappop(pq)
        if g > best.get((p, d), 1e18): continue
        if p in goals and goals[p] == d:
            path = [p]; key = (p, d)
            while key in came: key = came[key]; path.append(key[0])
            return path[::-1], g
        for nd in DIRS:
            if nd == (-d[0], -d[1]): continue
            q = (p[0] + nd[0], p[1] + nd[1])
            if not (1 <= q[0] <= CW_ - 1 and 1 <= q[1] <= CH_ - 1): continue
            if q in BLOCK and q not in goals: continue
            if q in RESERVED and RESERVED[q] is not CUR[0] and q not in goals: continue
            z = zone_of(q)
            if z is not None and z not in allowed: continue
            u = USED.get(q); o = 'h' if nd[1] == 0 else 'v'
            cost = 1
            if u:
                if u == 'x' or u == o: continue
                cost += XPEN  # crossing
            if nd != d:
                if USED.get(p) and p not in [s[0] for s in starts]: continue  # can't turn on a crossing
                cost += 4
            ng = g + cost
            if ng < best.get((q, nd), 1e18):
                best[(q, nd)] = ng; came[(q, nd)] = (p, d)
                heapq.heappush(pq, (ng + h(q), ng, q, nd, None))
    return None, None

def mark(path):
    for i, p in enumerate(path):
        if i == 0 or i == len(path) - 1: USED[p] = 'x'; continue
        a, b = path[i - 1], path[i + 1]
        if a[0] == b[0]: o = 'v'
        elif a[1] == b[1]: o = 'h'
        else: o = 'x'
        if p in USED and USED[p] != o: USED[p] = 'x'   # crossing point stays passable? no: freeze
        else: USED[p] = o

PORTS_USED = defaultdict(set)
def endpoints_child(t, c):
    a, b, cx, d = box(t); y = row_y(t, c)
    return [((a - 2, y), (-1, 0), (a, y)), ((cx + 2, y), (1, 0), (cx, y))]
def endpoints_parent(t):
    a, b, c, d = box(t); res = {}
    stub_rows = {'l': set(), 'r': set()}
    for lk2 in LINKS:
        if lk2[0] == t: y2 = row_y(t, lk2[1]); stub_rows['l'].add(y2); stub_rows['r'].add(y2)
    def ok(side, k):
        if side in 'lr' and any(abs(k - y2) <= 1 for y2 in stub_rows[side]): return False
        return all(abs(k - j) >= 2 for j in PORTS_USED[(t, side)])
    for x in range(a + 1, c):
        if ok('t', x): res[(x, b - 2)] = ((0, 1), (x, b), ('t', x))
        if ok('b', x): res[(x, d + 2)] = ((0, -1), (x, d), ('b', x))
    for y in range(b + 1, d):
        if ok('l', y): res[(a - 2, y)] = ((1, 0), (a, y), ('l', y))
        if ok('r', y): res[(c + 2, y)] = ((-1, 0), (c, y), ('r', y))
    return res

ROUTES = []
WANT = {}
RESERVED = {}
def reserve_all():
    RESERVED.clear()
    for lk in LINKS:
        for (pt, d, edge) in endpoints_child(lk[0], lk[1]):
            for k in (1, 2): RESERVED[(edge[0] + d[0] * k, edge[1])] = lk
def sides_for(lk):
    """allowed child exit sides and parent entry sides"""
    t, c, p, *_ = lk; gt, gp = GROUP[t], GROUP[p]
    ux = (box("users")[0] + box("users")[2]) / 2
    face = lambda tb: 'r' if (box(tb)[0] + box(tb)[2]) / 2 < ux else 'l'
    if p == "users":
        if gt == "jobs": return "r", None
        if gt == "comm": return "l", None
        return face(t) if gt != "people" or True else "lr", None
    if gt == gp == "jobs": return "l", "l"
    if t == p: return "r", "r"
    if gt == gp == "comm": return "r", "r"
    if gt == "comm" and gp == "jobs": return "r", ("tl" if p == "companies" else "l")
    if t == "company_members": return "l", "rt"
    if t == "applications" and p == "resumes": return "l", "tl"
    return "lr", None
CUR = [None]
def do_link(lk):
    CUR[0] = lk
    t, c, p, opt, uq = lk
    allowed = {GROUP[t], GROUP[p]}
    cs, ps = sides_for(lk)
    sts = [(s, d) for s, d, _ in endpoints_child(t, c) if s not in BLOCK and USED.get(s) is None and (('l' if d[0] < 0 else 'r') in cs)]
    pe = endpoints_parent(p)
    if ps: pe = {k: v for k, v in pe.items() if v[2][0] in ps} or pe
    if t == p:  # self reference: loop back to the id row on the same side
        pe = {k: v for k, v in pe.items() if v[2][0] == 'r' and v[2][1] == row_y(t, "id")} or pe
    if p == "users":
        side = uside(lk)
        cand = {k: v for k, v in pe.items() if v[2][0] == side}
        if lk in WANT:
            exact = {k: v for k, v in cand.items() if v[2][1] == WANT[lk]}
            near = {k: v for k, v in cand.items() if abs(v[2][1] - WANT[lk]) <= 1}
            cand = exact or near or cand
        pe = cand or pe
    goals = {k: v[0] for k, v in pe.items() if USED.get(k) is None and k not in BLOCK}
    if not goals or not sts:
        print('NO GOALS', lk); return
    path, cost = route(sts, goals, allowed)
    if not path:
        print("NO ROUTE", lk); return
    s = path[0]; e = path[-1]
    se = [x for x in endpoints_child(t, c) if x[0] == s][0]
    _, edge_pt, (side, k) = pe[e]
    PORTS_USED[(p, side)].add(k)
    full = [se[2]] + path + [edge_pt]
    mark(path)
    for q in (se[2], edge_pt): USED[q] = 'x'
    ROUTES.append({"link": lk, "pts": full, "path": path, "cost": cost, "cdir": se[1], "pdir": pe[e][0], "port": (p, side, k), "ends": (se[2], edge_pt)})

def uside(lk):
    t = lk[0]
    if GROUP[t] == "people": return 't' if L[t][1] < L["users"][1] else 'b'
    return USIDE[GROUP[t]][0]
def plan_ports():
    WANT.clear()
    a_, b_, c_, d_ = box("users")
    sides = defaultdict(list)
    for lk in LINKS:
        if lk[2] == "users": sides[uside(lk)].append(lk)
    for side, lks in sides.items():
        if side in "lr":
            lks.sort(key=lambda l: (row_y(l[0], l[1]),)); lo, hi = b_ + 1, d_ - 1
        else:
            lks.sort(key=lambda l: (box(l[0])[0] + box(l[0])[2]) / 2 + (0.01 * row_y(l[0], l[1]))); lo, hi = a_ + 1, c_ - 1
        n = len(lks)
        for i, lk in enumerate(lks): WANT[lk] = int(round(lo + (hi - lo) * (i + 0.5) / n))

def order_key(lk):
    t, c, p, *_ = lk
    a = box(t); b = box(p)
    dist = abs((a[0] + a[2]) / 2 - (b[0] + b[2]) / 2) + abs((a[1] + a[3]) / 2 - (b[1] + b[3]) / 2)
    return (p == "users", GROUP[t] != GROUP[p], dist)

# ---------------- render ----------------
NAVY, ORANGE, INK, GREY, LINEC, BG = "#1E3A5F", "#C2410C", "#111827", "#8A94A6", "#475569", "#EEF3F8"
ZSTYLE = {
    "people": ("#DCE6F2", "#1E3A5F"), "jobs": ("#FBE6D6", "#C2410C"), "comm": ("#DDEFE4", "#1F7A4D"),
    "alerts": ("#DFE9F7", "#2F6FB0"), "admin": ("#F5EBD3", "#A16207"), "left": ("#E9ECF0", "#8A94A6"),
}
def esc(s): return s.replace("&", "&amp;").replace("<", "&lt;")
def simplify(pts):
    out = [pts[0]]
    for i in range(1, len(pts) - 1):
        a, b, c = out[-1], pts[i], pts[i + 1]
        if (a[0] == b[0] == c[0]) or (a[1] == b[1] == c[1]): continue
        out.append(b)
    out.append(pts[-1]); return out

def svg():
    W, H = CW_ * G, CH_ * G
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Carlito, Calibri, sans-serif">',
         f'<rect width="{W}" height="{H}" fill="{BG}"/>']
    gname = {k: (n, len(ts)) for k, n, ts in GROUPS}
    for k, (a, b, c, d) in ZONES.items():
        fill, col = ZSTYLE[k]
        dash = ' stroke-dasharray="8 6"' if k == "left" else ""
        o.append(f'<rect x="{a*G}" y="{b*G}" width="{(c-a)*G}" height="{(d-b)*G}" rx="12" fill="{fill}" fill-opacity="0.75" stroke="{col}" stroke-opacity="0.45" stroke-width="1.5"{dash}/>')
        n, cnt = gname[k]
        o.append(f'<text x="{(a + LABEL_OFF.get(k, 0))*G+14}" y="{b*G+24}" font-size="17" font-weight="700" fill="{col}">{esc(n)} <tspan fill="{col}" fill-opacity="0.7" font-weight="400">· {cnt} {"table" if cnt == 1 else "tables"}</tspan></text>')
    # lines (under tables)
    segs = []
    for ri, r in enumerate(ROUTES):
        pts = simplify(r["pts"]); r["s"] = pts
        for i in range(len(pts) - 1): segs.append((ri, pts[i], pts[i + 1]))
    hops = defaultdict(list)  # ri -> list of (x,y) on its horizontal segments
    crossings = 0
    for i in range(len(segs)):
        for j in range(i + 1, len(segs)):
            ra, a1, a2 = segs[i]; rb, b1, b2 = segs[j]
            if ra == rb: continue
            for (h1, h2, rh_), (v1, v2, rv) in [((a1, a2, ra), (b1, b2, rb)), ((b1, b2, rb), (a1, a2, ra))]:
                if h1[1] == h2[1] and v1[0] == v2[0]:
                    y = h1[1]; x = v1[0]
                    if min(h1[0], h2[0]) < x < max(h1[0], h2[0]) and min(v1[1], v2[1]) < y < max(v1[1], v2[1]):
                        crossings += 1; hops[rh_].append((x, y))
    for ri, r in enumerate(ROUTES):
        pts = r["s"]; d = f'M{pts[0][0]*G},{pts[0][1]*G}'
        for i in range(1, len(pts)):
            a, b = pts[i - 1], pts[i]
            if a[1] == b[1]:
                xs = sorted([h[0] for h in hops[ri] if h[1] == a[1] and min(a[0], b[0]) < h[0] < max(a[0], b[0])], reverse=b[0] < a[0])
                sgn = 1 if b[0] > a[0] else -1
                for hx in xs:
                    d += f' L{hx*G - sgn*6},{a[1]*G} a6,6 0 0 {1 if sgn > 0 else 0} {sgn*12},0'
            d += f' L{b[0]*G},{b[1]*G}'
        col = "#9AA5B4" if "left" in (GROUP[r["link"][0]], GROUP[r["link"][2]]) else LINEC
        dash = ' stroke-dasharray="6 4"' if col == "#9AA5B4" else ""
        o.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="1.6"{dash}/>')
        # crow's foot ends
        t, c, p, opt, uq = r["link"]
        ex, ey = pts[0][0] * G, pts[0][1] * G; dx, dy = r["cdir"]
        def ln(x1, y1, x2, y2): o.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="1.6"/>')
        def circ(x, y): o.append(f'<circle cx="{x}" cy="{y}" r="4.5" fill="{BG}" stroke="{col}" stroke-width="1.6"/>')
        px, py = -dy, dx
        if uq:   # zero or one
            ln(ex + dx*9 + px*7, ey + dy*9 + py*7, ex + dx*9 - px*7, ey + dy*9 - py*7); circ(ex + dx*17, ey + dy*17)
        else:    # zero or many (crow's foot)
            fx, fy = ex + dx*13, ey + dy*13
            ln(fx, fy, ex + px*7, ey + py*7); ln(fx, fy, ex - px*7, ey - py*7); circ(ex + dx*18, ey + dy*18)
        ex, ey = pts[-1][0] * G, pts[-1][1] * G; dx, dy = -r["pdir"][0], -r["pdir"][1]; px, py = -dy, dx
        ln(ex + dx*8 + px*7, ey + dy*8 + py*7, ex + dx*8 - px*7, ey + dy*8 - py*7)
        if opt: circ(ex + dx*17, ey + dy*17)
        else: ln(ex + dx*13 + px*7, ey + dy*13 + py*7, ex + dx*13 - px*7, ey + dy*13 - py*7)
    # tables
    for t in L:
        x, y = L[t][0] * G, L[t][1] * G; w = W_(t); h = height(t)
        legacy = GROUP[t] == "left"
        hc = "#8A94A6" if legacy else NAVY
        o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#FFFFFF" stroke="{"#AAB5C3" if legacy else "#8FA3BB"}" stroke-width="1"{" stroke-dasharray=\"5 3\"" if legacy else ""}/>')
        o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{HDR}" fill="{hc}"/>')
        o.append(f'<text x="{x+10}" y="{y+22}" font-size="16" font-weight="700" fill="#FFFFFF">{esc(t)}</text>')
        for i, c in enumerate(COLS[t]):
            f = field(t, c); ry = y + HDR + i * RH
            tag = "PK" if f["pk"] else "FK" if f["fk"] else "UQ" if f["uq"] else ""
            if i % 2 == 1: o.append(f'<rect x="{x+1}" y="{ry}" width="{w-2}" height="{RH}" fill="#F6F8FB"/>')
            o.append(f'<text x="{x+10}" y="{ry+16}" font-size="14" fill="{"#6B7280" if legacy else INK}" font-weight="{700 if f["pk"] else 400}">{esc(c)}</text>')
            o.append(f'<text x="{x+w-10}" y="{ry+16}" font-size="12.5" text-anchor="end" fill="{GREY}">{esc(tlabel(f["type"]))}'
                     + (f'<tspan dx="6" font-weight="700" fill="{ORANGE if tag == "PK" else NAVY if tag == "FK" else "#6B7280"}">{tag}</tspan>' if tag else "") + '</text>')
    o.append(LEGEND())
    o.append("</svg>")
    return "\n".join(o), crossings

def LEGEND():
    a, b, c, d = [v * G for v in LEG]
    o = [f'<rect x="{a}" y="{b}" width="{c-a}" height="{d-b}" rx="10" fill="#FFFFFF" stroke="#C5D0DD"/>',
         f'<text x="{a+14}" y="{b+26}" font-size="16" font-weight="700" fill="{NAVY}">UniCareer database</text>',
         f'<text x="{a+14}" y="{b+46}" font-size="13" fill="{GREY}">PostgreSQL · 30 tables · 48 relationships</text>']
    def sample(y, kind, label):
        x0, x1 = a + 16, a + 96
        o.append(f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="{LINEC}" stroke-width="1.6"/>')
        e = x1
        if kind == "many":
            o.append(f'<line x1="{e-13}" y1="{y}" x2="{e}" y2="{y-7}" stroke="{LINEC}" stroke-width="1.6"/><line x1="{e-13}" y1="{y}" x2="{e}" y2="{y+7}" stroke="{LINEC}" stroke-width="1.6"/>')
            o.append(f'<circle cx="{e-18}" cy="{y}" r="4.5" fill="#FFFFFF" stroke="{LINEC}" stroke-width="1.6"/>')
        elif kind == "one":
            o.append(f'<line x1="{e-8}" y1="{y-7}" x2="{e-8}" y2="{y+7}" stroke="{LINEC}" stroke-width="1.6"/><line x1="{e-13}" y1="{y-7}" x2="{e-13}" y2="{y+7}" stroke="{LINEC}" stroke-width="1.6"/>')
        else:
            o.append(f'<line x1="{e-8}" y1="{y-7}" x2="{e-8}" y2="{y+7}" stroke="{LINEC}" stroke-width="1.6"/><circle cx="{e-17}" cy="{y}" r="4.5" fill="#FFFFFF" stroke="{LINEC}" stroke-width="1.6"/>')
        o.append(f'<text x="{x1+14}" y="{y+5}" font-size="13.5" fill="{INK}">{label}</text>')
    sample(b + 72, "one", "exactly one")
    sample(b + 96, "opt", "zero or one")
    sample(b + 120, "many", "zero or many")
    o.append(f'<text x="{a+14}" y="{b+150}" font-size="12.5" fill="{GREY}"><tspan font-weight="700" fill="{ORANGE}">PK</tspan> primary key  <tspan font-weight="700" fill="{NAVY}">FK</tspan> foreign key  <tspan font-weight="700" fill="#6B7280">UQ</tspan> unique</text>')
    o.append(f'<text x="{a+14}" y="{b+172}" font-size="12.5" fill="{GREY}">Every link points to the parent table&#8217;s id</text>')
    o.append(f'<text x="{a+14}" y="{b+190}" font-size="12.5" fill="{GREY}">Keys and main columns shown (users: all)</text>')
    o.append(f'<text x="{a+14}" y="{b+212}" font-size="12.5" fill="{GREY}">Dashed grey = no longer used</text>')
    return "\n".join(o)
