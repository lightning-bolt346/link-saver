function getLinks() {
  return JSON.parse(localStorage.getItem("links") || "{}");
}

function saveLinks(data) {
  localStorage.setItem("links", JSON.stringify(data));
}

function addLink() {
  const category = document.getElementById("category").value.trim();
  const link = document.getElementById("link").value.trim();

  if (!category || !link) return alert("Both fields are required!");

  const data = getLinks();
  if (!data[category]) data[category] = [];
  data[category].push(link);
  saveLinks(data);

  updateCategorySelect();
  displayLinks(category);

  document.getElementById("link").value = "";
}

function updateCategorySelect() {
  const data = getLinks();
  const select = document.getElementById("categorySelect");
  const current = select.value;
  select.innerHTML = `<option value="">-- Select Category --</option>`;
  Object.keys(data).forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === current) option.selected = true;
    select.appendChild(option);
  });
}

function displayLinks(category = null) {
  const data = getLinks();
  const selected = category || document.getElementById("categorySelect").value;
  const list = document.getElementById("linkList");
  list.innerHTML = "";

  if (data[selected]) {
    data[selected].forEach(link => {
      const li = document.createElement("li");
      li.innerHTML = `${link}${link}</a>`;
      list.appendChild(li);
    });
  }
}

function exportLinks() {
  const category = document.getElementById("categorySelect").value;
  if (!category) return alert("Select a category to export!");

  const data = getLinks();
  const blob = new Blob([JSON.stringify({ [category]: data[category] }, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${category}_links.json`;
  a.click();
}

function importLinks() {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      const data = getLinks();
      Object.keys(imported).forEach(cat => {
        if (!data[cat]) data[cat] = [];
        data[cat] = [...new Set([...data[cat], ...imported[cat]])];
      });
      saveLinks(data);
      updateCategorySelect();
      alert("Links imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

window.onload = updateCategorySelect;
