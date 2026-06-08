# Casa by Hyelni — Netlify Setup Guide

## Folder Structure

```
casa-by-hyelni/
├── index.html                  ← Main website
├── build.js                    ← Build script (reads content/ → injects into index.html)
├── netlify.toml                ← Tells Netlify to run build.js before deploying
├── package.json
├── admin/
│   ├── index.html              ← Admin panel (Netlify CMS login page)
│   └── config.yml              ← CMS field definitions
├── content/
│   └── apartments/
│       ├── the-jabi-penthouse.md      ← Sample apartment
│       └── utako-executive-suite.md   ← Sample apartment
└── static/
    └── uploads/                ← Where owner's uploaded photos/videos go
```

---

## Step 1 — Push to GitHub

1. Create a new repo on GitHub (e.g. `casa-by-hyelni`)
2. Upload all these files keeping the folder structure exactly as above
3. Make sure the repo is **public** (or private — both work with Netlify)

---

## Step 2 — Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign up / log in
2. Click **"Add new site" → "Import an existing project"**
3. Connect to GitHub and select the `casa-by-hyelni` repo
4. Build settings (should auto-detect from netlify.toml):
   - **Build command:** `node build.js`
   - **Publish directory:** `.`
5. Click **Deploy site**

Your site will be live at something like `casa-hyelni.netlify.app`. You can add a custom domain (e.g. `casabyhyelni.com`) in Netlify → Domain settings.

---

## Step 3 — Enable Netlify Identity (for admin login)

1. In Netlify dashboard → **Identity** tab → click **Enable Identity**
2. Under **Registration** → set to **Invite only** (so only the owner can log in)
3. Click **Invite users** → enter the owner's email
4. Under **Services** → **Git Gateway** → click **Enable Git Gateway**

The owner will receive an email to set their password.

---

## Step 4 — Access the Admin Panel

The owner goes to:
```
https://your-site.netlify.app/admin
```

They log in with the email/password from the invite. Then they can:

- Click **"New Apartments"** to add a listing
- Fill in: name, area (dropdown), price, bedrooms, bathrooms, description
- Upload multiple **photos** (drag & drop)
- Upload a **video** tour (optional, MP4)
- Toggle **Available** on/off to show/hide a listing
- Hit **Publish** — the site rebuilds automatically in ~30 seconds

---

## How the Area Filter Works

When the owner publishes a new apartment and selects e.g. **"Guzape"**, it automatically:
- Appears under the **Guzape** filter tab on the website
- Shows a count badge on the tab (e.g. "Guzape 3")
- Hides tabs that have zero listings

Available areas in the CMS dropdown:
- Jabi, Utako, Wuye, Guzape, Maitama, Wuse 2, Asokoro, Garki, Lifecamp, Durumi

To add more areas, edit two files:
1. `admin/config.yml` — add to the `options` list under `area`
2. `index.html` — add a new `<li>` tab in the `#areaFilter` list

---

## Adding/Editing Apartments Without the CMS

If you prefer to skip the CMS, you can directly edit the JSON array inside `index.html` between:
```html
<script id="apartmentData" type="application/json">
[ ... edit here ... ]
</script>
```

Each apartment object looks like:
```json
{
  "title": "The Jabi Penthouse",
  "area": "Jabi",
  "price": "120,000",
  "bedrooms": 3,
  "bathrooms": 3,
  "guests": 6,
  "description": "Short description shown on the card.",
  "available": true,
  "badge": "Popular",
  "photos": ["/static/uploads/photo1.jpg", "/static/uploads/photo2.jpg"],
  "video": "/static/uploads/tour.mp4",
  "amenities": ["WiFi", "Smart TV", "Generator (24hr)", "Air Conditioning"]
}
```

Set `"available": false` to hide a listing without deleting it.

---

## Photo & Video Tips

- **Photos:** JPG or WebP, ideally 1200×800px or wider. The first photo is the card thumbnail.
- **Videos:** MP4, keep under 50MB for fast loading. A 60–90 second walkthrough works best.
- Images are stored in `/static/uploads/` inside the repo (uploaded via the CMS admin).

---

## Custom Domain

1. Buy a domain (e.g. from Namecheap or Google Domains)
2. In Netlify → **Domain settings** → **Add custom domain**
3. Follow the DNS instructions — usually takes 10–30 minutes to go live
4. Netlify provides a free SSL certificate automatically

---

## Cost Summary

| Service | Cost |
|---|---|
| Netlify hosting | Free (Starter plan) |
| Netlify CMS (Decap CMS) | Free |
| Netlify Identity (up to 1,000 users) | Free |
| Custom domain | ~$10–15/year |
| **Total** | **~$10–15/year** |
