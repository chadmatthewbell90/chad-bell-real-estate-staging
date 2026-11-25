# Chad Bell Real Estate website

Static one-page site for Chad Bell, estate agent at Acutts Bluff (The Bluff, Durban). Its only job is to get **homeowners who want to sell** to contact Chad for a valuation. It is not a listings site: never add property listings, search, or buyer-focused content.

Live at https://www.chadbellrealestate.co.za/ (bare domain redirects to www). The people working on it are not developers: explain git, deploys and DNS in plain terms.

## Workflow

- **Staging first, always (owner's rule, 2026-11-24).** Make the change, commit it locally on `main`, run `scripts/deploy-staging.sh`, and send https://staging.chadbellrealestate.co.za for review. **Do not `git push` to `origin main` (which publishes the live site) until Chad explicitly says to publish live** ("push it live", "publish", "go live"). Approval covers the changes he has seen on staging, not later ones.
- Approved commits are pushed together; `git log origin/main..main` lists what is waiting for approval. Keep each change in its own commit so it can be reverted on its own.
- **Undo:** "revert the last change" means `git revert` the relevant commit, redeploy staging, and push only once approved (or straight away if the change being undone is already live and Chad asks for that).
- `git pull --rebase` before making changes; Cameron (`cameronferreira`, collaborator) also pushes to this repo.
- The repos belong to **chadmatthewbell90** (this Mac is signed in to GitHub as that account, with admin rights). Commits from this Mac use "Chad Bell" with the account's GitHub no-reply address (set in this repo's git config).

## Copy voice

- First person, as Chad: "I", "me", "my" (e.g. "I visit your home"). Headings and buttons may address the seller directly ("Get my free valuation"). Use "Chad" in the third person only in the nav label "Why Chad", page titles, meta, alt text and JSON-LD.
- Audience is serious sellers on The Bluff and surrounding Durban South suburbs. Lead with what sets Chad apart: social media marketing, 16 years' experience, Best Listing Agent nationwide (current holder, most recently 2025), voted best real estate agent on The Bluff twice by the community (Chad's words, 2026-11-25; no years or poll name given, so don't add any), Acutts Bluff management team.
- No promises of sale prices or selling times, and no made-up numbers: no invented sales counts, follower counts, reviews or testimonials. Add those only when Chad supplies real ones.
- South African English (valuation, suburb, transfer, conveyancer, bond).

## Structure

- `index.html`: the whole site, in sections: hero, marquee, stats, statement, `#why`, `#marketing`, `#award`, `#process`, `#areas`, `#faq`, `#valuation` (form + contact).
- `privacy.html` (served at `/privacy`; link to `privacy`, not `privacy.html`), `404.html`.
- `css/style.css`: design tokens at the top, plus the mobile alignment rules in its header comment.
- **Look: boho coastal town** (owner's direction, 2026-11-24). The Bluff is a beach suburb, so keep it sunny and earthy: cream/sand backgrounds, terracotta (`--clay`) for buttons and accent words, sun mustard, sea-glass, and ocean teal for the dark sections. Motifs: the arched window onto an animated beach scene in the hero, wave dividers (`.wave-top`, painted in the section's own colour), swaying palm-frond shadows, the sunburst award seal, dashed lines, Caveat handwritten notes. Don't drift back to dark/tech styling.
- Fonts: Fraunces with the SOFT axis (headings; italic for `<em>` accent words), DM Sans (body), Caveat (short handwritten notes and the signature only).
- `js/main.js`: all motion (word-split hero heading, scroll reveals, scroll-lit statement, count-ups, parallax, magnetic buttons, phone tilt, process line) and the valuation form. Every effect is off under `prefers-reduced-motion`.
- **All paths are relative** (`css/style.css`, `privacy`, `#valuation`) because the site lives under the `/chad-bell-real-estate/` sub-path. `404.html` is the exception: it uses `<base href="/chad-bell-real-estate/">` because GitHub serves it at any depth.
- `scripts/deploy-staging.sh` publishes the staging copy. `_config.yml` keeps `scripts/` and this file off the live site.
- Images: `favicon-48.png`, `favicon-192.png`, `apple-touch-icon.png` (CB monogram) and `og-image.jpg` (1200×630 share image) were generated from HTML. In the hero arch, a hand-drawn cartoon of Chad (`.beach__chad`: bald, brown eyes behind clear-frame reading glasses (no sunglasses), dark beard, red shirt, cream long pants, waving) stands on the sand beside a small Acutts SOLD board (`.beach__sign`), all inline SVG in the beach scene, drawn from his selfie `~/Desktop/472678029_…_n.jpg`. Chad asked for no Acutts feather flag in the arch (2026-11-25). (The earlier photo cut-out is in git history, commit f2bff02.) The hero phone plays Chad's photos like Instagram stories (`images/story-1.jpg` … `story-6.jpg`, 412×600 crops of his Desktop photos: two Bluff aerials, then four homes; 5s each with a slow pan, progress bars on top; `js/main.js` advances them and lazy-loads slides 2–6 after page load). Keep the crops clear of street numbers and number plates. The three phones in `#marketing` play Chad's reels (`videos/reel-1..3.mp4`, 360×640 H.264, silent, ~15s loops, ~1.7MB each, with `.jpg` posters), converted from his iPhone .MOV files in ~/Downloads with an AVFoundation Swift script (no ffmpeg on this Mac). `js/main.js` loads and plays them only while the section is on screen and drives each phone's progress bar from the video.

## Valuation form

No server of our own. On a valid submit, `js/main.js`:
1. sends the lead as JSON (`navigator.sendBeacon`, text/plain) to a **Google Apps Script web app** (`LEADS_URL`) that appends a row to Chad's Google Sheet "valuation leads" (first tab: Received, Name, Phone, Property area, Property type, Selling timeline, Notes, Sent from). The script's code is `scripts/valuation-leads.gs`; it lives in the Sheet (Extensions → Apps Script) under Chad's Google account, deployed as Web app, execute as Me, access Anyone. If he changes the code he must **Deploy → Manage deployments → edit → New version** (keeps the same URL); a *new* deployment gets a new URL that must go into `LEADS_URL`.
2. pushes the `valuation_form_submit` dataLayer event (no personal details);
3. opens `wa.me/27845206603` with the details filled in.

A hidden honeypot field (`website`, `.form__trap`) drops bot submissions. "Sent from" is the page's hostname, so test leads from staging show `staging.chadbellrealestate.co.za`. The privacy policy describes all this (Google Sheet only Chad can open); update it if the Sheet is shared or leads go anywhere else.

## Contact details (from Chad's public Acutts profile)

- Phone / WhatsApp 084 520 6603 (`+27845206603`), email chadbell@acutts.co.za
- Facebook https://www.facebook.com/Chadbellacuttsbluff
- PPRA FFC 1157352 (in the footer; property practitioners must show it)

## Domain, hosting and DNS

- **Domain:** chadbellrealestate.co.za, registered and DNS-hosted at **domains.co.za** (nameservers ns1–ns4.tld-ns.*). Chad edits DNS himself in the domains.co.za client area; never ask for or enter his login. No email runs on this domain (Chad's email is @acutts.co.za), so there are no MX records to protect.
- **Live:** `www.chadbellrealestate.co.za` (since 2026-11-24), GitHub Pages from repo `chadmatthewbell90/chad-bell-real-estate`, HTTPS enforced; the bare domain and the old github.io address redirect to www. The old Google Sites page is retired.
- **Staging:** `staging.chadbellrealestate.co.za`, GitHub Pages from repo `chadmatthewbell90/chad-bell-real-estate-staging` (custom domain already set there). Published only by `scripts/deploy-staging.sh`, which adds noindex, a "Staging preview" badge and the staging CNAME.
- **DNS records needed at domains.co.za:** A `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; CNAME `www` → `chadmatthewbell90.github.io`; CNAME `staging` → `chadmatthewbell90.github.io`. Remove the old A record 169.239.219.58, the web forwarding on the bare domain, and the www CNAME to ghs.googlehosted.com.
- Staging also has HTTPS enforced. If a certificate ever stalls on `none`, clear and re-set the custom domain in that repo's Pages settings (`gh api -X PUT repos/<repo>/pages -f cname=…`), then redeploy.
- **Owner's guide / operations guide** (plain-English handover for Chad): https://claude.ai/artifact/JsUzKCeCP8w8TujwuatNCZ. It's a Claude Doc (doc id `90b7cb46-535c-4303-9c2e-73fc82cc9e9a`), edited with the Claude Docs tools, never by publishing. **Chad's rule (2026-11-25): update it with every relevant change, without being asked.** When a change goes live, add a row at the top of its "Change log" table (date · plain-English change); when a change touches how Chad operates the site (accounts, the form/leads Sheet, tracking, things to leave alone, troubleshooting), update that section too. Changes still on staging can be logged as "(on staging, waiting to go live)" and the note removed once published.

## Tracking

- **Google Tag Manager `GTM-WZKJT6NR`** (added 2026-11-24) on all three pages: in `<head>` between `<!-- Google Tag Manager -->` … `<!-- End Google Tag Manager -->`, and the noscript right after `<body>` in matching comments, so the staging script strips both (staging sends no data to GTM).
- The head block sets **Google Consent Mode** to denied by default and re-grants it for returning visitors who accepted. `js/consent.js` shows the cookie notice (Accept / No thanks), stores the choice in `localStorage` (`cb-cookies`) and sends the consent update plus a `cookie_consent_granted` dataLayer event. Tags inside GTM (GA4, Meta pixel, etc.) are set up in the GTM web console, not in this repo; non-Google tags should be set to require consent there.
- The privacy policy's "Cookies and tracking" section describes this; update it if what GTM loads changes in kind.

## Gotchas

- The hero heading is split into words by JS. The `<em>` phrase (with its hand-drawn squiggle SVG) is animated as one unit on purpose: splitting inside it would break the squiggle and any `background-clip: text` effect.
- Sections that need horizontal clipping use `overflow-x: clip`, not `overflow: hidden`, so the wave divider above them stays visible.
- Headless Chrome won't make a window narrower than about 500px. To check the 390px mobile layout, screenshot a wrapper page with the site in a 390px-wide iframe.
