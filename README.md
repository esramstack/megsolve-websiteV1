# Megsolve website

Static site. No build step, no dependencies, no server code.

## Contents

```
index.html            Home
services.html         Services (7 service lines)
case-studies.html     Case study index (18, filterable)
team.html             The Squad + origin story
contact.html          Contact + enquiry form

case-*.html           18 individual case study pages

assets/
  style.css           All styling
  site.js             All behaviour
  logo.png            Wordmark
  favicon.png         Favicon

vercel.json           Clean URLs + asset caching
robots.txt
sitemap.xml
```

## Deploying

### Vercel
Drag the folder onto the Vercel dashboard, or:

```bash
npx vercel --prod
```

No framework preset needed. Choose **Other** if prompted. `vercel.json` enables
clean URLs, so `/services` works as well as `/services.html`.

### Netlify
Drag the folder onto the Netlify dashboard, or:

```bash
npx netlify deploy --prod --dir .
```

### GitHub Pages / any static host
Upload the folder contents to the web root. Nothing else required.

## Before going live

1. **Update the domain** in `sitemap.xml` and `robots.txt` if it is not
   `megsolve.com`.
2. **Check the contact form.** It opens WhatsApp with the message pre-filled
   (`+92 336 199 3378`). There is no backend. If you want emailed submissions,
   swap the handler in `assets/site.js` for a form service such as Formspree.
3. **Team bios.** Six of the seven roster entries read "Full profile and
   background coming soon." in `team.html`.
4. **POS case studies.** `case-pos-database.html`, `case-pos-aggrid.html` and
   `case-pos-architecture.html` have no metrics and are attributed to
   "POS Platform, Pakistan". Add real figures and the client name.
5. **Case study images.** No screenshots are embedded anywhere yet.

## Editing

Everything is plain HTML. To change styling site-wide, edit `assets/style.css`.
To change behaviour (nav, filters, counters, background canvas), edit
`assets/site.js`. Both are shared by every page.

Design tokens live at the top of `style.css` as CSS custom properties:
paper `#F7F8FA`, ink `#0E1526`, cobalt `#2547E8`, mint `#0EA88F`.
