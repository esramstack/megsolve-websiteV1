# Megsolve website

23 self-contained HTML pages. Every page has its CSS, JavaScript, logo and
favicon embedded inside it. There is no assets folder, no build step, no
dependencies and no configuration.

## Deploying

Upload all files to the web root. That is the whole procedure.

- **Vercel** — drag this folder onto the dashboard, or `npx vercel --prod`.
  If asked for a framework, choose **Other**.
- **Netlify** — drag the folder on, or `npx netlify deploy --prod --dir .`
- **cPanel / FTP / GitHub Pages** — copy the files into the web root.

`index.html` is the home page. Every link uses an explicit `.html` extension,
so no rewrite rules or clean-URL settings are required.

## Checking it worked

Open the deployed home page. You should see a white page with a faint blue
drafting grid behind the headline and a dark navigation bar at the top.

If you instead see unstyled black text on white, the files were not uploaded
to the location being served. Nothing is loaded from outside each file, so
styling cannot fail for any other reason.

## Files

```
index.html          Home
services.html       7 service lines
case-studies.html   18 case studies, filterable
team.html           The Squad + origin story
contact.html        Contact + enquiry form
case-*.html         18 individual case study pages
robots.txt
sitemap.xml         Update the domain if it is not megsolve.com
```

## Before going live

1. Six of seven team bios still read "Full profile and background coming soon."
2. The three POS case studies carry no metrics and are attributed to
   "POS Platform, Pakistan". Add real figures and the client name.
3. No case study screenshots are embedded yet.
4. The contact form opens WhatsApp (+92 336 199 3378). There is no backend.
5. `sitemap.xml` assumes the domain is megsolve.com.

## Editing

Each page carries its own copy of the stylesheet in a `<style>` block and the
script in a `<script>` block. A site-wide style change means editing every
file, which is the trade made for pages that cannot break.

If you would prefer a shared `assets/style.css` and `assets/site.js` instead,
ask and I will repackage it that way.
