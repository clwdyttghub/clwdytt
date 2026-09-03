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

let activeCardId = null; 
let activeCardTimer = null; 

const GITHUB_USER = "clwdyttghub";
const GITHUB_REPO = "clwdytt";
const APK_DOWNLOAD_URL = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/latest/download/app-debug.apk`;

document.getElementById("apkDownloadBtn").href = APK_DOWNLOAD_URL;
document.getElementById("heroApkBtn").href = APK_DOWNLOAD_URL;

// ==========================================
// 3. SEEDING & REAL-TIME LISTENER
// ==========================================
async function initDatabase() {
  const snapshot = await getDocs(itemsCol);
  if (snapshot.empty) {
    console.log("Seeding database...");
    const batch = writeBatch(db);
    SEED_DATA.forEach((item) => {
      const docRef = doc(itemsCol);
      batch.set(docRef, { ...item, created_at: new Date().toISOString() });
    });
    await batch.commit();
  }

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
    // Desktop
    const dLink = document.createElement("a");
    dLink.className = "text-[13px] text-gray-900 opacity-70 hover:opacity-100 font-medium whitespace-nowrap cursor-pointer transition";
    dLink.innerText = cat.title;
    dLink.onclick = () => selectCategory(cat.id);
    dLink.dataset.catId = cat.id;
    desktopNav.appendChild(dLink);

    // Mobile
    const mLink = document.createElement("div");
    mLink.className = "p-3 rounded-lg text-base font-semibold text-gray-900 cursor-pointer";
    mLink.innerText = cat.title;
    mLink.onclick = () => { selectCategory(cat.id); closeMobileDrawer(); };
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

  document.querySelectorAll("#desktopNavLinks a").forEach(el => {
    const isActive = el.dataset.catId === catId;
    el.classList.toggle("opacity-100", isActive);
    el.classList.toggle("font-bold", isActive);
    el.classList.toggle("text-accent-blue", isActive);
  });
  
  document.querySelectorAll("#mobileNavLinks div").forEach(el => {
    const isActive = el.dataset.catId === catId;
    el.classList.toggle("bg-[#eef5fc]", isActive);
    el.classList.toggle("text-accent-blue", isActive);
  });

  renderCategory(catId);
};

window.navigateToWelcome = function() {
  activeCategory = null;
  document.getElementById("welcomeView").style.display = "flex";
  document.getElementById("categoryView").style.display = "none";
  document.querySelectorAll("#desktopNavLinks a, #mobileNavLinks div").forEach(el => {
    el.classList.remove("opacity-100", "font-bold", "text-accent-blue", "bg-[#eef5fc]");
  });
};

function renderCategory(catId) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";
  const filtered = allItems.filter(i => i.category === catId);

  filtered.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "relative group";
    
    // Setup Drag and Drop
    if (isGlobalEditMode) {
      wrapper.draggable = true;
      wrapper.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", index);
        wrapper.classList.add("opacity-50");
      };
      wrapper.ondragend = () => wrapper.classList.remove("opacity-50");
      wrapper.ondragover = (e) => {
        e.preventDefault();
        wrapper.children[0].classList.add("border-accent-blue", "border-dashed");
      };
      wrapper.ondragleave = () => wrapper.children[0].classList.remove("border-accent-blue", "border-dashed");
      wrapper.ondrop = async (e) => {
        e.preventDefault();
        wrapper.children[0].classList.remove("border-accent-blue", "border-dashed");
        const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
        if (fromIndex !== index) await handleDragReorder(fromIndex, index, filtered);
      };
    }

    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-end min-h-[130px] border-2 border-transparent transition cursor-pointer hover:-translate-y-1 hover:shadow-md break-words";
    card.id = `card-${item.id}`;
    
    // Re-apply highlight if this card was recently copied
    if(activeCardId === item.id) {
      card.classList.add("ring-4", "ring-accent-green", "bg-green-50");
    }

    card.innerHTML = `
      <div class="text-lg font-semibold text-gray-900 mb-1 break-words">${escapeHtml(item.title)}</div>
      <div class="text-[13px] text-gray-500 break-words">${escapeHtml(item.subtitle || "")}</div>
    `;

    card.onclick = () => {
      if (item.type === "link") {
        window.copyAndHighlight(item.content, null, item.id);
        triggerFileDownload(item.content, "Opening Link");
      } else {
        openViewer(item);
      }
    };

    wrapper.appendChild(card);

    if (isGlobalEditMode) {
      const controls = document.createElement("div");
      controls.className = "absolute -top-2 -right-2 flex gap-1.5 z-10";
      controls.innerHTML = `
        <button class="w-7 h-7 rounded-full bg-accent-blue text-white font-bold shadow-md flex items-center justify-center" onclick="event.stopPropagation(); window.openEditEntityModal('${item.id}')">✎</button>
        <button class="w-7 h-7 rounded-full bg-accent-red text-white font-bold shadow-md flex items-center justify-center" onclick="event.stopPropagation(); window.deleteEntity('${item.id}')">✕</button>
      `;
      wrapper.appendChild(controls);
    }
    grid.appendChild(wrapper);
  });
}

// Drag & Drop Reorder Logic
async function handleDragReorder(fromIndex, toIndex, currentList) {
  const batch = writeBatch(db);
  const itemToMove = currentList.splice(fromIndex, 1)[0];
  currentList.splice(toIndex, 0, itemToMove);
  
  currentList.forEach((item, idx) => {
    batch.update(doc(db, "items", item.id), { order_index: idx });
  });
  await batch.commit();
}

// ==========================================
// 5. COPY & HIGHLIGHT LOGIC
// ==========================================
window.copyAndHighlight = async (text, btnId, cardId, listRowIdx = null) => {
  navigator.clipboard.writeText(text).then(async () => {
    
    // 1. Change the button color/text inside the modal
    if (btnId) {
      const btn = document.getElementById(btnId);
      if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        btn.classList.remove("bg-gray-100", "text-accent-blue");
        btn.classList.add("bg-accent-green", "text-white");
        
        setTimeout(() => {
          if(btn) {
            btn.innerText = originalText;
            btn.classList.remove("bg-accent-green", "text-white");
            btn.classList.add("bg-gray-100", "text-accent-blue");
          }
        }, 10000);
      }
    }

    // 2. Highlight the Card on the main screen
    if (cardId) {
      if (activeCardTimer) clearTimeout(activeCardTimer);
      if (activeCardId) {
        const oldCard = document.getElementById(`card-${activeCardId}`);
        if (oldCard) oldCard.classList.remove("ring-4", "ring-accent-green", "bg-green-50");
      }
      
      activeCardId = cardId;
      const card = document.getElementById(`card-${cardId}`);
      if (card) card.classList.add("ring-4", "ring-accent-green", "bg-green-50");
      
      activeCardTimer = setTimeout(() => {
        const currentCard = document.getElementById(`card-${activeCardId}`);
        if (currentCard) currentCard.classList.remove("ring-4", "ring-accent-green", "bg-green-50");
        activeCardId = null;
      }, 10000);
    }

    // 3. Auto-Check Box if it's a List Item
    if (listRowIdx !== null && activeModalItem && activeModalItem.type === 'list') {
      activeModalItem.group_data[listRowIdx].checked = true;
      await updateDoc(doc(db, "items", activeModalItem.id), { group_data: activeModalItem.group_data });
      renderViewerContent(); 
    }

    showToast("Copied to clipboard!");
  });
};

// ==========================================
// 6. VIEWER MODAL LOGIC (NOTE, LIST, DOC, TEXT, IMG)
// ==========================================
function openViewer(item) {
  activeModalItem = { ...item };
  isModalEditMode = false;
  document.getElementById("viewerTitle").innerText = item.title;

  const toggleBtn = document.getElementById("modalEditToggleBtn");
  toggleBtn.style.display = (item.type === "pdf" || item.type === "script") ? "none" : "block";
  toggleBtn.innerText = "Edit";

  renderViewerContent();
  document.getElementById("viewerModal").classList.remove("hidden");
  document.getElementById("viewerModal").classList.add("flex");
}

window.closeViewerModal = () => {
  document.getElementById("viewerModal").classList.add("hidden");
  document.getElementById("viewerModal").classList.remove("flex");
};

function renderViewerContent() {
  const container = document.getElementById("viewerBody");
  container.innerHTML = "";
  const item = activeModalItem;

  // NOTE TYPE
  if (item.type === "note") {
    const textarea = document.createElement("textarea");
    textarea.className = "w-full min-h-[250px] bg-gray-50 rounded-xl p-4 text-[15px] text-gray-900 outline-none focus:ring-2 ring-accent-blue resize-y break-words whitespace-pre-wrap";
    textarea.value = item.content || "";
    textarea.disabled = !isModalEditMode;
    textarea.oninput = (e) => { activeModalItem.content = e.target.value; };
    container.appendChild(textarea);

    const btnRow = document.createElement("div");
    btnRow.className = "flex gap-3 mt-4";

    const copyBtn = document.createElement("button");
    copyBtn.id = "note-copy-btn";
    copyBtn.className = "flex-1 bg-gray-100 text-accent-blue py-3.5 rounded-xl text-[15px] font-semibold transition";
    copyBtn.innerText = "Copy Note";
    copyBtn.onclick = () => window.copyAndHighlight(item.content, "note-copy-btn", item.id);
    btnRow.appendChild(copyBtn);

    if (isModalEditMode) {
      const saveBtn = document.createElement("button");
      saveBtn.className = "flex-1 bg-accent-blue text-white py-3.5 rounded-xl text-[15px] font-semibold transition";
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

  // LIST TYPE
  else if (item.type === "list") {
    let columns = [];
    try { columns = JSON.parse(item.content) || ["Copy/paste"]; } catch(e) { columns = ["Copy/paste"]; }
    let listData = [...(item.group_data || [])];

    listData.sort((a, b) => {
      const vA = (a.cells[0] || "").toString().replace(/\./g, '');
      const vB = (b.cells[0] || "").toString().replace(/\./g, '');
      return vA.localeCompare(vB, undefined, { numeric: true, sensitivity: 'base' });
    });

    const topActions = document.createElement("div");
    topActions.className = "flex flex-wrap gap-2 mb-4";
    topActions.innerHTML = `
      <button class="bg-gray-100 text-accent-blue px-3 py-1.5 rounded-lg text-xs font-bold" id="copy-all-btn">Copy All Data</button>
      <button class="bg-gray-100 text-accent-blue px-3 py-1.5 rounded-lg text-xs font-bold" onclick="window.uncheckAllList()">Uncheck All</button>
    `;
    container.appendChild(topActions);

    document.getElementById("copy-all-btn").onclick = () => {
      const text = listData.map(r => r.cells.join("\t")).join("\n");
      window.copyAndHighlight(text, "copy-all-btn", item.id);
    };

    window.uncheckAllList = async () => {
      const updated = listData.map(r => ({ ...r, checked: false }));
      await saveInnerGroupData(updated);
    };

    const tableWrap = document.createElement("div");
    tableWrap.className = "overflow-x-auto mb-4";
    const table = document.createElement("table");
    table.className = "w-full text-left border-collapse min-w-[300px]";

    let theadHtml = `<thead><tr><th class="w-10 pb-2"></th>`;
    columns.forEach(col => { theadHtml += `<th class="text-xs text-gray-500 uppercase pb-2 border-b border-gray-200">${escapeHtml(col)}</th>`; });
    if (isModalEditMode) theadHtml += `<th class="w-10 pb-2 border-b border-gray-200"></th>`;
    theadHtml += `</tr></thead>`;
    table.innerHTML = theadHtml;

    const tbody = document.createElement("tbody");
    listData.forEach((row, rIdx) => {
      const tr = document.createElement("tr");

      const tdCheck = document.createElement("td");
      tdCheck.className = "p-2 border-b border-gray-100";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "w-5 h-5 accent-accent-green cursor-pointer";
      checkbox.checked = !!row.checked;
      checkbox.onchange = async () => {
        listData[rIdx].checked = checkbox.checked;
        await saveInnerGroupData(listData);
      };
      tdCheck.appendChild(checkbox);
      tr.appendChild(tdCheck);

      row.cells.forEach((cell, cIdx) => {
        const td = document.createElement("td");
        td.className = "p-2 border-b border-gray-100 text-sm break-words whitespace-normal";
        if (isModalEditMode) {
          const inp = document.createElement("input");
          inp.className = "w-full bg-gray-50 p-2 rounded outline-none focus:ring-2 ring-accent-blue";
          inp.value = cell;
          inp.onchange = async (e) => {
            listData[rIdx].cells[cIdx] = e.target.value;
            await saveInnerGroupData(listData);
          };
          td.appendChild(inp);
        } else {
          const span = document.createElement("span");
          span.id = `list-copy-${rIdx}-${cIdx}`;
          span.className = "cursor-pointer bg-gray-50 text-gray-900 px-2 py-1 rounded hover:bg-blue-50 transition block w-full";
          span.innerText = cell || "—";
          span.onclick = () => window.copyAndHighlight(cell, span.id, item.id, rIdx);
          td.appendChild(span);
        }
        tr.appendChild(td);
      });

      if (isModalEditMode) {
        const tdDel = document.createElement("td");
        tdDel.className = "p-2 border-b border-gray-100 text-center";
        tdDel.innerHTML = `<button class="text-accent-red font-bold" onclick="window.deleteListRow('${row.id}')">✕</button>`;
        tr.appendChild(tdDel);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    container.appendChild(tableWrap);

    window.deleteListRow = async (rowId) => {
      const updated = listData.filter(r => r.id !== rowId);
      await saveInnerGroupData(updated);
    };

    if (isModalEditMode) {
      const addRowBtn = document.createElement("button");
      addRowBtn.className = "bg-gray-100 text-accent-blue px-4 py-2 rounded-xl text-[13px] font-semibold";
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
    list.className = "flex flex-col";
    
    (item.group_data || []).forEach((entry, idx) => {
      const row = document.createElement("div");
      
      if (isModalEditMode) {
        row.className = "flex items-center gap-3 py-3 border-b border-gray-100";
        row.innerHTML = `
          <div class="flex-1 flex flex-col gap-2">
            <input type="text" class="w-full bg-gray-50 p-2 rounded outline-none focus:ring-2 ring-accent-blue text-sm" value="${escapeHtml(entry.label)}" onchange="window.updateGroupEntry(${idx}, 'label', this.value)" />
            <input type="text" class="w-full bg-gray-50 p-2 rounded outline-none focus:ring-2 ring-accent-blue text-sm" value="${escapeHtml(entry.value)}" onchange="window.updateGroupEntry(${idx}, 'value', this.value)" />
          </div>
          <button class="text-accent-red text-xl font-bold p-2" onclick="window.deleteGroupEntry(${idx})">✕</button>
        `;
      } else {
        // Mobile-friendly stacking
        row.className = "flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100 gap-2";
        row.innerHTML = `
          <div class="flex flex-col w-full break-words pr-2">
            <div class="text-[11px] font-bold text-gray-500 uppercase">${escapeHtml(entry.label)}</div>
            <div class="text-[15px] text-gray-900 break-words whitespace-normal">${escapeHtml(entry.value)}</div>
          </div>
          <button id="copy-btn-${idx}" class="shrink-0 bg-gray-100 text-accent-blue px-4 py-2 rounded-xl text-[13px] font-semibold hover:bg-gray-200 transition" onclick="window.copyAndHighlight('${escapeHtml(entry.value).replace(/'/g, "\\'")}', 'copy-btn-${idx}', '${item.id}')">Copy</button>
        `;
      }
      list.appendChild(row);
    });
    container.appendChild(list);

    if (isModalEditMode) {
      const addEntryBtn = document.createElement("button");
      addEntryBtn.className = "mt-4 bg-gray-100 text-accent-blue px-4 py-2 rounded-xl text-[13px] font-semibold";
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
      block.className = "mb-6 flex flex-col gap-2";

      if (isModalEditMode) {
        const delImgBtn = document.createElement("button");
        delImgBtn.className = "text-accent-red text-sm font-bold self-start mb-1";
        delImgBtn.innerText = "✕ Remove Image";
        delImgBtn.onclick = async () => {
          const updated = item.group_data.filter((_, i) => i !== idx);
          await saveInnerGroupData(updated);
        };
        block.appendChild(delImgBtn);
      }

      const label = document.createElement("div");
      label.className = "text-[11px] font-bold text-gray-500 uppercase";
      label.innerText = img.label;
      block.appendChild(label);

      const image = document.createElement("img");
      image.className = "w-full rounded-xl bg-gray-50 object-contain max-h-[400px]";
      image.src = img.url;
      block.appendChild(image);

      const saveBtn = document.createElement("button");
      saveBtn.className = "bg-gray-100 text-accent-blue px-4 py-2 rounded-xl text-[13px] font-semibold self-start mt-1 hover:bg-gray-200";
      saveBtn.innerText = "Download / View Image";
      saveBtn.onclick = () => triggerFileDownload(img.url, img.label + ".jpg");
      block.appendChild(saveBtn);

      container.appendChild(block);
    });

    if (isModalEditMode) {
      const btnRow = document.createElement("div");
      btnRow.className = "flex flex-wrap gap-2 mt-2";
      
      const addImgBtn = document.createElement("button");
      addImgBtn.className = "bg-gray-100 text-accent-blue px-4 py-2 rounded-xl text-[13px] font-semibold";
      addImgBtn.innerText = "+ Paste Image Link";
      addImgBtn.onclick = async () => {
        const label = prompt("Enter Image Label:");
        const url = prompt("Enter Image URL (e.g. assets/pic.jpg or web url):");
        if (label && url) {
          const updated = [...(item.group_data || []), { label, url }];
          await saveInnerGroupData(updated);
        }
      };

      const uploadImgLabel = document.createElement("label");
      uploadImgLabel.className = "bg-accent-blue text-white px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer flex items-center justify-center";
      uploadImgLabel.innerHTML = `+ Upload Photo <input type="file" accept="image/*" class="hidden" onchange="window.uploadImageItem(this)" />`;

      btnRow.appendChild(addImgBtn);
      btnRow.appendChild(uploadImgLabel);
      container.appendChild(btnRow);
    }
  }

  // PDF & SCRIPT TYPES
  else if (item.type === "pdf" || item.type === "script") {
    const isPdf = item.type === "pdf";
    const iframe = document.createElement("iframe");
    iframe.className = "w-full h-[55vh] border-none rounded-xl mb-4 bg-gray-50";
    iframe.src = item.content;
    container.appendChild(iframe);

    const extractBtn = document.createElement("button");
    extractBtn.className = "w-full bg-accent-blue text-white py-3.5 rounded-xl text-[15px] font-semibold transition hover:bg-accent-hover";
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
// 7. EDIT & CREATE FORMS
// ==========================================
function updateEditModeUI() {
  document.getElementById("toggleGlobalEditBtn").style.display = isGlobalEditMode ? "none" : "block";
  document.getElementById("openCreateModalBtn").style.display = isGlobalEditMode ? "block" : "none";
  document.getElementById("doneGlobalEditBtn").style.display = isGlobalEditMode ? "block" : "none";
  if (activeCategory) renderCategory(activeCategory);
}

document.getElementById("toggleGlobalEditBtn").onclick = () => { isGlobalEditMode = true; updateEditModeUI(); };
document.getElementById("doneGlobalEditBtn").onclick = () => { isGlobalEditMode = false; updateEditModeUI(); };

window.deleteEntity = async function(id) {
  if (confirm("Delete this entity permanently?")) {
    await deleteDoc(doc(db, "items", id));
    showToast("Entity deleted");
  }
};

window.openEditEntityModal = function(itemId = null) {
  const form = document.getElementById("entityForm");
  form.reset();

  const item = itemId ? allItems.find(i => i.id === itemId) : null;
  const isEditing = !!item;
  
  document.getElementById("formModalTitle").innerText = isEditing ? "Edit Entity" : "Create New Entity";
  document.getElementById("formEntityId").value = isEditing ? item.id : "";
  document.getElementById("formTitle").value = isEditing ? item.title : "";
  document.getElementById("formSubtitle").value = isEditing ? (item.subtitle || "") : "";
  document.getElementById("formContent").value = isEditing ? (item.content || "") : "";

  setupTypeSelector(isEditing ? item.type : null);
  document.getElementById("formModal").classList.remove("hidden");
  document.getElementById("formModal").classList.add("flex");
};

window.closeFormModal = () => {
  document.getElementById("formModal").classList.add("hidden");
  document.getElementById("formModal").classList.remove("flex");
};

function setupTypeSelector(existingType) {
  const container = document.getElementById("typeSelectorGroup");
  container.innerHTML = "";

  let allowedTypes = [];

  // Strictly bind exact types per category to avoid clutter
  if (activeCategory === "notepad-category") {
    allowedTypes = [{ id: 'note', label: 'Note' }, { id: 'list', label: 'List' }];
  } else if (activeCategory === "pdf-category") {
    allowedTypes = [{ id: 'pdf', label: 'Document (PDF)' }];
  } else if (activeCategory === "text-category") {
    allowedTypes = [{ id: 'text_group', label: 'Text Group' }];
  } else if (activeCategory === "image-category") {
    allowedTypes = [{ id: 'image_group', label: 'Photo Gallery' }];
  } else if (activeCategory === "pc-automation") {
    allowedTypes = [{ id: 'script', label: 'Script File' }];
  } else {
    allowedTypes = [{ id: 'link', label: 'Web Link' }];
  }

  let currentType = existingType && allowedTypes.find(t => t.id === existingType) 
    ? existingType 
    : allowedTypes[0].id;

  allowedTypes.forEach(t => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `type-choice-btn flex-1 min-w-[70px] p-2.5 rounded-lg border text-[13px] font-semibold transition ${t.id === currentType ? 'bg-accent-blue border-accent-blue text-white' : 'bg-white border-gray-200 text-gray-900'}`;
    btn.innerText = t.label;
    btn.dataset.type = t.id;
    btn.onclick = () => {
      document.querySelectorAll(".type-choice-btn").forEach(b => {
        b.classList.remove("bg-accent-blue", "border-accent-blue", "text-white");
        b.classList.add("bg-white", "border-gray-200", "text-gray-900");
      });
      btn.classList.remove("bg-white", "border-gray-200", "text-gray-900");
      btn.classList.add("bg-accent-blue", "border-accent-blue", "text-white");
      updateFormVisibility(t.id);
    };
    container.appendChild(btn);
  });

  updateFormVisibility(currentType);
}

function updateFormVisibility(type) {
  const isList = type === "list";
  const isTextGroup = type === "text_group";
  const isImageGroup = type === "image_group";
  const isFile = type === "pdf" || type === "script";
  const isLink = type === "link";
  const isNote = type === "note";

  document.getElementById("listFieldsContainer").style.display = isList ? "block" : "none";
  
  const urlContainer = document.getElementById("urlFieldContainer");
  const contentLabel = document.getElementById("contentLabel");
  const contentInput = document.getElementById("formContent");
  const uploadBtn = document.getElementById("uploadButtonContainer");
  const hintText = document.getElementById("uploadStatusText");

  if (isTextGroup || isImageGroup || isList) {
    urlContainer.style.display = "none";
  } else {
    urlContainer.style.display = "block";
    
    if (isFile) {
      contentLabel.innerText = "FILE LINK OR DIRECT UPLOAD";
      contentInput.placeholder = "https://... or assets/filename.pdf";
      uploadBtn.style.display = "flex";
      hintText.innerText = "Tip: Paste a cloud link (like MEGA), or click 'Upload File' to auto-upload to Google Drive.";
    } else if (isLink) {
      contentLabel.innerText = "WEBSITE URL";
      contentInput.placeholder = "https://...";
      uploadBtn.style.display = "none";
      hintText.innerText = "Tip: Paste the direct web link here. It will open in a new browser tab.";
    } else if (isNote) {
      contentLabel.innerText = "NOTE TEXT";
      contentInput.placeholder = "Write your note here...";
      uploadBtn.style.display = "none";
      hintText.innerText = "Tip: This is the main content of your note. You can edit it anytime.";
    }
  }
}

document.getElementById("openCreateModalBtn").onclick = () => window.openEditEntityModal();

document.getElementById("entityForm").onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById("formEntityId").value;
  const title = document.getElementById("formTitle").value;
  const subtitle = document.getElementById("formSubtitle").value;
  
  const selectedTypeBtn = document.querySelector(".type-choice-btn.bg-accent-blue");
  const type = selectedTypeBtn ? selectedTypeBtn.dataset.type : "link";
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

  window.closeFormModal();
};

// ==========================================
// 8. GLOBAL UTILITIES (Download, Toast, Drawers)
// ==========================================
function triggerFileDownload(url, filename) {
  // Mobile Safe Open/Download mechanism
  window.open(url, '_blank');
  showToast("Opening " + filename);
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.remove("translate-y-[100px]");
  setTimeout(() => t.classList.add("translate-y-[100px]"), 2000);
}

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

const mobileDrawer = document.getElementById("mobileDrawer");
document.getElementById("mobileMenuBtn").onclick = () => mobileDrawer.classList.remove("translate-x-full");
window.closeMobileDrawer = () => mobileDrawer.classList.add("translate-x-full");

// ==========================================
// 9. GOOGLE DRIVE UPLOAD LOGIC
// ==========================================
document.getElementById("formFileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const statusText = document.getElementById("uploadStatusText");
  const urlInput = document.getElementById("formContent");
  
  statusText.innerText = `Uploading ${file.name} to Google Drive... Please wait.`;
  statusText.classList.replace("text-gray-500", "text-accent-blue");

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
        statusText.classList.replace("text-accent-blue", "text-accent-green");
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      statusText.innerText = "Upload failed. Try entering a URL manually.";
      statusText.classList.replace("text-accent-blue", "text-accent-red");
    }
  };
  e.target.value = "";
});

window.uploadImageItem = async function(input) {
  const file = input.files[0];
  if (!file) return;
  const label = prompt("Enter a label for this photo:") || "Uploaded Photo";
  
  input.parentElement.innerText = "Uploading... Please wait.";

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
        const updated = [...(activeModalItem.group_data || []), { label, url: result.url }];
        await saveInnerGroupData(updated);
        showToast("Photo uploaded successfully!");
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      alert("Upload failed. Please try again.");
      renderViewerContent(); // reset UI
    }
  };
};

setupNavigation();
initDatabase();