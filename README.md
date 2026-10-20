# GCC Atlas 🧭
> **Evidence-Backed Location Intelligence for Global Capability Centres (GCCs) in India**  
> *A decision-support application and executive pitch deck prototype for India's 2,000+ GCC ecosystem.*

---

## 📌 Executive Summary

India is home to **2,000+ Global Capability Centres (GCCs)** driving over **$64 Billion in export revenue**, yet enterprise location decisions remain plagued by fragmented data, conflicting reports (1,600 vs 2,200 GCCs), and broker commissions. 

**GCC Atlas** brings clarity by unifying verified empirical data across **45 candidate Indian cities** into an interactive, deterministic decision engine. Rather than relying on static slide decks or black-box rankings, GCC Atlas normalizes candidate locations against a company's specific headcount, seniority mix, and business priorities.

---

## 🚀 Key Features

- **🎯 Interactive Plan Wizard (5 Steps):** Configure business function mix (Tech, Finance, Ops), 1-year and 3-year headcount, and custom factor weights (1–5).
- **📊 Deterministic Recommendation Engine:** Mathematical normalization across 45 cities with transparent scoring, coverage bars, and source citations. AI explains the trade-offs; math calculates the rank.
- **⚖️ Side-by-Side Comparison Matrix:** Compare 2 to 5 candidate cities across identical metric definitions and units. Missing data points are highlighted rather than assumed to be zero.
- **🏢 Deep City Profiles (6 Tabs):** Overview, Randstad salary benchmarks across 3 seniority tiers, JLL Grade A office rents and vacancy rates, verified GCC center counts, regional service providers, and NSWS regulatory checklists.
- **💰 Partial Operating Cost Calculator:** Model bottom-up 1-year people CTC and Grade A office lease estimates with an explicit exclusions audit trail.
- **🤖 Ask Atlas (AI Assistant):** Conversational AI grounded in database records via OpenRouter (Gemini Flash 1.5). Features strict citation requirements and honest refusals when data is unavailable.
- **📑 Integrated Executive Pitch Deck:** Built-in presentation accessible at `/deck` covering the problem, opportunity prioritization scorecard, wedge strategy, and multi-stakeholder positioning.

---

## 🗄️ Curated Dataset & Sources

The project connects live to a 16-table Supabase PostgreSQL database:
- **GCCPROs:** Verified GCC operating center counts across 37+ markets.
- **NASSCOM & Zinnov:** National GCC landscape and FY26 emerging hub lower bounds (Coimbatore 60+, Ahmedabad 45+, Kochi 35+, Vadodara 35+).
- **Randstad Salary Trends 2024–25:** Cross-industry annual CTC across junior (0–5 yrs), middle (6–14 yrs), and senior (15+ yrs) bands across 27 cities.
- **JLL India (Q1 2025):** Grade A office rents, vacancy rates, net absorption, and leasing activity.
- **GCC Explorer:** Dated live job-posting activity signal across major metropolitan hubs.
- **DPIIT & NSWS:** National Single Window System statutory approval pathways and foreign investment guidelines.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
- **State & Queries:** Zustand (persisted state), TanStack React Query v5
- **Database:** Supabase (PostgreSQL with REST API)
- **AI / LLM Layer:** OpenRouter API (Google Gemini Flash 1.5) with streaming RAG context
- **Deployment:** Vercel (configured with SPA rewrites in `vercel.json`)

---

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/gcc-atlas.git
cd gcc-atlas
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials in `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production
```bash
npm run build
npm run preview
```

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub (ensure `.env` is ignored).
2. Go to [Vercel](https://vercel.com/new) and import the repository.
3. Framework preset will automatically be detected as **Vite**.
4. In **Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENROUTER_API_KEY`
5. Click **Deploy**.
