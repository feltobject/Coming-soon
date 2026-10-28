# Felt Object coming soon

A static, responsive coming-soon page for Cloudflare Pages. The site files are in `public/`; the Pages Function that accepts waitlist signups is in `functions/api/waitlist.js`.

## Preview locally

You can open `public/index.html` to preview the visual page. The waitlist API needs Cloudflare Pages Functions and a KV binding to accept signups.

## Connect waitlist storage

1. In Cloudflare, open **Workers & Pages → KV** and create a namespace such as `felt-object-waitlist`.
2. Open the Pages project → **Settings → Functions → KV namespace bindings**.
3. Add a binding with variable name `WAITLIST` and select the namespace you created.
4. Redeploy the project. The signup form will store email addresses and signup dates in that KV namespace. This function does not send email; you can export the list from KV and connect an email service when you are ready.

## Publish with GitHub and Cloudflare Pages

1. Create an empty GitHub repository named `felt-object`, then run these commands from this project folder (replace the URL with your repository URL):

   ```sh
   git init
   git add .
   git commit -m "Build Felt Object coming soon page"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/felt-object.git
   git push -u origin main
   ```
2. In Cloudflare, go to **Workers & Pages → Create application → Pages → Import an existing Git repository** and select the repository.
3. Set the production branch to `main`, the build command to `exit 0`, and the build output directory to `public`.
4. Deploy. Cloudflare will give you a `*.pages.dev` preview URL.
5. Add your domain under the Pages project’s **Custom domains → Set up a domain**. For an apex domain (such as `example.com`), Cloudflare requires the domain zone to use Cloudflare nameservers. For a subdomain, add it through the Pages custom-domain flow and follow the DNS instructions shown there.

Each push to `main` will trigger a new deployment. Fill in any brand social links or a real launch date only after those details are settled.
