"""Builds the NEOC Technology Company Profile PDF.

This is the formal document that carries Registration Number and TIN —
details that were deliberately removed from the public website (a
crawlable webpage is the wrong place for tax/registration identifiers
that exist for formal verification, not casual visitors) and now live
here instead, for tenders and procurement review.

Usage:
    pip install reportlab
    python scripts/build_company_profile.py

Regenerate this whenever company details, services or content change —
the data below mirrors src/services/defaults.js; keep them in sync.
"""
import datetime
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image,
    HRFlowable, KeepTogether,
)

ROOT = Path(__file__).resolve().parent.parent
LOGO_PATH = str(Path(__file__).resolve().parent / 'assets' / 'logo-full.png')
OUT_PATH = str(ROOT / 'NEOC_Company_Profile.pdf')

INK = colors.HexColor('#0D1B1E')
MUTED = colors.HexColor('#4D6166')
TEAL = colors.HexColor('#0A7C72')
LINE = colors.HexColor('#D2DDDA')
BAND = colors.HexColor('#F6EFE4')
SOFT = colors.HexColor('#EAF4F2')

company = {
    'name': 'NEOC TECHNOLOGY COMPANY LIMITED',
    'tagline': 'Connecting Technology. Empowering Business.',
    'address': 'Kijitonyama Mabatini Road, Dar es Salaam, Tanzania',
    'postal': 'P.O. Box 31317',
    'email': 'neocgr9@gmail.com',
    'phone1': '+255 629 101 982',
    'phone2': '+255 763 989 246',
    'reg': '203431848',
    'tin': '203431848',
    'country': 'Tanzania',
    'md': 'Joniphace Muyama Philmon',
    'established': 'May 2026',
}

about = [
    "NEOC TECHNOLOGY COMPANY LIMITED is a technology-focused company established to provide reliable, "
    "innovative, and cost-effective services to businesses, government institutions, telecom operators, "
    "and individual clients.",
    "We support digital transformation by delivering technology products, infrastructure solutions, "
    "professional technical services, and ongoing IT support. We help organisations improve operational "
    "efficiency, strengthen information security, enhance connectivity, and build dependable technology "
    "environments.",
    "Through a customer-focused approach, technical expertise, and commitment to quality, we aim to "
    "become a trusted technology partner for organisations across Tanzania and the wider East African "
    "region.",
]
vision = ("To become a leading and trusted technology solutions provider in Tanzania and East Africa, "
          "recognised for innovation, reliability, service excellence, and sustainable digital transformation.")
mission = ("To deliver dependable, secure, and innovative technology solutions that enable our clients to "
           "achieve their business objectives, improve productivity, reduce operational risks, and adapt "
           "to the changing digital environment.")
quality = ("We follow appropriate technical standards, manufacturer recommendations, safe installation "
           "practices, and agreed contractual requirements. We protect client information, maintain "
           "confidentiality, and implement technology solutions responsibly.")

values = [
    ('Integrity', 'Conducting business honestly, transparently, and professionally.'),
    ('Innovation', 'Embracing modern technologies to solve business challenges.'),
    ('Customer Focus', 'Understanding client needs and delivering practical solutions.'),
    ('Quality', 'Maintaining high standards in products, installation, and technical services.'),
    ('Reliability', 'Providing dependable solutions and responsive technical support.'),
    ('Security', 'Promoting information security and responsible technology management.'),
    ('Continuous Improvement', 'Developing our skills, services, and operational processes.'),
]

services = [
    ('01', 'IT Infrastructure', 'Servers, computers and the infrastructure work that keeps them running.',
     ['Enterprise servers and server accessories', 'Desktop computers, laptops, and workstations',
      'Enterprise hardware installation and configuration', 'IT infrastructure upgrades and maintenance',
      'Data centre infrastructure solutions']),
    ('02', 'Networking & Telecommunications', 'Reliable communication infrastructure, from design to day-to-day maintenance.',
     ['Enterprise network design and implementation', 'Routers, switches, firewalls, and network accessories',
      'Fibre-optic cabling and structured cabling', 'LAN, WAN, and wireless networking solutions',
      'Network troubleshooting, optimisation, and maintenance']),
    ('03', 'Data Centre & Enterprise Solutions', 'Secure, efficient and scalable IT operations for enterprise environments.',
     ['Data centre equipment supply and installation', 'Server and storage deployment',
      'Enterprise switching and routing', 'Fibre Channel and storage-area networking (SAN)',
      'Preventive maintenance and technical support']),
    ('04', 'IT Consultancy & Technical Support', 'Informed technology decisions and reliable day-to-day IT operations.',
     ['IT infrastructure assessment and planning', 'Technology selection and procurement support',
      'System installation and configuration', 'Network performance troubleshooting',
      'IT maintenance and operational support']),
    ('05', 'Electrical Equipment & Generators', 'Installation, testing and commissioning of electrical equipment and standby generators for uninterrupted power.',
     ['Site preparation and electrical distribution equipment', 'Generator positioning, mounting and power cabling',
      'Earthing, grounding and connection to the main system', 'Automatic transfer switch (ATS) integration',
      'Safety checks, functional and load testing']),
    ('06', 'CCTV & Electric Fence', 'Surveillance and perimeter security to prevent unauthorised access and protect property.',
     ['CCTV installation, configuration and commissioning', 'Fence insulators, brackets and wire tensioning',
      'Energiser installation and power connection', 'Integration with the wider security system']),
    ('07', 'Hardware Supply & Procurement', 'Sourcing suitable technology products to agreed specifications and warranty terms.',
     ['Servers, storage, and computing equipment', 'Network switches, routers, and firewalls',
      'Fibre-optic and structured cabling materials', 'IT peripherals and office technology equipment']),
]

markets = [
    'Telecommunications companies', 'Government & public sector', 'Banks & financial services',
    'Corporate & private enterprises', 'Internet service providers', 'Educational institutions',
    'Healthcare organisations', 'Data centres & tech providers', 'Small & medium enterprises',
]

why = [
    ('Customer-oriented solutions', "We start from each client's requirements and recommend technology that fits them."),
    ('Technical capability', 'Professional installation, configuration, troubleshooting, and maintenance.'),
    ('Reliable products', 'Equipment sourced to meet agreed technical requirements and quality expectations.'),
    ('Cost-effective delivery', 'Practical solutions that balance performance, reliability, and budget.'),
    ('Security and reliability', 'Protecting information systems and maintaining business continuity.'),
    ('Long-term partnerships', 'Relationships built on trust, accountability, communication, and dependable support.'),
]

approach = [
    ('Requirements Assessment', "Understand the client's operational needs and technical environment."),
    ('Solution Design', 'Develop an appropriate technical solution and implementation plan.'),
    ('Procurement & Preparation', 'Identify suitable products and prepare the required resources.'),
    ('Implementation', 'Install, configure, and integrate the agreed solution.'),
    ('Testing & Handover', 'Verify functionality and provide technical documentation.'),
    ('Maintenance & Support', 'Provide agreed follow-up support and maintenance services.'),
]

# ---------------------------------------------------------------- styles ---
styles = getSampleStyleSheet()
eyebrow = ParagraphStyle('eyebrow', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9,
                          textColor=TEAL, spaceAfter=4)
h2 = ParagraphStyle('h2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=14.5, textColor=INK,
                     spaceBefore=18, spaceAfter=10)
h3 = ParagraphStyle('h3', parent=styles['Heading3'], fontName='Helvetica-Bold', fontSize=11, textColor=INK,
                     spaceAfter=3)
body = ParagraphStyle('body', parent=styles['Normal'], fontName='Helvetica', fontSize=10, textColor=INK,
                       leading=15, spaceAfter=8)
muted = ParagraphStyle('muted', parent=body, textColor=MUTED, fontSize=9.5, leading=14)
bullet = ParagraphStyle('bullet', parent=body, fontSize=9.5, leading=14, spaceAfter=3, leftIndent=10)
tagline_style = ParagraphStyle('tagline', parent=body, fontName='Helvetica-Oblique', fontSize=11,
                                textColor=MUTED, spaceAfter=0)
table_label = ParagraphStyle('tlabel', parent=body, fontName='Helvetica-Bold', fontSize=8.5, textColor=MUTED,
                              spaceAfter=0)
table_value = ParagraphStyle('tvalue', parent=body, fontSize=9.5, textColor=INK, spaceAfter=0, leading=13)

story = []

# ----------------------------------------------------------------- cover ---
story.append(Image(LOGO_PATH, width=70 * mm, height=70 * mm * (632 / 1818)))
story.append(Spacer(1, 4 * mm))
story.append(Paragraph(company['tagline'], tagline_style))
story.append(Spacer(1, 10 * mm))
story.append(Paragraph('COMPANY PROFILE', eyebrow))
story.append(Paragraph('Prepared for tenders, procurement review and formal partner verification', muted))
story.append(Paragraph(datetime.date.today().strftime('%B %Y'), muted))
story.append(Spacer(1, 6 * mm))
story.append(HRFlowable(width='100%', thickness=1, color=LINE, spaceAfter=10))

# --------------------------------------------------- corporate information
story.append(Paragraph('Corporate Information', h2))
rows = [
    ('Company name', company['name']),
    ('Registration number', company['reg']),
    ('TIN', company['tin']),
    ('Country of registration', company['country']),
    ('Physical address', company['address']),
    ('Postal address', company['postal']),
    ('Telephone', f"{company['phone1']}  /  {company['phone2']}"),
    ('Email', company['email']),
    ('Managing Director', company['md']),
    ('Year established', company['established']),
]
table_data = [[Paragraph(k, table_label), Paragraph(v, table_value)] for k, v in rows]
t = Table(table_data, colWidths=[42 * mm, 118 * mm])
t.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LINEBELOW', (0, 0), (-1, -2), 0.5, LINE),
    ('LEFTPADDING', (0, 0), (0, -1), 0),
]))
story.append(t)

# ------------------------------------------------------------------ about
story.append(Paragraph('About Us', h2))
for p in about:
    story.append(Paragraph(p, body))

vm_data = [[
    Paragraph('<font color="#0A7C72"><b>VISION</b></font><br/><br/>' + vision, body),
    Paragraph('<font color="#0A7C72"><b>MISSION</b></font><br/><br/>' + mission, body),
]]
vm = Table(vm_data, colWidths=[80 * mm, 80 * mm])
vm.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('BACKGROUND', (0, 0), (0, 0), SOFT),
    ('BACKGROUND', (1, 0), (1, 0), BAND),
    ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
story.append(Spacer(1, 2 * mm))
story.append(vm)
story.append(Spacer(1, 4 * mm))

# ------------------------------------------------------------- core values
story.append(Paragraph('Core Values', h2))
val_rows = []
for i in range(0, len(values), 2):
    pair = values[i:i + 2]
    cells = []
    for t_, d_ in pair:
        cells.append(Paragraph(f'<font color="#D97F15"><b>&#9632;</b></font> <b>{t_}</b><br/>{d_}', bullet))
    if len(cells) == 1:
        cells.append('')
    val_rows.append(cells)
vt = Table(val_rows, colWidths=[80 * mm, 80 * mm])
vt.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
story.append(vt)

# --------------------------------------------------------------- services
story.append(Paragraph('Products &amp; Services', h2))
story.append(Paragraph(
    'All equipment supplied is subject to product specifications, availability, warranty conditions, '
    'and agreed procurement terms.', muted))
story.append(Spacer(1, 2 * mm))
for num, title, summary, items in services:
    block = []
    block.append(Paragraph(f'<font color="#0A7C72">{num}</font>&nbsp;&nbsp;<b>{title}</b>', h3))
    block.append(Paragraph(summary, muted))
    item_text = '  &bull;  '.join(items)
    block.append(Paragraph(item_text, bullet))
    block.append(Spacer(1, 3 * mm))
    story.append(KeepTogether(block))

# ---------------------------------------------------------------- markets
story.append(Paragraph('Sectors We Serve', h2))
story.append(Paragraph('  &bull;  '.join(markets), body))

# ------------------------------------------------------------------- why
why_rows = []
for i in range(0, len(why), 2):
    pair = why[i:i + 2]
    cells = []
    for t_, d_ in pair:
        cells.append(Paragraph(f'<b>{t_}</b><br/>{d_}', bullet))
    if len(cells) == 1:
        cells.append('')
    why_rows.append(cells)
wt = Table(why_rows, colWidths=[80 * mm, 80 * mm])
wt.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
story.append(KeepTogether([Paragraph('Why Choose NEOC', h2), wt, Paragraph(quality, muted)]))

# --------------------------------------------------------------- approach
story.append(Paragraph('Our Delivery Approach', h2))
ap_data = []
for i, (t_, d_) in enumerate(approach, start=1):
    ap_data.append([Paragraph(f'<font color="#D97F15"><b>{i}</b></font>', table_label),
                     Paragraph(f'<b>{t_}</b> &ndash; {d_}', body)])
apt = Table(ap_data, colWidths=[8 * mm, 152 * mm])
apt.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(apt)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 16 * mm, 190 * mm, 16 * mm)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MUTED)
    left = f"{company['name']}  ·  {company['phone1']}  ·  {company['email']}"
    canvas.drawString(20 * mm, 11 * mm, left)
    canvas.drawRightString(190 * mm, 11 * mm, f'Page {doc.page}')
    canvas.restoreState()


doc = SimpleDocTemplate(OUT_PATH, pagesize=A4,
                         topMargin=20 * mm, bottomMargin=22 * mm,
                         leftMargin=20 * mm, rightMargin=20 * mm,
                         title='NEOC Technology Company Profile',
                         author='NEOC Technology Company Limited')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print('Wrote', OUT_PATH)
