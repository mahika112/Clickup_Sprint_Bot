 🚀 ClickUp Bi-Weekly Sprint Auto Creator

This project automatically creates a new Sprint (List) in ClickUp every 2 weeks (Saturday to Saturday).

It uses:

* ✅ ClickUp API
* ✅ Node.js
* ✅ GitHub Actions (scheduled automation)

---

 📌 What It Does

* Detects the latest Sprint in a folder
* Checks if today is the Sprint end date
* Automatically creates the next Sprint
* Naming format:

```
Sprint {Number}: DD MMM - DD MMM
```

Example:

```
Sprint 1: 11 Jan - 24 Jan
Sprint 2: 25 Jan - 07 Feb
Sprint 3: 08 Feb - 21 Feb
```

Runs automatically every second Saturday.

---

 📂 Supported Folders

You can configure multiple folders across different spaces.

Example folders:

* H&M Web Dev – Sprint 2026
* Finance – Sprint 2026
* Marketing – Sprint 2026
* O&M – Sprint 2026
* Volunteer – Sprint 2026

Each folder must contain at least one Sprint in the correct naming format.

---

# 🛠 Setup Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

Make sure you have:

* Node.js v18 or later

---

## 3️⃣ Add ClickUp API Token

### Get your token:

1. ClickUp → Profile
2. Settings
3. Apps
4. Generate API Token

---

### Add it in GitHub:

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name it:

```
CLICKUP_API_TOKEN
```

5. Paste your token
6. Save

⚠️ Never hardcode your API token in code.

---

# ⚙️ GitHub Actions Workflow

File:

```
.github/workflows/create-sprint.yml
```

This workflow:

* Runs every Saturday
* Checks if it's a 2-week interval
* Creates a sprint only on the correct end date
* Can also be triggered manually

Manual run:

```
GitHub → Actions → Create Sprint → Run workflow
```

---

# 📄 Sprint Naming Format (IMPORTANT)

Your existing sprint must follow this format exactly:

```
Sprint 1: 11 Jan - 24 Jan
```

Regex used:

```
Sprint\s+(\d+)\s*:\s*(\d{1,2})\s+(\w+)\s*-\s*(\d{1,2})\s+(\w+)
```

If naming format changes → script will fail.

---

# 🧠 How It Works

1. Fetch all lists inside folder
2. Find highest Sprint number
3. Extract last sprint end date
4. If today = end date:

   * Create next sprint
   * Increase sprint number
   * Add 14 days

---

# 🧪 Testing Locally

Run manually:

```bash
node sprint.js
```

If not end date, you will see:

```
⏭ Not sprint end date.
```

To test instantly:

* Temporarily remove the date guard in code
* Run once
* Restore the guard

---

# 🛑 Common Issues

## ❌ "Could not read last sprint date"

Cause:

* Naming format incorrect
* No sprint exists in folder

Fix:

* Ensure correct format:

  ```
  Sprint 1: 11 Jan - 24 Jan
  ```

---

## ❌ Sprint created but disappears

Possible reasons:

* Folder automation archiving it
* Wrong folder ID
* Permission issue
* Viewing wrong folder

Check:

* Search in "Everything"
* Review folder automations

---

# 📈 Scaling to Multiple Spaces

To support multiple folders, define them like:

```js
const folders = [
  { name: "Web Dev", folderId: "90168052154" },
  { name: "Finance", folderId: "90168052181" },
  { name: "Marketing", folderId: "90168052182" },
  { name: "O&M", folderId: "90168052184" },
  { name: "Volunteer", folderId: "90168245143" }
];
```

Script will automatically loop through all.

---

# 🔐 Security Notes

* API token stored in GitHub Secrets
* Never commit `.env`
* Never expose token publicly

---

# 🏁 Final Result

Fully automated sprint creation:

* Saturday → Saturday
* Every 2 weeks
* Across multiple spaces
* No manual work required

---

# 👨‍💻 Author

Built by: Mahika Singh
Automated with ❤️ using Node.js & GitHub Actions
