import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
  getFirestore, collection, onSnapshot, doc, getDocs,
  setDoc, updateDoc, deleteDoc, writeBatch, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { CATEGORIES, SEED_DATA } from "./data.js";

// ==========================================
// 1. FIREBASE INITIALIZATION
// ==========================================
 const firebaseConfig = {
    apiKey: "AIzaSyD83kT0yzWvWYdIFArrZ6jmBHxc6hBd4Xo",
    authDomain: "clwdytt.firebaseapp.com",
    projectId: "clwdytt",
    storageBucket: "clwdytt.firebasestorage.app",
    messagingSenderId: "655815508411",
    appId: "1:655815508411:web:99cb3f8166a6c0bc88049e"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const itemsCol = collection(db, "items");

// ==========================================
// 2. STATE & CONFIGURATION
// ==========================================
let allItems = [];
let activeCategory = null;
let isGlobalEditMode = false;
let isModalEditMode = false;
let activeModalItem = null;
let activeCardHighlightTimer = null;

// Replace with your GitHub repository URL:
const GITHUB_USER = "clwdyttghub";
const GITHUB_REPO = "clwdytt";
const APK_DOWNLOAD_URL = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/latest/download/app-debug.apk`;

// Update download links on page
document.getElementById("apkDownloadBtn").href = APK_DOWNLOAD_URL;
document.getElementById("heroApkBtn").href = APK_DOWNLOAD_URL;

// ==========================================
// 3. SEEDING & REAL-TIME LISTENER
// ==========================================
async function initDatabase() {
  const snapshot = await getDocs(itemsCol);
  if (snapshot.empty) {
    console.log("Seeding database with default dataset...");
    const batch = writeBatch(db);
    SEED_DATA.forEach((item) => {
      const docRef = doc(itemsCol);
      batch.set(docRef, { ...item, created_at: new Date().toISOString() });
    });
    await batch.commit();
  }

  // Real-time updates listener
  const q = query(itemsCol, orderBy("order_index", "asc"));
  onSnapshot(q, (snap) => {
    allItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (activeCategory) renderCategory(activeCategory);
  });
}

// ==========================================
// 4. NAVIGATION & RENDERING
// ==========================================
function setupNavigation() {
  const desktopNav = document.getElementById("desktopNavLinks");
  const mobileNav = document.getElementById("mobileNavLinks");

  desktopNav.innerHTML = "";
  mobileNav.innerHTML = "";

  CATEGORIES.forEach(cat => {
    // Desktop link
    const dLink = document.createElement("a");
    dLink.className = "nav-link";
    dLink.innerText = cat.title;
    dLink.onclick = () => selectCategory(cat.id);
    dLink.dataset.catId = cat.id;
    desktopNav.appendChild(dLink);

    // Mobile link
    const mLink = document.createElement("div");
    mLink.className = "mobile-nav-item";
    mLink.innerText = cat.title;
    mLink.onclick = () => {
      selectCategory(cat.id);
      toggleMobileDrawer(false);
    };
    mLink.dataset.catId = cat.id;
    mobileNav.appendChild(mLink);
  });
}

window.selectCategory = function(catId) {
  activeCategory = catId;
  isGlobalEditMode = false;
  updateEditModeUI();

  document.getElementById("welcomeView").style.display = "none";
  document.getElementById("categoryView").style.display = "block";

  const catMeta = CATEGORIES.find(c => c.id === catId);
  document.getElementById("activeCategoryTitle").innerText = catMeta.title;
  document.getElementById("activeCategoryDesc").innerText = catMeta.desc;

  document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.catId === catId);
  });

  renderCategory(catId);
};

window.navigateToWelcome = function() {
  activeCategory = null;
  document.getElementById("welcomeView").style.display = "flex";
  document.getElementById("categoryView").style.display = "none";
  document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(el => el.classList.remove("active"));
};

function renderCategory(catId) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  const filtered = allItems.filter(i => i.category === catId);

  filtered.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const card = document.createElement("div");
    card.className = "card";
    card.id = `card-${item.id}`;
    card.innerHTML = `
      <div class="card-title">${escapeHtml(item.title)}</div>
      <div class="card-subtitle">${escapeHtml(item.subtitle || "")}</div>
    `;

    card.onclick = () => {
      if (item.type === "link") {
        triggerHighlight(item.id);
        window.open(item.content, "_blank");
      } else {
        openViewer(item);
      }
    };

    wrapper.appendChild(card);

    if (isGlobalEditMode) {
      const controls = document.createElement("div");
      controls.className = "card-edit-controls";

      // Move Up
      if (index > 0) {
        const upBtn = document.createElement("button");
        upBtn.className = "badge-btn move";
        upBtn.innerHTML = "↑";
        upBtn.onclick = (e) => { e.stopPropagation(); moveEntity(index, -1); };
        controls.appendChild(upBtn);
      }

      // Move Down
      if (index < filtered.length - 1) {
        const downBtn = document.createElement("button");
        downBtn.className = "badge-btn move";
        downBtn.innerHTML = "↓";
        downBtn.onclick = (e) => { e.stopPropagation(); moveEntity(index, 1); };
        controls.appendChild(downBtn);
      }

      // Edit
      const editBtn = document.createElement("button");
      editBtn.className = "badge-btn edit";
      editBtn.innerHTML = "✎";
      editBtn.onclick = (e) => { e.stopPropagation(); openEditEntityModal(item); };
      controls.appendChild(editBtn);

      // Delete
      const delBtn = document.createElement("button");
      delBtn.className = "badge-btn del";
      delBtn.innerHTML = "✕";
      delBtn.onclick = (e) => { e.stopPropagation(); deleteEntity(item.id); };
      controls.appendChild(delBtn);

      wrapper.appendChild(controls);
    }

    grid.appendChild(wrapper);
  });
}

// ==========================================
// 5. VIEWER MODAL LOGIC (NOTE, LIST, DOC, TEXT, IMG)
// ==========================================
function openViewer(item) {
  activeModalItem = { ...item };
  isModalEditMode = false;
  document.getElementById("viewerTitle").innerText = item.title;

  const toggleBtn = document.getElementById("modalEditToggleBtn");
  toggleBtn.style.display = (item.type === "pdf" || item.type === "script") ? "none" : "block";
  toggleBtn.innerText = "Edit";

  renderViewerContent();
  document.getElementById("viewerModal").classList.add("active");
}

function renderViewerContent() {
  const container = document.getElementById("viewerBody");
  container.innerHTML = "";
  const item = activeModalItem;

  // NOTE TYPE
  if (item.type === "note") {
    const textarea = document.createElement("textarea");
    textarea.className = "note-textarea";
    textarea.value = item.content || "";
    textarea.disabled = !isModalEditMode;
    textarea.oninput = (e) => { activeModalItem.content = e.target.value; };
    container.appendChild(textarea);

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "10px";
    btnRow.style.marginTop = "14px";

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn-secondary";
    copyBtn.style.flex = "1";
    copyBtn.innerText = "Copy Text";
    copyBtn.onclick = () => copyText(item.content, copyBtn);
    btnRow.appendChild(copyBtn);

    if (isModalEditMode) {
      const saveBtn = document.createElement("button");
      saveBtn.className = "btn-primary";
      saveBtn.style.flex = "1";
      saveBtn.innerText = "Save Note";
      saveBtn.onclick = async () => {
        await updateDoc(doc(db, "items", item.id), { content: activeModalItem.content });
        isModalEditMode = false;
        document.getElementById("modalEditToggleBtn").innerText = "Edit";
        renderViewerContent();
        showToast("Note saved!");
      };
      btnRow.appendChild(saveBtn);
    }
    container.appendChild(btnRow);
  }

  // LIST / TABLE TYPE
  else if (item.type === "list") {
    let columns = [];
    try { columns = JSON.parse(item.content) || ["Copy/paste"]; } catch(e) { columns = ["Copy/paste"]; }
    let listData = [...(item.group_data || [])];

    // Natural numeric-aware sort on column 1
    listData.sort((a, b) => {
      const vA = (a.cells[0] || "").toString().replace(/\./g, '');
      const vB = (b.cells[0] || "").toString().replace(/\./g, '');
      return vA.localeCompare(vB, undefined, { numeric: true, sensitivity: 'base' });
    });

    const topActions = document.createElement("div");
    topActions.style.display = "flex";
    topActions.style.gap = "8px";
    topActions.style.marginBottom = "14px";

    const copyDataBtn = document.createElement("button");
    copyDataBtn.className = "btn-secondary btn-sm";
    copyDataBtn.innerText = "Copy All Data";
    copyDataBtn.onclick = () => {
      const text = listData.map(r => r.cells.join("\t")).join("\n");
      copyText(text);
    };

    const copyWithColBtn = document.createElement("button");
    copyWithColBtn.className = "btn-secondary btn-sm";
    copyWithColBtn.innerText = "Copy w/ Columns";
    copyWithColBtn.onclick = () => {
      const text = columns.join("\t") + "\n" + listData.map(r => r.cells.join("\t")).join("\n");
      copyText(text);
    };

    const uncheckBtn = document.createElement("button");
    uncheckBtn.className = "btn-secondary btn-sm";
    uncheckBtn.innerText = "Uncheck All";
    uncheckBtn.onclick = async () => {
      const updated = listData.map(r => ({ ...r, checked: false }));
      await saveInnerGroupData(updated);
    };

    topActions.appendChild(copyDataBtn);
    topActions.appendChild(copyWithColBtn);
    topActions.appendChild(uncheckBtn);
    container.appendChild(topActions);

    const tableWrap = document.createElement("div");
    tableWrap.className = "table-wrapper";
    const table = document.createElement("table");
    table.className = "custom-table";

    // Header
    let theadHtml = `<thead><tr><th style="width:40px;"></th>`;
    columns.forEach(col => { theadHtml += `<th>${escapeHtml(col)}</th>`; });
    if (isModalEditMode) theadHtml += `<th style="width:40px;"></th>`;
    theadHtml += `</tr></thead>`;
    table.innerHTML = theadHtml;

    // Body
    const tbody = document.createElement("tbody");
    listData.forEach((row, rIdx) => {
      const tr = document.createElement("tr");

      // Checkbox
      const tdCheck = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "table-checkbox";
      checkbox.checked = !!row.checked;
      checkbox.onchange = async () => {
        listData[rIdx].checked = checkbox.checked;
        await saveInnerGroupData(listData);
      };
      tdCheck.appendChild(checkbox);
      tr.appendChild(tdCheck);

      // Cells
      row.cells.forEach((cell, cIdx) => {
        const td = document.createElement("td");
        if (isModalEditMode) {
          const inp = document.createElement("input");
          inp.className = "form-input";
          inp.style.marginBottom = "0";
          inp.style.padding = "6px 8px";
          inp.value = cell;
          inp.onchange = async (e) => {
            listData[rIdx].cells[cIdx] = e.target.value;
            await saveInnerGroupData(listData);
          };
          td.appendChild(inp);
        } else {
          const span = document.createElement("span");
          span.className = "table-cell-copy";
          span.innerText = cell || "—";
          span.onclick = () => copyText(cell);
          td.appendChild(span);
        }
        tr.appendChild(td);
      });

      // Delete Row in edit mode
      if (isModalEditMode) {
        const tdDel = document.createElement("td");
        const delBtn = document.createElement("button");
        delBtn.style.color = "var(--accent-red)";
        delBtn.style.background = "none";
        delBtn.style.border = "none";
        delBtn.style.cursor = "pointer";
        delBtn.style.fontWeight = "bold";
        delBtn.innerText = "✕";
        delBtn.onclick = async () => {
          const updated = listData.filter(r => r.id !== row.id);
          await saveInnerGroupData(updated);
        };
        tdDel.appendChild(delBtn);
        tr.appendChild(tdDel);
      }

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    container.appendChild(tableWrap);

    if (isModalEditMode) {
      const addRowBtn = document.createElement("button");
      addRowBtn.className = "btn-secondary";
      addRowBtn.style.marginTop = "10px";
      addRowBtn.innerText = "+ Add List Row";
      addRowBtn.onclick = async () => {
        const newRow = { id: Date.now().toString(), checked: false, cells: new Array(columns.length).fill("") };
        await saveInnerGroupData([...listData, newRow]);
      };
      container.appendChild(addRowBtn);
    }
  }

  // TEXT GROUP TYPE
  else if (item.type === "text_group") {
    const list = document.createElement("div");
    (item.group_data || []).forEach((entry, idx) => {
      const row = document.createElement("div");
      row.className = "group-row";

      if (isModalEditMode) {
        row.innerHTML = `
          <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
            <input type="text" class="form-input" style="margin-bottom:0;" value="${escapeHtml(entry.label)}" onchange="window.updateGroupEntry(${idx}, 'label', this.value)" />
            <input type="text" class="form-input" style="margin-bottom:0;" value="${escapeHtml(entry.value)}" onchange="window.updateGroupEntry(${idx}, 'value', this.value)" />
          </div>
          <button style="background:none; border:none; color:red; font-size:18px; margin-left:12px; cursor:pointer;" onclick="window.deleteGroupEntry(${idx})">✕</button>
        `;
      } else {
        const left = document.createElement("div");
        left.innerHTML = `
          <div class="group-row-label">${escapeHtml(entry.label)}</div>
          <div class="group-row-value">${escapeHtml(entry.value)}</div>
        `;
        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-badge";
        copyBtn.innerText = "Copy";
        copyBtn.onclick = () => copyText(entry.value, copyBtn);

        row.appendChild(left);
        row.appendChild(copyBtn);
      }
      list.appendChild(row);
    });
    container.appendChild(list);

    if (isModalEditMode) {
      const addEntryBtn = document.createElement("button");
      addEntryBtn.className = "btn-secondary";
      addEntryBtn.style.marginTop = "14px";
      addEntryBtn.innerText = "+ Add Text Entry";
      addEntryBtn.onclick = async () => {
        const updated = [...(item.group_data || []), { label: "New Label", value: "New Value" }];
        await saveInnerGroupData(updated);
      };
      container.appendChild(addEntryBtn);
    }
  }

  // IMAGE GROUP TYPE
  else if (item.type === "image_group") {
    (item.group_data || []).forEach((img, idx) => {
      const block = document.createElement("div");
      block.style.marginBottom = "24px";

      if (isModalEditMode) {
        const delImgBtn = document.createElement("button");
        delImgBtn.style.color = "red";
        delImgBtn.style.border = "none";
        delImgBtn.style.background = "none";
        delImgBtn.style.cursor = "pointer";
        delImgBtn.style.marginBottom = "6px";
        delImgBtn.innerText = "✕ Remove Image";
        delImgBtn.onclick = async () => {
          const updated = item.group_data.filter((_, i) => i !== idx);
          await saveInnerGroupData(updated);
        };
        block.appendChild(delImgBtn);
      }

      const label = document.createElement("div");
      label.className = "group-row-label";
      label.innerText = img.label;
      block.appendChild(label);

      const image = document.createElement("img");
      image.className = "preview-img";
      image.src = img.url;
      block.appendChild(image);

      const saveBtn = document.createElement("button");
      saveBtn.className = "btn-secondary";
      saveBtn.innerText = "Download Image";
      saveBtn.onclick = () => triggerFileDownload(img.url, img.label + ".jpg");
      block.appendChild(saveBtn);

      container.appendChild(block);
    });

    if (isModalEditMode) {
      const addImgBtn = document.createElement("button");
      addImgBtn.className = "btn-secondary";
      addImgBtn.innerText = "+ Add Image Item";
      addImgBtn.onclick = async () => {
        const label = prompt("Enter Image Label:");
        const url = prompt("Enter Image URL (e.g. assets/pic.jpg or web url):");
        if (label && url) {
          const updated = [...(item.group_data || []), { label, url }];
          await saveInnerGroupData(updated);
        }
      };
      container.appendChild(addImgBtn);
    }
  }

  // PDF & SCRIPT TYPES
  else if (item.type === "pdf" || item.type === "script") {
    const isPdf = item.type === "pdf";
    const iframe = document.createElement("iframe");
    iframe.className = "doc-iframe";
    iframe.src = item.content;
    container.appendChild(iframe);

    const extractBtn = document.createElement("button");
    extractBtn.className = "btn-primary";
    extractBtn.innerText = isPdf ? "Extract / Download Document" : "Extract / Download Script (.bat)";
    extractBtn.onclick = () => triggerFileDownload(item.content, item.title + (isPdf ? ".pdf" : ".bat"));
    container.appendChild(extractBtn);
  }
}

async function saveInnerGroupData(newData) {
  activeModalItem.group_data = newData;
  await updateDoc(doc(db, "items", activeModalItem.id), { group_data: newData });
  renderViewerContent();
}

window.updateGroupEntry = async function(idx, field, value) {
  activeModalItem.group_data[idx][field] = value;
  await updateDoc(doc(db, "items", activeModalItem.id), { group_data: activeModalItem.group_data });
};

window.deleteGroupEntry = async function(idx) {
  const updated = activeModalItem.group_data.filter((_, i) => i !== idx);
  await saveInnerGroupData(updated);
};

// ==========================================
// 6. CRUD & REORDER LOGIC
// ==========================================
function updateEditModeUI() {
  document.getElementById("toggleGlobalEditBtn").style.display = isGlobalEditMode ? "none" : "block";
  document.getElementById("openCreateModalBtn").style.display = isGlobalEditMode ? "block" : "none";
  document.getElementById("doneGlobalEditBtn").style.display = isGlobalEditMode ? "block" : "none";
  if (activeCategory) renderCategory(activeCategory);
}

document.getElementById("toggleGlobalEditBtn").onclick = () => { isGlobalEditMode = true; updateEditModeUI(); };
document.getElementById("doneGlobalEditBtn").onclick = () => { isGlobalEditMode = false; updateEditModeUI(); };

async function moveEntity(index, direction) {
  const filtered = allItems.filter(i => i.category === activeCategory);
  if ((direction === -1 && index === 0) || (direction === 1 && index === filtered.length - 1)) return;

  const targetIdx = index + direction;
  const currentItem = filtered[index];
  const targetItem = filtered[targetIdx];

  const batch = writeBatch(db);
  batch.update(doc(db, "items", currentItem.id), { order_index: targetIdx });
  batch.update(doc(db, "items", targetItem.id), { order_index: index });
  await batch.commit();
}

async function deleteEntity(id) {
  if (confirm("Delete this entity permanently?")) {
    await deleteDoc(doc(db, "items", id));
    showToast("Entity deleted");
  }
}

// Modal Form: Add / Edit
function openEditEntityModal(item = null) {
  const form = document.getElementById("entityForm");
  form.reset();

  const isEditing = !!item;
  document.getElementById("formModalTitle").innerText = isEditing ? "Edit Entity" : "Create New Entity";
  document.getElementById("formEntityId").value = isEditing ? item.id : "";
  document.getElementById("formTitle").value = isEditing ? item.title : "";
  document.getElementById("formSubtitle").value = isEditing ? (item.subtitle || "") : "";
  document.getElementById("formContent").value = isEditing ? (item.content || "") : "";

  setupTypeSelector(isEditing ? item.type : (activeCategory === "notepad-category" ? "note" : "link"));
  document.getElementById("formModal").classList.add("active");
}

function setupTypeSelector(selectedType) {
  const container = document.getElementById("typeSelectorGroup");
  container.innerHTML = "";

  const types = activeCategory === "notepad-category" 
    ? [{ id: 'note', label: 'Note' }, { id: 'list', label: 'List' }]
    : [
        { id: 'link', label: 'Link' },
        { id: 'text_group', label: 'Text Group' },
        { id: 'image_group', label: 'Images' },
        { id: 'pdf', label: 'Doc' }
      ];

  types.forEach(t => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `type-choice-btn ${t.id === selectedType ? 'selected' : ''}`;
    btn.innerText = t.label;
    btn.onclick = () => {
      document.querySelectorAll(".type-choice-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      updateFormVisibility(t.id);
    };
    container.appendChild(btn);
  });

  updateFormVisibility(selectedType);
}

function updateFormVisibility(type) {
  const isList = type === "list";
  const isNote = type === "note";
  document.getElementById("listFieldsContainer").style.display = isList ? "block" : "none";
  document.getElementById("urlFieldContainer").style.display = isNote ? "none" : "block";
}

document.getElementById("openCreateModalBtn").onclick = () => openEditEntityModal();
document.getElementById("closeFormBtn").onclick = () => document.getElementById("formModal").classList.remove("active");

document.getElementById("entityForm").onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById("formEntityId").value;
  const title = document.getElementById("formTitle").value;
  const subtitle = document.getElementById("formSubtitle").value;
  const selectedTypeBtn = document.querySelector(".type-choice-btn.selected");
  const type = selectedTypeBtn ? selectedTypeBtn.innerText.toLowerCase().replace(" ", "_") : "link";
  let content = document.getElementById("formContent").value;

  const payload = {
    category: activeCategory,
    title,
    subtitle,
    type,
    content,
    order_index: id ? undefined : allItems.length
  };

  if (type === "list") {
    const mainCol = document.getElementById("formMainColumn").value || "Copy/paste";
    const extraCols = Array.from(document.querySelectorAll(".extra-col-input")).map(i => i.value).filter(v => v.trim());
    payload.content = JSON.stringify([mainCol, ...extraCols]);
  }

  if (id) {
    await updateDoc(doc(db, "items", id), payload);
    showToast("Entity updated");
  } else {
    payload.group_data = (type === "list" || type.includes("group")) ? [] : null;
    payload.created_at = new Date().toISOString();
    await setDoc(doc(itemsCol), payload);
    showToast("Entity created");
  }

  document.getElementById("formModal").classList.remove("active");
};

// ==========================================
// 7. UTILITIES: CLIPBOARD, TOAST, DOWNLOAD
// ==========================================
function copyText(text, btnElement = null) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if (btnElement) {
      btnElement.innerText = "Copied!";
      btnElement.classList.add("copied");
      setTimeout(() => {
        btnElement.innerText = "Copy";
        btnElement.classList.remove("copied");
      }, 1500);
    }
    showToast("Copied to clipboard!");
  });
}

function triggerHighlight(cardId) {
  const card = document.getElementById(`card-${cardId}`);
  if (!card) return;
  card.classList.add("highlighted");
  if (activeCardHighlightTimer) clearTimeout(activeCardHighlightTimer);
  activeCardHighlightTimer = setTimeout(() => card.classList.remove("highlighted"), 5000);
}

function triggerFileDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Downloading " + filename);
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

// Mobile drawer controls
const mobileDrawer = document.getElementById("mobileDrawer");
document.getElementById("mobileMenuBtn").onclick = () => mobileDrawer.classList.add("open");
document.getElementById("closeDrawerBtn").onclick = () => mobileDrawer.classList.remove("open");

// Viewer modal controls
document.getElementById("closeViewerBtn").onclick = () => document.getElementById("viewerModal").classList.remove("active");
document.getElementById("modalEditToggleBtn").onclick = () => {
  isModalEditMode = !isModalEditMode;
  document.getElementById("modalEditToggleBtn").innerText = isModalEditMode ? "Done" : "Edit";
  renderViewerContent();
};

// ==========================================
// 8. BOOTSTRAP
// ==========================================
setupNavigation();
initDatabase();

// ==========================================
// DIRECT GOOGLE DRIVE UPLOAD BRIDGE
// ==========================================
document.getElementById("formFileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const statusText = document.getElementById("uploadStatusText");
  const urlInput = document.getElementById("formContent");
  
  statusText.innerText = `Uploading ${file.name} to Google Drive...`;
  statusText.style.color = "var(--accent-blue)";

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = async function(event) {
    try {
      const bytes = [...new Int8Array(event.target.result)];
      const payload = {
        filename: file.name,
        mimeType: file.type,
        bytes: btoa(String.fromCharCode.apply(null, bytes))
      };

      const response = await fetch("https://script.google.com/macros/s/AKfycbxss8ZtfaNyuy9wBB4EGoYhLnX27qzF-phfg9qEmh65sQeqYvwxYxIOOWwKG0AslPUFZw/exec", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (result.status === "success") {
        urlInput.value = result.url;
        statusText.innerText = "Uploaded securely to Google Drive!";
        statusText.style.color = "var(--accent-green)";
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error(err);
      statusText.innerText = "Upload failed. Try entering a URL manually.";
      statusText.style.color = "var(--accent-red)";
    }
  };
  e.target.value = "";
});