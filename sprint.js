import fetch from "node-fetch";

const API = "https://api.clickup.com/api/v2";
const TOKEN = process.env.CLICKUP_API_TOKEN;
const FOLDER_ID = "90168052154";
const SPRINT_DAYS = 14;

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
async function getLastSprint() {
  const data = await api(`${API}/folder/${FOLDER_ID}/list`);

  let last = { number: 0, endDate: null };

  for (const list of data.lists) {
    // Match: Sprint 1: 11 Jan - 24 Jan
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

async function createSprint() {
  const last = await getLastSprint();

  if (!last.endDate) {
    console.error("❌ No existing sprint found.");
    return;
  }

  const today = new Date();

  // 🔒 Guard: only run on sprint END DATE
  if (!sameDate(today, last.endDate)) {
    console.log(
      `⏭ Not sprint end date. Today: ${formatDate(today)}, End: ${formatDate(last.endDate)}`
    );
    return;
  }

  const nextNumber = last.number + 1;

  // Start = last end + 1 day (Saturday)
  const start = new Date(last.endDate);
  start.setDate(start.getDate() + 1);

  // End = start + 13 days (Saturday)
  const end = new Date(start);
  end.setDate(start.getDate() + (SPRINT_DAYS - 1));

  const sprintName = `Sprint ${nextNumber}: ${formatDate(start)} - ${formatDate(end)}`;

  await api(`${API}/folder/${FOLDER_ID}/list`, "POST", {
    name: sprintName,
  });

  console.log("✅ Created:", sprintName);
}

createSprint();








