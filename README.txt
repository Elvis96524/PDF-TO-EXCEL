PO to Excel - installable web app (GitHub storage)

SET UP (once, admin)
1. Create a GitHub repository (e.g. po-to-excel).
2. Upload ALL files in this folder to the repo root:
   index.html, data.json, manifest.json, service-worker.js, icon-192.png, icon-512.png
3. Repo Settings > Pages > Deploy from branch > main / (root). Wait a minute.
   Your app is at https://YOURNAME.github.io/po-to-excel/
4. Create a token: GitHub > Settings > Developer settings > Fine-grained tokens >
   only this repo, permission "Contents: Read and write".
5. Open the app > "GitHub settings" > enter owner, repo, branch (main), token > Save.
   Now "Save to GitHub" writes into data.json in your repo.

INSTALL ON COMPUTER
Open the app link in Chrome or Edge, click "Install app" (or the install icon in the address bar).

OTHER USERS
Just open the same link: they see all saved POs and can download Excel.
Only a device with the token can save or delete.
