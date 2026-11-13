# RealAutomation — website

Static site. No build step, no framework, no dependencies. Open `index.html` in a browser and it works.

```
index.html              Home
what-we-build.html      Services in detail
work.html               Case studies
about.html              Mike's story
contact.html            Enquiry form
404.html                Not-found page
assets/css/styles.css   All styling (edit colours at the top)
assets/js/main.js       Nav, scroll reveal, form handling
assets/img/             Favicon + social share image
_headers                Cloudflare Pages caching + security headers
robots.txt, sitemap.xml SEO
```

---

## 1. Before you go live — six things to change

| # | What | Where |
|---|------|-------|
| 1 | **Email address.** Everything currently points at `info@realautomationai.com`. If that mailbox doesn't exist, create it or swap the address. | Find & replace across all `.html` files |
| 2 | **Form endpoint.** The contact form has `action="REPLACE_ME"`. Until you change it, submissions open the visitor's email client instead — functional, but you'll lose people. See §4. | `contact.html` |
| 3 | **Phone number.** Not published anywhere yet, deliberately. Add it to the Direct card if you want it public. | `contact.html` |
| 4 | **Client names.** Case studies are anonymised ("London gastropub", "Bermuda transport operator"). Swap in real names where you have permission — it's one line per card. | `work.html`, `index.html` |
| 5 | ~~Build prices.~~ **Done** — "From £450" now appears in the hero strip, the pricing card, the pricing footnote and a new FAQ answer. Change all four together if the figure moves. | `index.html` |
| 6 | **Videos.** Three empty slots on the home page, three on Work. See §5. | `index.html`, `work.html` |

Find & replace is quickest from the terminal:

```bash
cd realautomation
grep -rl "info@realautomationai.com" . | xargs sed -i '' 's/info@realautomationai.com/your@address.com/g'   # macOS
```

---

## 2. Push to GitHub

```bash
cd realautomation
git init
git add .
git commit -m "RealAutomation website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/realautomation-site.git
git push -u origin main
```

(Create the empty repo on github.com first — no README, no .gitignore, since you already have both.)

---

## 3. Deploy on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub, pick `realautomation-site`.
3. Build settings — this is the bit people get wrong:
   - **Framework preset:** `None`
   - **Build command:** *leave completely empty*
   - **Build output directory:** `/`
4. **Save and Deploy.** About thirty seconds later you'll have `realautomation-site.pages.dev`. Check it works before touching DNS.

Every `git push` to `main` redeploys automatically.

### Pointing your GoDaddy domain at it

**Option A — move nameservers to Cloudflare (recommended).** Cleanest result: apex and www both work, free SSL, caching and analytics included.

1. In Cloudflare: **Add a site** → enter `realautomationai.com` → Free plan. Cloudflare imports your existing DNS records — check your email and any other records came across.
2. Cloudflare shows you two nameservers, e.g. `ana.ns.cloudflare.com`.
3. In GoDaddy: **My Products** → your domain → **DNS** → **Nameservers** → **Change** → **I'll use my own nameservers** → paste both.
4. Back in Pages → your project → **Custom domains** → add `realautomationai.com` and `www.realautomationai.com`. Cloudflare creates the records itself.

Nameserver changes take anywhere from a few minutes to 24 hours.

**Option B — keep GoDaddy DNS.** Works, but GoDaddy can't put a CNAME on the bare domain, so the apex needs forwarding.

1. Pages → **Custom domains** → add `www.realautomationai.com`.
2. GoDaddy → **DNS** → **Add record**:
   - Type `CNAME`, Name `www`, Value `realautomation-site.pages.dev`, TTL 1 hour
3. GoDaddy → **Domain Settings** → **Forwarding** → forward `realautomationai.com` → `https://www.realautomationai.com`, **permanent (301)**, forward with masking **off**.

SSL is issued automatically either way. If the site shows a certificate warning in the first hour, that's normal — it's still being issued.

---

## 4. Making the contact form actually send

Simplest option, free tier, five minutes — **Formspree**:

1. Sign up at formspree.io, create a form, copy the endpoint (`https://formspree.io/f/abcdwxyz`).
2. In `contact.html`, change `action="REPLACE_ME"` to that URL.
3. Push. Done — submissions land in your inbox, and the page stays on-site with a thank-you message.

A honeypot field is already in place, so most bot spam is dropped silently.

If you'd rather keep everything inside Cloudflare, the alternative is a Pages Function at `functions/api/contact.js` posting to an email API. More control, more setup — say the word and I'll write it.

---

## 5. Adding the videos

Each slot is a `<figure class="video">` with a commented-out `<video>` tag directly above the placeholder. To use it:

1. Put the file in `assets/video/` (keep it under ~15 MB — compress with HandBrake if needed).
2. Delete the `<div class="video-placeholder">…</div>` block.
3. Uncomment the `<video>` line and point `src` at your file.

```html
<video controls preload="metadata" poster="/assets/img/poster-onboarding.jpg">
  <source src="/assets/video/onboarding.mp4" type="video/mp4">
</video>
```

For a HeyGen or YouTube video, use an iframe in the same place instead:

```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Onboarding walkthrough"
        allow="accelerated-media; fullscreen" loading="lazy"></iframe>
```

Screen recordings of the apps will outperform a talking head for the two walkthrough slots. The 60-second intro is the one worth putting a face to.

---

## 6. Editing the look

Everything is at the top of `assets/css/styles.css`:

```css
--accent:  #C25A2E;   /* terracotta — buttons, links, accents */
--ink:     #11161C;   /* dark sections */
--bg-soft: #F7F5F2;   /* warm off-white bands */
```

Change `--accent` and the whole site follows. Fonts are Fraunces (headings) and Inter (body), loaded from Google Fonts in each page's `<head>`.

---

## 7. After launch

- **Google Search Console** — add the property, submit `https://www.realautomationai.com/sitemap.xml`.
- **Analytics** — Cloudflare Web Analytics is free and needs no cookie banner. Pages project → Analytics → enable, then paste the snippet before `</body>` on each page.
- **Google Business Profile** — worth having for local hospitality searches.
