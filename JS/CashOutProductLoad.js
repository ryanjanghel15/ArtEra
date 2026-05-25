let btnTextContent = "Place Order";
const ProductDisplay = document.querySelector("#product-display");
const ProductDescription = document.querySelector("#product-description");
const ProductPrice = document.querySelector("#display-price");
const ProductImgDisplay = document.getElementById('img_display');
let DataRequirements = window.localStorage.getItem('ProductDataNeed');
console.log(DataRequirements);

class ProductData {
    constructor(data){
        this.RawData = data
        this.DataSet = this.RawData.split(";")
    }
    Debug(){
        console.log(this.DataSet);
    }
}
NewProductData = new ProductData(DataRequirements);

NewProductData.Debug();

ProductDisplay.innerHTML = `<span id="product-name">${window.localStorage.getItem('ProductName')}</span>  <span id="product-price">${window.localStorage.getItem('ProductPrice')}</span>`
ProductDescription.textContent = window.localStorage.getItem('ProductDescription');
ProductImgDisplay.src = window.localStorage.getItem('ProductImage');
console.log(window.localStorage.getItem('ProductPrice'));
// ╔══════════════════════════════════════════════════════╗
//  CONFIG — paste your deployed Apps Script URL here
// ╚══════════════════════════════════════════════════════╝
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZpqcdEzeSepuwXstm8Su2P-Kw8wDZAMfSeD9QJxQ8y8s9KxIarPy2AYbaGCVU1bZS/exec";

// ── State ──────────────────────────────────────────────
const requestData = {};       // holds { fieldName: value, ... }
let headers = [];       // column names from row 1

// ── DOM refs ───────────────────────────────────────────
const formFields = document.getElementById("form-fields");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");

// ── 1. Fetch headers on page load ──────────────────────
async function loadHeaders() {
    try {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=getHeaders`);
        const json = await res.json();

        if (!json.success) throw new Error(json.error);

        headers = json.headers; //What Request Im Asking (Taged By Ryan 🫡)
        console.log(headers);
        buildForm(headers);
        submitBtn.disabled = false;

    } catch (err) {
        formFields.innerHTML = "";
        showStatus("text-danger", "Failed to connect: " + err.message + " Report This Error To +91 8806664816 or 9009320505");
        console.error("[loadHeaders]", err);
        submitBtn.innerHTML = "Error";
        submitBtn.classList.remove("btn-outline-success");
        submitBtn.classList.add("btn-danger");
    }
}

// ── 2. Build form dynamically from headers ─────────────
function buildForm(headers) {


    formFields.innerHTML = "";

    headers.forEach((key, i) => {
        // Auto-filled fields: prefixed with "_", skip rendering, assign JS value
        if (key.startsWith("_")) {
            const localKey = key.replace("_", "");
            requestData[key] = window.localStorage.getItem(localKey) || "";
            return;
        }

        // Initialise requestData property (user-filled fields only)
        requestData[key] = "";
        // ... rest stays exactly the same

        // Detect input type from header hint (e.g. "email:email", "date:date")
        let label = key;
        let type = "text";

        if (key.includes(":")) {
            const parts = key.split(":");
            label = parts[0].trim();
            type = parts[1].trim();
        }

        const group = document.createElement("span");
        group.className = "field-group";
        group.style.animationDelay = `${i * 40}ms`;

        const input = document.createElement("input");
        input.id = `field-${key}`;
        input.type = type;
        input.placeholder = label;
        input.dataset.key = key;

        // Keep requestData in sync
        input.addEventListener("input", () => {
            requestData[key] = input.value.trim();
            input.classList.remove("error");
        });
        group.appendChild(input);
        input.className = "field-name";
        formFields.appendChild(group);
        submitBtn.innerHTML = btnTextContent;
    });

}

// ── 3. Validate ────────────────────────────────────────
function validate() {

    const missing = headers.filter(key =>
        !key.startsWith("_") &&
        (!requestData[key] || requestData[key] === "")
    );

    if (missing.length > 0) {
        missing.forEach(key => {
            const input = document.querySelector(`[data-key="${key}"]`);
            if (input) input.classList.add("error");
            console.error(`[validation] Missing required field: "${key}"`);
        });
        showStatus("text-warning", `Please fill in: ${missing.join(", ")}`);
        submitBtn.classList.remove('btn-outline-success');
        submitBtn.classList.add('btn-warning');
        submitBtn.innerHTML = `<ion-icon class="spinner" name="reload-outline"></ion-icon>Retry`;
        return false;
    }

    return true;
}

// ── 4. Send data to spreadsheet ────────────────────────
async function requestDataToTb() {
    if (!validate()) return;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"><ion-icon name="sparkles-outline"></ion-icon></span> Processing…`;
    clearStatus();
    console.log("[requestData before send]", JSON.stringify(requestData));

    try {
        const res = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" }, // Apps Script requires text/plain for doPost
            body: JSON.stringify({ action: "appendRow", data: { ...requestData } })
        });

        const json = await res.json();

        if (!json.success) throw new Error(json.error);

        showStatus("text-success", "✓ Order Placed!!!");
        resetForm();
        console.log("[requestDataToTb] Success:", requestData);

    } catch (err) {
        showStatus("text-danger", "Send failed: " + err.message);
        console.error("[requestDataToTb]", err);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnTextContent;
        submitBtn.classList.remove('btn-warning');
        submitBtn.classList.remove('btn-danger');
        submitBtn.classList.add('btn-outline-success');

    }
}

// ── Helpers ────────────────────────────────────────────
function resetForm() {
    headers.forEach(key => {
        requestData[key] = "";
        const input = document.querySelector(`[data-key="${key}"]`);
        if (input) { input.value = ""; input.classList.remove("error"); }
    });
}

function showStatus(type, msg) {
    statusEl.className = type;
    statusEl.textContent = msg;
}

function clearStatus() {
    statusEl.className = "";
    statusEl.textContent = "";
}


// ── Wire submit button ─────────────────────────────────
submitBtn.addEventListener("click", requestDataToTb);

// ── Kick off ───────────────────────────────────────────
loadHeaders();