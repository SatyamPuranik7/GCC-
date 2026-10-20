import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(filename="GCC_Atlas_Pitch_Deck.pptx"):
    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color palette
    NAVY = RGBColor(27, 42, 74)       # #1B2A4A
    TEAL = RGBColor(15, 118, 110)     # #0F766E
    TEAL_BG = RGBColor(240, 253, 250) # #F0FDFA
    IVORY = RGBColor(250, 247, 242)   # #FAF7F2
    WHITE = RGBColor(255, 255, 255)
    CARD_BG = RGBColor(245, 241, 235) # #F5F1EB
    GRAY_TEXT = RGBColor(90, 105, 130)
    AMBER = RGBColor(217, 119, 6)      # #D97706
    RED_ACCENT = RGBColor(185, 28, 28)

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, tag, title, subtitle):
        # Tag pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(4), Inches(0.4))
        tf = tag_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = tag.upper()
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = TEAL

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.6))
        tf = t_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = NAVY

        # Subtitle
        s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(11.7), Inches(0.4))
        tf = s_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = subtitle
        p.font.size = Pt(12)
        p.font.color.rgb = GRAY_TEXT

    # ══════════════════════════════════════════════════════════════════════════
    # SLIDE 1: Title & Executive Summary
    # ══════════════════════════════════════════════════════════════════════════
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, NAVY)

    # Accent decorative bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(0.8), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = TEAL
    bar.line.fill.background()

    # Title box
    tbox = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(2.2))
    tf = tbox.text_frame
    tf.word_wrap = True
    p0 = tf.paragraphs[0]
    p0.text = "GCC ATLAS"
    p0.font.size = Pt(44)
    p0.font.bold = True
    p0.font.color.rgb = WHITE

    p1 = tf.add_paragraph()
    p1.text = "The Single Source of Truth for India's 2,000+ GCC Ecosystem"
    p1.font.size = Pt(22)
    p1.font.color.rgb = RGBColor(20, 184, 166) # Teal Light

    p2 = tf.add_paragraph()
    p2.text = "Product Strategy, Opportunity Evaluation & Working Prototype"
    p2.font.size = Pt(14)
    p2.font.color.rgb = RGBColor(180, 195, 215)

    # Metric KPI cards
    kpis = [
        ("2,000+ Operating GCCs", "$64.6B export revenue by 2026; 50%+ of all global capability centers are in India."),
        ("6–9 Months Latency", "Average delay for enterprise decision makers navigating fragmented, conflicting hearsay."),
        ("45 Cities Seeded", "Empirical data across talent, Randstad salaries, JLL office rents & setup readiness.")
    ]
    for idx, (head, desc) in enumerate(kpis):
        x = Inches(0.8 + idx * 3.95)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(4.0), Inches(3.75), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor(35, 52, 88)
        card.line.color.rgb = RGBColor(50, 75, 120)

        ctbox = s1.shapes.add_textbox(x + Inches(0.2), Inches(4.2), Inches(3.35), Inches(1.8))
        ctf = ctbox.text_frame
        ctf.word_wrap = True
        cp1 = ctf.paragraphs[0]
        cp1.text = head
        cp1.font.size = Pt(16)
        cp1.font.bold = True
        cp1.font.color.rgb = WHITE
        
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.size = Pt(11)
        cp2.font.color.rgb = RGBColor(190, 205, 225)

    # ══════════════════════════════════════════════════════════════════════════
    # SLIDE 2: The Problem Space
    # ══════════════════════════════════════════════════════════════════════════
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, IVORY)
    add_header(s2, "1. Problem Definition", "Anatomy of a $60B Information Asymmetry", "High stakes, conflicting figures, and opaque referral black boxes")

    prob_cards = [
        ("Conflicting Basic Facts", "Reports quote wildly different numbers (1,600 vs 2,200 GCCs). No single public registry tracks which companies operate where, which functions they house, or which tier-2 cities are truly scaling.", RED_ACCENT),
        ("Misaligned Intermediary Chain", "Companies face a disconnected chain: management consultants, local lawyers, tenant brokers, and recruiters. Brokers push high-commission leases; recruiters benefit from high talent churn.", AMBER),
        ("Costly Trial & Error", "New entrants spend $1.5M–$3M on retainers and roadshows, yet end up relying on informal WhatsApp networks, outdated annual PDFs, and golf-course referrals for 10-year commitments.", NAVY)
    ]
    for idx, (h, d, col) in enumerate(prob_cards):
        x = Inches(0.8 + idx * 3.95)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.1), Inches(3.75), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(225, 220, 210)

        tb = s2.shapes.add_textbox(x + Inches(0.25), Inches(2.3), Inches(3.25), Inches(4.1))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"0{idx+1}. {h}"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col

        p_desc = tf.add_paragraph()
        p_desc.text = d
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = GRAY_TEXT

    # ══════════════════════════════════════════════════════════════════════════
    # SLIDE 3: Who Is Hurt & The Quantified Impact
    # ══════════════════════════════════════════════════════════════════════════
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, IVORY)
    add_header(s3, "2. Impact Analysis", "Who is Hurt and What Does It Cost?", "Quantifying the damage across four key ecosystem stakeholders")

    stakeholders = [
        ("Global Enterprises (CFOs / Strategy)", "$1.5M - $3M Wasted Spend", "6–9 month launch delays. Multimillion-dollar risk of picking saturated micro-markets suffering 25%+ annual wage attrition and tight real estate."),
        ("Talent & HR Leaders", "30-45 Days Added Ramp Time", "Miscalculated skill availability and surprise salary inflation. Lack of cross-industry benchmarks leaves hiring budgets severely overrun."),
        ("Emerging Tier-2 Hubs (Coimbatore, Vadodara)", "Billions in Lost FDI", "Tier-2/3 cities offer 30-40% cost arbitrage and high retention, but lose out because their talent and real estate data is completely unindexed."),
        ("Specialized Regional Providers", "High CAC & Trust Deficit", "High-performing boutique legal, compliance, and design firms cannot compete with Big-4 marketing moats, relying on unpredictable referrals.")
    ]
    for idx, (role, impact, detail) in enumerate(stakeholders):
        y = Inches(2.1 + idx * 1.15)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.73), Inches(1.0))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(225, 220, 210)

        tb = s3.shapes.add_textbox(Inches(1.0), y + Inches(0.1), Inches(3.6), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = role
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = NAVY

        tb2 = s3.shapes.add_textbox(Inches(4.8), y + Inches(0.1), Inches(2.5), Inches(0.8))
        tf2 = tb2.text_frame
        tf2.word_wrap = True
        p2 = tf2.paragraphs[0]
        p2.text = impact
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = RED_ACCENT if idx == 0 else TEAL

        tb3 = s3.shapes.add_textbox(Inches(7.4), y + Inches(0.1), Inches(4.9), Inches(0.8))
        tf3 = tb3.text_frame
        tf3.word_wrap = True
        p3 = tf3.paragraphs[0]
        p3.text = detail
        p3.font.size = Pt(10)
        p3.font.color.rgb = GRAY_TEXT

    # ══════════════════════════════════════════════════════════════════════════
    # SLIDE 4: The 4 Solution Options Evaluated
    # ══════════════════════════════════════════════════════════════════════════
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, IVORY)
    add_header(s4, "3. Opportunity Assessment", "Evaluating 4 Product Directions", "Where can a single source of truth disrupt the Indian GCC expansion lifecycle?")

    options = [
        ("Option 1: Location Decision Engine", "GCC Atlas (Chosen Product Wedge)", "Interactive decision engine scoring 45 cities against custom hiring plans, Randstad salary tiers, JLL Grade A rents, and verified center presence.", TEAL, True),
        ("Option 2: Verified GCC Registry", "'LinkedIn for Indian GCCs'", "Database indexing all 2,000+ operating centers, parent corporate entities, employee headcount tiers, functions, and leadership rosters.", NAVY, False),
        ("Option 3: Service Provider Marketplace", "'Clutch / G2 for GCC Vendors'", "Curated ratings, reviews, and transaction platform for legal, EOR, real estate, workplace design, and executive search partners.", NAVY, False),
        ("Option 4: Regulatory & Subsidy Concierge", "'TurboTax for GCC Incorporation'", "Digital compliance workflow mapping state IT subsidies, stamp-duty waivers, ROC entity filing, and NSWS statutory approval pathways.", NAVY, False)
    ]
    for idx, (title, sub, body, col, is_selected) in enumerate(options):
        col_idx = idx % 2
        row_idx = idx // 2
        x = Inches(0.8 + col_idx * 5.95)
        y = Inches(2.1 + row_idx * 2.4)

        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = TEAL_BG if is_selected else WHITE
        card.line.color.rgb = TEAL if is_selected else RGBColor(225, 220, 210)
        card.line.width = Pt(2 if is_selected else 1)

        tb = s4.shapes.add_textbox(x + Inches(0.2), y + Inches(0.15), Inches(5.35), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = title + (" ★ SELECTED WEDGE" if is_selected else "")
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col

        p_sub = tf.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(10)
        p_sub.font.italic = True
        p_sub.font.color.rgb = TEAL if is_selected else GRAY_TEXT

        p_body = tf.add_paragraph()
        p_body.text = body
        p_body.font.size = Pt(10)
        p_body.font.color.rgb = NAVY if is_selected else GRAY_TEXT

    # ══════════════════════════════════════════════════════════════════════════
    # SLIDE 5: Prioritization & The "Strong Why"
    # ══════════════════════════════════════════════════════════════════════════
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, IVORY)
    add_header(s5, "4. Prioritization Framework", "Why Option 1 Was Chosen: The 'Strong Why'", "A rigorous PM evaluation comparing apex leverage, cold-start feasibility, and trust defensibility")

    # 3 Strategic pillars for the decision
    whys = [
        ("1. The Apex Commitment Rule", "Location is the single irreversible decision. An enterprise cannot hire local leadership, sign commercial leases, or file ROC incorporation until geography is fixed. Location controls 80% of downstream multi-year capital outlay."),
        ("2. Overcoming the Cold-Start Trap", "Marketplaces (Option 3) and Registries (Option 2) suffer from brutal chicken-and-egg cold-start friction and pay-to-play ad corruption. Location intelligence can be curated immediately from verified public data (JLL, Randstad, GCCPROs)."),
        ("3. Capturing the Top of the Funnel", "By capturing C-suite leadership (CFOs, Strategy Heads) at Day 0, GCC Atlas earns the right to orchestrate downstream provider RFPs and regulatory filings as high-margin expansion products in subsequent phases.")
    ]
    for idx, (title, text) in enumerate(whys):
        x = Inches(0.8 + idx * 3.95)
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.1), Inches(3.75), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = TEAL
        card.line.width = Pt(1.5)

        tb = s5.shapes.add_textbox(x + Inches(0.2), Inches(2.25), Inches(3.35), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEAL

        p2 = tf.add_paragraph()
        p2.text = text
        p2.font.size = Pt(10)
        p2.font.color.rgb = GRAY_TEXT

    # Scorecard Table
    rows = [
        ("Criterion", "Option 1: Location Engine", "Option 2: GCC Registry", "Option 3: Marketplace", "Option 4: Regulatory Concierge"),
        ("Apex Decision Leverage", "Critical (Day 0 Gateway)", "Moderate (Passive Research)", "Downstream (Day 90+)", "Late Stage (Day 120+)"),
        ("Cold-Start Data Feasibility", "High (Public Verified Seed)", "Low (Data behind NDAs)", "Very Low (2-Sided Trap)", "Low (15 State Portals)"),
        ("Willingness to Pay", "High ($20M Risk De-risking)", "Moderate (Directory Fee)", "High (Transaction Cut)", "Moderate (Legal Retains)"),
        ("Defensibility Against Ad Bias", "High (Deterministic Math)", "Moderate (Stale Scraping)", "Low (Ad-Sponsored Trap)", "Moderate (Policy Shifts)")
    ]
    table_shape = s5.shapes.add_table(len(rows), 5, Inches(0.8), Inches(4.5), Inches(11.73), Inches(2.3))
    table = table_shape.table
    for r_idx, row_data in enumerate(rows):
        for c_idx, cell_data in enumerate(row_data):
            cell = table.cell(r_idx, c_idx)
            cell.text = cell_data
            for p in cell.text_frame.paragraphs:
                p.font.size = Pt(9.5)
                p.alignment = PP_ALIGN.CENTER if c_idx > 0 else PP_ALIGN.LEFT
                if r_idx == 0:
                    p.font.bold = True
                    p.font.color.rgb = WHITE
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = NAVY
                elif c_idx == 1:
                    p.font.bold = True
                    p.font.color.rgb = TEAL
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = TEAL_BG
                else:
                    p.font.color.rgb = GRAY_TEXT

    # ══════════════════════════════════════════════════════════════════════════
    # SLIDE 6: The Solution Architecture & Working Prototype
    # ══════════════════════════════════════════════════════════════════════════
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, IVORY)
    add_header(s6, "5. Solution & Architecture", "GCC Atlas: Deterministic Math + Grounded AI", "A production-grade dual-engine platform connected live to Supabase & OpenRouter")

    arch_cards = [
        ("1. Plan Wizard (User Inputs)", "Collects target functions (Tech, Finance, Ops), 1-yr and 3-yr headcount, seniority ratio, and user-assigned factor weights (1–5)."),
        ("2. Deterministic Ranking Core", "Calculates Min-Max normalized scores across 45 candidate cities. Missing data is never guessed; scores are 100% reproducible."),
        ("3. Side-by-Side Comparison", "Compares 2 to 5 locations across identical metrics: GCCPROs center counts, Randstad salary tiers, and JLL office rates."),
        ("4. Partial Cost Scenario Engine", "Bottom-up modeling combining verified annual FTE salaries and Grade A office leases with an explicit exclusions audit trail."),
        ("5. Ask Atlas AI (OpenRouter)", "Conversational assistant grounded in Supabase records with mandatory source citations and honest refusals for missing data."),
        ("6. Live Database Integration", "16 Supabase tables with 45 cities, 112 location metrics, 77 salary rows, 71 candidate evidences, and NSWS approvals.")
    ]
    for idx, (title, desc) in enumerate(arch_cards):
        col_idx = idx % 3
        row_idx = idx // 3
        x = Inches(0.8 + col_idx * 3.95)
        y = Inches(2.1 + row_idx * 2.3)

        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.75), Inches(2.1))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(225, 220, 210)

        tb = s6.shapes.add_textbox(x + Inches(0.2), y + Inches(0.15), Inches(3.35), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = TEAL

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = GRAY_TEXT

    # ══════════════════════════════════════════════════════════════════════════
    # SLIDE 7: Positioning & 3-Year Vision
    # ══════════════════════════════════════════════════════════════════════════
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, IVORY)
    add_header(s7, "6. Positioning & Roadmap", "Strategic Positioning & 3-Year Growth", "Becoming the definitive Bloomberg for India's Global Capability Centres")

    # Stakeholder Table
    sh_data = [
        ("Stakeholder", "Alternative Used Today", "Why They Choose GCC Atlas"),
        ("Corporate Strategy & CFOs", "Static $200k consultant reports", "Deterministic scenario modeling, audit-ready source citations, 6-minute shortlists."),
        ("Talent & HR Leadership", "Recruiter claims & generic PDFs", "Indexed Randstad benchmarks by seniority tier across 27+ candidate cities."),
        ("Real Estate Directors", "Landlord pitch decks & broker tours", "Quarterly JLL Grade A rent ranges, office vacancy %, and net leasing absorption."),
        ("Tier-2 State Governments", "Expensive foreign delegation roadshows", "Equal-footing discovery in the 45-city candidate set backed by Zinnov lower bounds.")
    ]
    st_table_shape = s7.shapes.add_table(len(sh_data), 3, Inches(0.8), Inches(2.1), Inches(11.73), Inches(2.3))
    st_table = st_table_shape.table
    for r_idx, row_data in enumerate(sh_data):
        for c_idx, cell_data in enumerate(row_data):
            cell = st_table.cell(r_idx, c_idx)
            cell.text = cell_data
            for p in cell.text_frame.paragraphs:
                p.font.size = Pt(9.5)
                if r_idx == 0:
                    p.font.bold = True
                    p.font.color.rgb = WHITE
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = NAVY
                else:
                    p.font.color.rgb = TEAL if c_idx == 2 else GRAY_TEXT

    # Roadmap Phases
    phases = [
        ("Phase 1: Location Intelligence Wedge (Months 1–6)", "Free decision tool, 45 candidate cities, deterministic rankings, Ask Atlas AI. Build dominant search volume and enterprise habit."),
        ("Phase 2: Enterprise SaaS & Verified Directory (Months 6–18)", "Custom role-specific compensation modeling, proprietary pipeline signals, and verified provider delivery profiles ($15k–$35k ARR)."),
        ("Phase 3: India GCC Operating System (Months 18–36)", "Downstream transaction enablement: commercial real estate RFPs, managed legal incorporation sandboxes, and state investment portals.")
    ]
    for idx, (p_title, p_desc) in enumerate(phases):
        x = Inches(0.8 + idx * 3.95)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(4.7), Inches(3.75), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(225, 220, 210)

        tb = s7.shapes.add_textbox(x + Inches(0.2), Inches(4.8), Inches(3.35), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = p_title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEAL

        p2 = tf.add_paragraph()
        p2.text = p_desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = GRAY_TEXT

    # Save presentation
    prs.save(filename)
    print(f"Presentation successfully created: {filename}")

if __name__ == "__main__":
    create_deck("GCC_Atlas_Pitch_Deck.pptx")
