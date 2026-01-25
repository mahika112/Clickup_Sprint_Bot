import fetch from "node-fetch";

const API = "https://api.clickup.com/api/v2";
const TOKEN = process.env.CLICKUP_API_TOKEN;
const SPRINT_DAYS = 14;

// 🔁 ALL SPRINT FOLDERS (across ALL spaces)
const FOLDERS = [
  // H&M and Web-Dev
  { name: "Web-Dev Sprint 2026", folderId: "90168052154" },
  { name: "HM: Sprint 2026", folderId: "90168169313" },

  // Finance & Marketing
  { name: "Finance Sprint 2026", folderId: "90168052181" },
  { name: "Marketing Sprint 2026", folderId: "90168052182" },

  // O&M and Volunteer
  { name: "O&M Sprint 2026", folderId: "90168052184" },
  { name: "Volunteer Sprint 2026", folderId: "90168245143" },
];

// ---------- helpers ----------
async function api(url, method = "GET", body) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

function formatDate(d) {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function sameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ---------- core ----------
async function getLastSprint(folderId) {
  const data = await api(`${API}/folder/${folderId}/list`);
  let last = { number: 0, endDate: null };

  for (const list of data.lists) {
    const match = list.name.match(
      /Sprint\s+(\d+)\s*:\s*(\d{1,2})\s+(\w+)\s*-\s*(\d{1,2})\s+(\w+)/i
    );

    if (match) {
      const num = parseInt(match[1], 10);
      const endDay = parseInt(match[4], 10);
      const endMonth = match[5];
      const year = new Date().getFullYear();

      if (num > last.number) {
        last = {
          number: num,
          endDate: new Date(`${endDay} ${endMonth} ${year}`),
        };
      }
    }
  }
  return last;
}

async function createSprintForFolder(folder) {
  const last = await getLastSprint(folder.folderId);

  if (!last.endDate) {
    console.log(`⚠️ ${folder.name}: No sprint found`);
    return;
  }

  const today = new Date();

  // 🔒 Only run on sprint END date (Saturday)
  if (!sameDate(today, last.endDate)) {
    console.log(
      `⏭ ${folder.name}: Not sprint end date (Today ${formatDate(
        today
      )}, End ${formatDate(last.endDate)})`
    );
    return;
  }

  const nextNumber = last.number + 1;

  const start = new Date(last.endDate);
  start.setDate(start.getDate() + 1);

  const end = new Date(start);
  end.setDate(start.getDate() + (SPRINT_DAYS - 1));

  const sprintName = `Sprint ${nextNumber}: ${formatDate(start)} - ${formatDate(end)}`;

  await api(`${API}/folder/${folder.folderId}/list`, "POST", {
    name: sprintName,
  });

  console.log(`✅ ${folder.name}: Created ${sprintName}`);
}

// ---------- runner ----------
async function run() {
  for (const folder of FOLDERS) {
    await createSprintForFolder(folder);
  }
}

run();










