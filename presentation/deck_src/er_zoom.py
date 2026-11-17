"""Add 6 sequential Morph zoom stops (plus a zoom-out) after the full ER diagram slide."""
import copy, re, sys
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.opc.constants import RELATIONSHIP_TYPE as RT
from lxml import etree

SRC, OUT = sys.argv[1], sys.argv[2]
NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main', 'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'p14': 'http://schemas.microsoft.com/office/powerpoint/2010/main'}
MORPH = ('<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" '
         'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><mc:Choice Requires="p159"><p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" '
         'spd="slow" p14:dur="1000"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>')
SVG_W, SVG_H = 2860, 1452
# zones in SVG units (x0, y0, x1, y1), in the order of the "30 tables, 6 groups" slide
ZONES = [
    ("People and login", (528, 396, 2288, 1166)),
    ("Jobs and applications", (22, 88, 495, 1430)),
    ("Community and referrals", (2354, 88, 2838, 1430)),
    ("Alerts and calendar", (528, 1210, 2288, 1430)),
    ("Admin", (1760, 88, 2288, 352)),
    ("Left over", (528, 88, 1298, 352)),
]
NOTES = {
    "People and login": "Zoom 1 of 6: People and login. users sits in the centre; profiles, membership_requests, academic_records, sessions, accounts and verifications all link to users.id; departments and skills are lookup tables.",
    "Jobs and applications": "Zoom 2 of 6: Jobs and applications. opportunities (the job post) links to users (poster) and companies; applications, bookmarks and comments link a member to a job; application_status_history belongs to applications.",
    "Community and referrals": "Zoom 3 of 6: Community and referrals. posts own comments, reactions and bookmarks; comments can reply to comments; content_reports point to a post or a comment; referral_requests and connections link two users.",
    "Alerts and calendar": "Zoom 4 of 6: Alerts and calendar. notifications, notification_preferences, career_calendar_events and deadline_reminder_logs all belong to one member (users).",
    "Admin": "Zoom 5 of 6: Admin. admin_audit_logs has one row per admin action and links to the admin in users.",
    "Left over": "Zoom 6 of 6: Left over. resumes and company_members are still in the schema but nothing writes to them any more (dashed grey).",
}

p = Presentation(SRC)
slides = list(p.slides)
er_i = next(i for i, s in enumerate(slides) if any(sh.has_text_frame and sh.text_frame.text.strip() == "The full ER diagram" for sh in s.shapes))
er = slides[er_i]
pic = next(sh for sh in er.shapes if sh.shape_type == 13)
pic.name = "!!er"   # Morph pairs this picture across slides
X0, Y0, WB, HB = pic.left, pic.top, pic.width, pic.height
ax, ay = WB / SVG_W, HB / SVG_H          # EMU per SVG unit (keeps the picture's current proportions)
img_part = pic.part.related_part(pic._element.blipFill.find('a:blip', NS).get('{%s}embed' % NS['r']))
SW, SH = p.slide_width, p.slide_height

def clone(src):
    s = p.slides.add_slide(src.slide_layout)
    t = s.shapes._spTree
    for e in list(t)[2:]: t.remove(e)
    for e in list(src.shapes._spTree)[2:]: t.append(copy.deepcopy(e))
    rid = s.part.relate_to(img_part, RT.IMAGE)
    for b in t.iter('{%s}blip' % NS['a']): b.set('{%s}embed' % NS['r'], rid)
    nt = s.notes_slide.shapes._spTree
    for e in list(nt)[2:]: nt.remove(e)
    for e in list(src.notes_slide.shapes._spTree)[2:]: nt.append(copy.deepcopy(e))
    return s

def set_notes(s, text):
    for sp in s.notes_slide.shapes._spTree.iter('{%s}sp' % NS['p']):
        ph = sp.find('.//p:nvPr/p:ph', NS)
        if ph is not None and ph.get('type') == 'body':
            body = sp.find('p:txBody', NS)
            for para in body.findall('a:p', NS): body.remove(para)
            para = etree.SubElement(body, '{%s}p' % NS['a']); r = etree.SubElement(para, '{%s}r' % NS['a'])
            etree.SubElement(r, '{%s}rPr' % NS['a'], lang='en-US', dirty='0'); etree.SubElement(r, '{%s}t' % NS['a']).text = text

def set_transition(s, xml):
    el = s._element
    for e in list(el):
        if etree.QName(e).localname in ('AlternateContent', 'transition'): el.remove(e)
    el.find('p:clrMapOvr', NS).addnext(etree.fromstring(xml))

new = []
for k, (name, (x0, y0, x1, y1)) in enumerate(ZONES, 1):
    s = clone(er)
    t = s.shapes._spTree
    # keep only the diagram: title, kicker, progress bar and number fade out during the zoom
    for sh in list(s.shapes):
        if sh.name != "!!er": t.remove(sh._element)
    zw, zh = (x1 - x0) * ax, (y1 - y0) * ay
    tall = zh > zw
    # target area for the zone (EMU); tall zones use the full height, the label sits beside them
    tx0, tx1 = Inches(0.35), SW - Inches(0.35)
    ty0, ty1 = (Inches(0.12), SH - Inches(0.12)) if tall else (Inches(0.95), SH - Inches(0.25))
    z = min((tx1 - tx0) / zw, (ty1 - ty0) / zh, 3.2)
    cx, cy = (tx0 + tx1) / 2, (ty0 + ty1) / 2
    px = s.shapes[0]
    px.width, px.height = int(WB * z), int(HB * z)
    px.left = int(cx - (x0 + x1) / 2 * ax * z)
    px.top = int(cy - (y0 + y1) / 2 * ay * z)
    # label pill: "1 / 6  People and login"
    lw = Inches(0.62 + 0.125 * len(name) + 0.9)
    lx = Inches(0.35)
    if tall and name.startswith("Community"): lx = SW - Inches(0.35) - lw
    lab = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, lx, Inches(0.25), lw, Inches(0.52))
    lab.name = "Zoom label"
    lab.adjustments[0] = 0.5
    lab.fill.solid(); lab.fill.fore_color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    lab.line.color.rgb = RGBColor(0xD3, 0xDD, 0xE8); lab.line.width = Pt(0.75)
    sp = lab._element.spPr
    sp.append(etree.fromstring('<a:effectLst xmlns:a="%s"><a:outerShdw blurRad="152400" dist="25400" dir="5400000" algn="t" rotWithShape="0"><a:srgbClr val="1E3A5F"><a:alpha val="14000"/></a:srgbClr></a:outerShdw></a:effectLst>' % NS['a']))
    tf = lab.text_frame; tf.margin_left = tf.margin_right = Inches(0.2); tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE; tf.word_wrap = False
    para = tf.paragraphs[0]; para.alignment = PP_ALIGN.LEFT
    for txt, col in ((f"{k} / 6", RGBColor(0xC2, 0x41, 0x0C)), (f"   {name}", RGBColor(0x1E, 0x3A, 0x5F))):
        r = para.add_run(); r.text = txt; r.font.size = Pt(18); r.font.bold = True; r.font.name = "Calibri"; r.font.color.rgb = col
    set_transition(s, MORPH)
    set_notes(s, NOTES[name])
    new.append(s)

# zoom back out: an exact copy of the full ER slide (same number), entered with Morph
back = clone(er)
set_transition(back, MORPH)
set_notes(back, "Zoomed back out to the full diagram. Next: each group's tables with their key columns.")
new.append(back)

# move the new slides right after the ER slide, in order, and add them to the same section
lst = p.slides._sldIdLst
ids = list(lst)
moved = ids[-len(new):]
for e in moved: lst.remove(e)
anchor = list(lst)[er_i]
for e in moved:
    anchor.addnext(e); anchor = e
er_id = list(lst)[er_i].get('id')
sec_el = p.part._element.find('.//p14:sectionLst', NS)
a = next(x for x in sec_el.iter('{%s}sldId' % NS['p14']) if x.get('id') == er_id)
for e in moved:
    ne = etree.Element('{%s}sldId' % NS['p14'], id=e.get('id')); a.addnext(ne); a = ne
p.save(OUT)
print("ER slide", er_i + 1, "-> added", len(new), "slides; total", len(p.slides))
