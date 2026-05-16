# LisBom Limited — Website

A clean, production-ready one-page website for LisBom Limited.

## 🚀 Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `lisbom-website`)
2. Upload all files keeping the folder structure intact:
   ```
   index.html
   css/style.css
   js/main.js
   README.md
   ```
3. Go to **Settings → Pages**
4. Under **Source**, select `main` branch and `/ (root)` folder
5. Click **Save** — your site will be live at `https://yourusername.github.io/lisbom-website`

## 📁 File Structure

```
lisbom/
├── index.html        ← Main page
├── css/
│   └── style.css     ← All styles
├── js/
│   └── main.js       ← Scroll effects, nav, form
└── README.md
```

## 📬 Connecting the Contact Form

The form is currently set up for easy integration. Pick one:

### Option A — Formspree (free, no backend needed)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form and copy your form ID
3. In `js/main.js`, replace the `setTimeout` block with:
```js
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: fname + ' ' + lname,
    email: email,
    company: document.getElementById('company').value,
    industry: document.getElementById('industry').value,
    message: document.getElementById('message').value,
  })
}).then(() => {
  form.style.display = 'none';
  formSuccess.classList.add('show');
});
```

### Option B — Netlify Forms (if hosting on Netlify)
Add `netlify` attribute to the `<form>` tag in `index.html`:
```html
<form id="contactForm" name="contact" netlify novalidate>
```

### Option C — Calendly (recommended)
Replace the form section with a Calendly embed:
```html
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/YOUR_USERNAME" 
     style="min-width:320px;height:700px;">
</div>
<script src="https://assets.calendly.com/assets/external/widget.js"></script>
```

## ✏️ Customisation

- **Colours**: Edit CSS variables at the top of `css/style.css`
- **Logo**: Replace `LisBom.` text in nav/footer with an `<img>` tag if you have a logo file
- **Fonts**: Loaded from Google Fonts in `<head>` — swap in `index.html` and update `--font-display` / `--font-body` variables
- **Contact email**: Add your email as a `mailto:` fallback link in the contact section

## 🌐 Custom Domain

1. Add a `CNAME` file to the repo root containing your domain:
   ```
   lisbom.co.uk
   ```
2. Point your domain's DNS to GitHub Pages (see GitHub docs)

---

Built for LisBom Limited · UK-Based Remote Operations
