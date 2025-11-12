document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Dummy activities + participants and rendering/signup logic

  const activities = [
    {
      id: "robotics",
      title: "Robotics Club",
      description:
        "Build, program, and compete with robots. Meetings: Wednesdays 3:30–5:00pm.",
      participants: [
        { name: "Alice Lopez", email: "alice.lopez@mergington.edu" },
        { name: "Mark Johnson", email: "mark.johnson@mergington.edu" },
        { name: "Sana Noor", email: "sana.noor@mergington.edu" },
      ],
    },
    {
      id: "art",
      title: "Art Club",
      description:
        "Open studio time for drawing, painting, and portfolio work. Fridays 2:45–4:00pm.",
      participants: [],
    },
    {
      id: "chess",
      title: "Chess Club",
      description: "Weekly matches and strategy sessions. Tuesdays 3:15–4:30pm.",
      participants: [
        { name: "Ben Carter", email: "ben.carter@mergington.edu" },
        { name: "Emma Rice", email: "emma.rice@mergington.edu" },
      ],
    },
  ];

  function initialsFromName(name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function renderActivities() {
    const container = document.getElementById("activities-list");
    if (!container) return;
    container.innerHTML = "";
    activities.forEach((a) => {
      const card = document.createElement("div");
      card.className = "activity-card";
      card.dataset.activityId = a.id;

      const title = document.createElement("h4");
      title.textContent = a.title;
      card.appendChild(title);

      const desc = document.createElement("p");
      desc.textContent = a.description;
      card.appendChild(desc);

      const participantsWrap = document.createElement("div");
      participantsWrap.className = "participants";
      const pTitle = document.createElement("div");
      pTitle.className = "participants-title";
      pTitle.textContent = "Participants";
      participantsWrap.appendChild(pTitle);

      if (a.participants.length === 0) {
        const empty = document.createElement("div");
        empty.className = "participants-empty";
        empty.textContent = "No participants yet — be the first to join!";
        participantsWrap.appendChild(empty);
      } else {
        const ul = document.createElement("ul");
        ul.className = "participants-list";
        a.participants.forEach((p) => {
          const li = document.createElement("li");

          const avatar = document.createElement("span");
          avatar.className = "participant-avatar";
          avatar.textContent = initialsFromName(p.name || p.email.split("@")[0]);

          const nameSpan = document.createElement("span");
          nameSpan.className = "participant-name";
          nameSpan.textContent = p.name || p.email;

          li.appendChild(avatar);
          li.appendChild(nameSpan);
          ul.appendChild(li);
        });
        participantsWrap.appendChild(ul);
      }

      card.appendChild(participantsWrap);
      container.appendChild(card);
    });
  }

  function populateActivitySelect() {
    const select = document.getElementById("activity");
    if (!select) return;
    // Clear existing options except placeholder
    const placeholder = select.querySelector('option[value=""]');
    select.innerHTML = "";
    if (placeholder) select.appendChild(placeholder);
    activities.forEach((a) => {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = a.title;
      select.appendChild(opt);
    });
  }

  function showMessage(text, type = "success") {
    const msg = document.getElementById("message");
    if (!msg) return;
    msg.className = `message ${type}`;
    msg.textContent = text;
    setTimeout(() => {
      msg.classList.add("hidden");
    }, 3500);
    // ensure visible immediately
    msg.classList.remove("hidden");
  }

  function findActivityById(id) {
    return activities.find((a) => a.id === id);
  }

  function addParticipantToActivity(activityId, email) {
    const activity = findActivityById(activityId);
    if (!activity) return { ok: false, reason: "Activity not found" };
    // simple name from localpart
    const local = email.split("@")[0] || email;
    const name = local
      .split(/[._\-]/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    // prevent duplicate by email
    if (
      activity.participants.some(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      return { ok: false, reason: "You are already signed up for this activity." };
    }
    activity.participants.push({ name, email });
    return { ok: true, activity };
  }

  function handleSignup(e) {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const select = document.getElementById("activity");
    if (!emailInput || !select) return;
    const email = (emailInput.value || "").trim();
    const activityId = select.value;

    if (!email || !activityId) {
      showMessage("Please provide an email and select an activity.", "error");
      return;
    }
    // basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    const result = addParticipantToActivity(activityId, email);
    if (!result.ok) {
      showMessage(result.reason, "error");
      return;
    }
    renderActivities();
    showMessage("Successfully signed up!", "success");
    emailInput.value = "";
    select.value = "";
  }

  // Initialize app
  renderActivities();
  populateActivitySelect();
  const form = document.getElementById("signup-form");
  if (form) form.addEventListener("submit", handleSignup);
});
