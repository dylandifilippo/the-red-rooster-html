# Deployment & DNS cutover

## Vercel setup (once)
1. Push `redesign` to GitHub: `git push -u origin redesign`.
2. vercel.com → Add New Project → import `dylandifilippo/the-red-rooster-html`.
3. Framework preset: Next.js (auto). Root directory: `/`. No env vars needed.
4. Under Settings → Git, set the production branch to `redesign` for now
   (switch to `main` after merge at launch).
5. Every push now gets a preview URL; production deploys from the production branch.

## Domain cutover (at launch — site approved)
1. Merge: `git checkout main && git merge redesign && git push`.
2. Vercel → Settings → Git → production branch = `main`.
3. Vercel → Settings → Domains → add `theredroosteracademy.com` and `www`.
4. At the DNS registrar, replace the GitHub Pages records:
   - Delete the four GitHub Pages A records (185.199.108.153 etc.) and any
     `www` CNAME to `dylandifilippo.github.io`.
   - Add what Vercel's domain screen prescribes (currently: A `76.76.21.21` for the
     apex, CNAME `cname.vercel-dns.com` for `www`) — follow Vercel's live
     instructions, they take precedence over this doc.
5. Wait for propagation (minutes to a few hours). Verify https://theredroosteracademy.com
   serves the new site in all three locales.
6. Afterwards: disable GitHub Pages in the repo settings; optionally delete `gh-pages`
   and `feature/react-conversion` branches.
