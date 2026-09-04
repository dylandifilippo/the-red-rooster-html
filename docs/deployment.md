# Deployment & DNS

The site is deployed on Vercel from the `main` branch. This document records how
the cutover from GitHub Pages was done (2026-09-04), what the live configuration
is, and how to roll back.

## Live configuration

- **Vercel project**: `the-red-rooster-academy`, team `dylandifilippos-projects`
  (Hobby), linked to the GitHub repo `dylandifilippo/the-red-rooster-html`.
- **Production branch**: `main`. Every push to `main` produces a production
  deployment; every other branch gets a preview URL.
- **Domains** (Settings > Domains): `theredroosteracademy.com` (serves the site)
  and `www.theredroosteracademy.com` (308 redirect to the apex).
- **Vercel Authentication** is `all_except_custom_domains`: previews are gated,
  the custom domain is public. Leave it as is.
- **TLS**: certificates are issued by Vercel (Let's Encrypt) automatically once
  DNS verifies. Nothing to renew by hand.
- **DNS**: the zone is hosted at **Combell** (my.combell.com, nameservers
  `ns1/ns2/ns3.register.be`). Records that matter for the site:

  | Type  | Name | Value                                 | TTL |
  |-------|------|---------------------------------------|-----|
  | A     | @    | 216.198.79.1                          | 600 |
  | A     | @    | 64.29.17.1                            | 600 |
  | CNAME | www  | b997d73ff59e9d55.vercel-dns-017.com   | 600 |

  The `MX` (`mailrelay.register.be`, prio 10) and `NS` records belong to the club
  mailbox and the registrar. Never touch them for anything site related.

  Vercel's prescribed values change over time. Before editing DNS, read the
  current ones from the Domains screen or from
  `vercel domains verify theredroosteracademy.com --scope dylandifilippos-projects`
  rather than from this table.

## How the cutover was done (2026-09-04)

`main` used to hold the old static site (`index.html`, `css/`, `js/`) and the
redesign lived on `redesign-taste` then `claude/site-update-coach-info-qwbu98`.
Those branches descend from the old `main`, so `main` was simply fast-forwarded
onto the redesign branch. There was no merge to perform; the old content is
preserved in the tag `ancien-site-statique` and the old deployment lives on in
the `gh-pages` branch.

1. `git tag ancien-site-statique origin/main && git push origin ancien-site-statique`
2. `git checkout -B main origin/main && git reset --hard <redesign branch>`
3. `git push --force-with-lease origin main` (a fast-forward in practice).
4. Vercel: production branch `main` (already the case), then attach the apex and
   `www` domains BEFORE changing DNS so the certificate is ready when traffic
   arrives. `www` set to redirect to the apex.
5. Combell: capture the whole zone first (see below), then add the two Vercel
   A records on the apex, delete the four GitHub Pages A records
   (`185.199.108.153` to `.111.153`) on the apex and on `www`, delete the eight
   GitHub Pages AAAA records (`2606:50c0:8000::153` to `8003::153`, apex and
   `www`), then add the `www` CNAME. AAAA records must go too: Vercel publishes
   none, and an IPv6 client would otherwise keep landing on GitHub.
6. Verify against the authoritative nameservers (`dig @ns1.register.be`), then
   `vercel domains verify` for both names, then HTTPS in the three locales.
7. Purge the Facebook cache (see below).
8. Disable GitHub Pages in the repo settings (Settings > Pages) so the old
   deployment stops answering for the domain.

## Facebook and Messenger preview cache

Facebook caches the Open Graph card of a URL. After any change to `og:image`,
`og:title` or `og:description`, open the Sharing Debugger at
https://developers.facebook.com/tools/debug/ for `https://theredroosteracademy.com/`
(and `/nl`, `/en`), click **Scrape Again**, and check that the card shows
`/images/og.jpg`. Then paste the link in a Messenger conversation to see the real
card. Without this step the old preview (`/images/technique.jpg` from the static
site) keeps showing for weeks.

## Rollback

Two independent levers, use one or both:

- **Code**: the previous deployment can be promoted from the Vercel Deployments
  list (Instant Rollback), or `main` can be reset to any earlier commit and pushed.
- **DNS** (back to GitHub Pages, as long as `gh-pages` still exists and Pages is
  re-enabled on it): restore the zone captured before the cutover. Everything
  not listed here (MX, NS) was left untouched.

  | Type | Name | Value               | TTL  |
  |------|------|---------------------|------|
  | A    | @    | 185.199.108.153     | 3600 |
  | A    | @    | 185.199.109.153     | 3600 |
  | A    | @    | 185.199.110.153     | 3600 |
  | A    | @    | 185.199.111.153     | 3600 |
  | A    | www  | 185.199.108.153     | 3600 |
  | A    | www  | 185.199.109.153     | 3600 |
  | A    | www  | 185.199.110.153     | 3600 |
  | A    | www  | 185.199.111.153     | 3600 |
  | AAAA | @    | 2606:50c0:8000::153 | 3600 |
  | AAAA | @    | 2606:50c0:8001::153 | 3600 |
  | AAAA | @    | 2606:50c0:8002::153 | 3600 |
  | AAAA | @    | 2606:50c0:8003::153 | 3600 |
  | AAAA | www  | 2606:50c0:8000::153 | 3600 |
  | AAAA | www  | 2606:50c0:8001::153 | 3600 |
  | AAAA | www  | 2606:50c0:8002::153 | 3600 |
  | AAAA | www  | 2606:50c0:8003::153 | 3600 |

  The `www` CNAME to Vercel must be removed before re-adding `www` A records.
