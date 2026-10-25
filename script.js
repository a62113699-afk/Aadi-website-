const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primaryNav");
menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));
const yearNode = document.getElementById("year");
if (yearNode) yearNode.textContent = new Date().getFullYear();

// GitHub Pages is static; this admin form publishes files through the GitHub Contents API.
const REPO_OWNER = "a62113699-afk";
const REPO_NAME = "Aadi-website-";
const BRANCH = "main";
const MATERIALS_PATH = "materials.json";
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MATERIALS_URL = `https://${REPO_OWNER}.github.io/${REPO_NAME}/materials.json`;
const uploadedMaterials = document.getElementById("uploadedMaterials");
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
async function loadMaterials() {
  if (!uploadedMaterials) return;
  try {
    const response = await fetch(`${MATERIALS_URL}?t=${Date.now()}`, {cache:"no-store"});
    if (!response.ok) throw new Error("Catalogue is not published yet.");
    const data = await response.json();
    const items = Array.isArray(data.materials) ? data.materials : [];
    if (!items.length) {
      uploadedMaterials.innerHTML = '<h3>Materials uploaded by Biolytica admins</h3><p class="materials-loading">No materials uploaded yet. New approved uploads will appear here.</p>';
      return;
    }
    uploadedMaterials.innerHTML = '<h3>Materials uploaded by Biolytica admins</h3><div class="materials-list">' + items.slice().reverse().map(item => `<article class="material-item"><small>${escapeHTML(item.category)}${item.year ? ' · '+escapeHTML(item.year) : ''}</small><h4>${escapeHTML(item.title)}</h4><a href="${escapeHTML(item.url)}" target="_blank" rel="noopener">Open / download ↗</a></article>`).join('') + '</div>';
  } catch (error) {
    uploadedMaterials.innerHTML = '<h3>Materials uploaded by Biolytica admins</h3><p class="materials-loading">The material catalogue will appear here after the first GitHub Pages deployment.</p>';
  }
}
loadMaterials();
const uploadForm = document.getElementById("materialUploadForm");
const uploadStatus = document.getElementById("uploadStatus");
const uploadButton = document.getElementById("uploadMaterialButton");
function setUploadStatus(message, error=false) { if (uploadStatus) { uploadStatus.textContent = message; uploadStatus.style.color = error ? "#a33131" : "var(--muted)"; } }
async function githubRequest(path, token, options={}) {
  const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    ...options, headers:{"Accept":"application/vnd.github+json","Authorization":`Bearer ${token}`,"X-GitHub-Api-Version":"2022-11-28", ...(options.headers||{})}
  });
  const body = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(body.message || `GitHub request failed (${response.status}).`);
  return body;
}
function base64FromFile(file) {
  return new Promise((resolve,reject)=>{
    const reader=new FileReader(); reader.onload=()=>resolve(String(reader.result).split(',')[1]); reader.onerror=()=>reject(new Error('Could not read the selected file.')); reader.readAsDataURL(file);
  });
}
if (uploadForm) uploadForm.addEventListener("submit", async event => {
  event.preventDefault();
  const token = document.getElementById("githubToken").value.trim();
  const title = document.getElementById("materialTitle").value.trim();
  const category = document.getElementById("materialCategory").value;
  const year = document.getElementById("materialYear").value;
  const file = document.getElementById("materialFile").files[0];
  if (!file || !title || !token) return setUploadStatus("Enter a token, title and file before uploading.", true);
  if (file.size > MAX_FILE_SIZE) return setUploadStatus("This file exceeds 20 MB. Please compress it or use a smaller file.", true);
  if (file.size === 0) return setUploadStatus("The selected file is empty.", true);
  uploadButton.disabled = true; uploadButton.textContent = "Uploading…";
  try {
    setUploadStatus("Checking repository access…");
    const ext = (file.name.match(/\.[a-z0-9]+$/i)||[''])[0].toLowerCase();
    const safeBase = file.name.replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70) || 'study-material';
    const filePath = `study-materials/${category.toLowerCase().replace(/[^a-z0-9-]/g,'-')}/${Date.now()}-${safeBase}${ext}`;
    const content = await base64FromFile(file);
    await githubRequest(filePath, token, {method:"PUT",body:JSON.stringify({message:`Add study material: ${title}`,content,branch:BRANCH})});
    setUploadStatus("File uploaded. Updating the public materials catalogue…");
    let current = {materials:[]}, sha;
    try { const catalogue = await githubRequest(MATERIALS_PATH, token); sha=catalogue.sha; current=JSON.parse(decodeURIComponent(escape(atob(catalogue.content.replace(/
/g,''))))); if (!Array.isArray(current.materials)) current.materials=[]; }
    catch (e) { if (!String(e.message).includes("Not Found")) throw e; }
    const publicUrl = `https://${REPO_OWNER}.github.io/${REPO_NAME}/${filePath}`;
    current.materials.push({title,category,year:year || '',filename:file.name,path:filePath,url:publicUrl,addedAt:new Date().toISOString()});
    const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(current,null,2))));
    await githubRequest(MATERIALS_PATH, token, {method:"PUT",body:JSON.stringify({message:`Update study material catalogue: ${title}`,content:updatedContent,branch:BRANCH,...(sha?{sha}:{})})});
    document.getElementById("githubToken").value = "";
    uploadForm.reset();
    setUploadStatus("Upload committed successfully. GitHub Pages usually updates within 1–3 minutes; refresh the page afterwards.");
    setTimeout(loadMaterials, 4000);
  } catch (error) {
    setUploadStatus(`Upload failed: ${error.message} Check that your fine-grained token has Contents: Read and write access to this repository and that the default branch is “main”.`, true);
  } finally { uploadButton.disabled=false; uploadButton.textContent="Upload and publish material ↗"; }
});
