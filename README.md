# Biolytica — Life Sciences Society Website

A formal, responsive static website starter for Biolytica, the Life Sciences Society of Maitreyi College, University of Delhi.

## Important before publishing
- This is a starter template, not an official or approved college website.
- Replace all sample events, notices, team names and gallery placeholders with verified, approved content.
- Replace the membership form link in `script.js` with the society's actual Google Form URL.
- Use only approved logos and photos.
- Do not put private member data, passwords, API keys or confidential documents in this repository.

## Files
- `index.html` — all page sections and placeholder content
- `styles.css` — layout, colours, typography and responsive styling
- `script.js` — mobile navigation and membership form link

## Publish with GitHub Pages (free)
1. Create a GitHub account at https://github.com/signup
2. Create a **public** repository named `biolytica-website`.
3. Upload `index.html`, `styles.css`, `script.js`, and this README to the repository root.
4. Open repository **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose branch `main` and folder `/(root)`, then save.
7. Wait for deployment, then use the URL shown in Settings → Pages. It should resemble `https://YOUR-USERNAME.github.io/biolytica-website/`.

GitHub Pages may take several minutes to publish after the first deployment or a change.

## Shared maintenance
1. Open the repository's **Settings** and find the collaborator/access management section.
2. Invite a second authorised society office bearer as a collaborator.
3. Agree on a review process before publishing changes.
4. Keep the repository under a society-controlled account where possible, and plan a handover when the committee changes.

## Membership registration
Create a Google Form and link responses to a Google Sheet. Replace the placeholder URL in `script.js`. Restrict the response spreadsheet to authorised people only. The public website does not include a custom admin dashboard or a private database.

## Limitations
GitHub Pages hosts static files. It cannot securely process logins, store private applications, or run server-side code by itself. A secure admin dashboard requires a separately configured backend and authentication. For a first release, update public content through the repository and manage membership submissions in Google Forms/Sheets.
