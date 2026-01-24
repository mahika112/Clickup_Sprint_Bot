import fetch from "node-fetch";

const API = "https://api.clickup.com/api/v2";
const TOKEN = "pk_100900716_G7R0FITSY10FGWR3NBFXAE58A4YG61F3";
const FOLDER_ID = "90168052154";
const SPRINT_LENGTH = 15;

// ---------- helpers ----------
async function api(url, method = "GET", body) {
  const res = await fetch(url, {
    method,
    headers: {
      "Authorization": TOKEN,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

function formatDate(d) {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  });
}

// ---------- core ----------
async function getLastSprint() {
  const data = await api(`${API}/folder/${FOLDER_ID}/list`);

  let last = {
    number: 0,
    endDate: null
  };

  for (const list of data.lists) {
    // Match: Sprint 2: 25 Jan - 08 Feb
    const match = list.name.match(
      /Sprint\s+(\d+)\s*:\s*(\d{1,2})\s*(\w+)\s*-\s*(\d{1,2})\s*(\w+)/i
    );

    if (match) {
      const num = parseInt(match[1], 10);
      const endDay = parseInt(match[4], 10);
      const endMonth = match[5];

      if (num > last.number) {
        const year = new Date().getFullYear();
        last = {
          number: num,
          endDate: new Date(`${endDay} ${endMonth} ${year}`)
        };
      }
    }
  }

  return last;
}

async function createSprint() {
  const last = await getLastSprint();

  if (!last.endDate) {
    console.error("❌ No valid sprint found to continue from.");
    return;
  }

  const nextNumber = last.number + 1;

  // Start = last end + 1 day
  const startDate = new Date(last.endDate);
  startDate.setDate(startDate.getDate() + 1);

  // End = start + 14 days
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (SPRINT_LENGTH - 1));

  const sprintName =
    `Sprint ${nextNumber}: ${formatDate(startDate)} - ${formatDate(endDate)}`;

  const created = await api(
    `${API}/folder/${FOLDER_ID}/list`,
    "POST",
    { name: sprintName }
  );

  console.log("✅ Created:", sprintName);
  console.log("List ID:", created.id);
}

createSprint();





