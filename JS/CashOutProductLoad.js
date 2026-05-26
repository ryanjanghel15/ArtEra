let btnTextContent = "Place Order";
const ProductDisplay = document.querySelector("#product-display");
const ProductDescription = document.querySelector("#product-description");
const ProductPrice = document.querySelector("#display-price");
const ProductImgDisplay = document.getElementById('img_display');
let DataRequirements = window.localStorage.getItem('ProductDataNeed');
const selectionslotEl = document.getElementById('selectslot');
const payBlockArea = document.querySelector(".payBlock");
const PaymentBtnEl = document.getElementById("PaymentBtn");
const TransactionIDInEl = document.getElementById('TransactionIDIn');
const cardHeaderEl = document.querySelector(".card-header");
let paymentClaim = false;
console.log(DataRequirements);

cardHeaderEl.style.display = "none";


PaymentBtnEl.addEventListener('click', () => {
    if (TransactionIDInEl.value.length == 12) {
        window.localStorage.setItem('TransactID', TransactionIDInEl.value);
        paymentClaim = true;
        clearStatus();
        buildForm(headers);
    }
    else {
        showStatus("text-danger", "Your Transaction ID seems Wrong, Please Check...");
    }

});


class ProductData {
    constructor(data) {
        this.RawData = data;
        this.DataSet = this.RawData.split(";");

        // ['amount', 'size']
        this.DataArguments = this.DataSet.map(ds => ds.split(':')[0].trim());

        // ['1,2,3,4', '1l,2l,5l']
        this.DataValues = this.DataSet.map(ds => ds.split(':')[1].trim());

        // { amount: ['1','2','3','4'], size: ['1l','2l','5l'] }
        this.Parsed = {};
        this.DataArguments.forEach((arg, i) => {
            this.Parsed[arg] = this.DataValues[i].split(',').map(v => v.trim());
        });
        this.selections = [];
        this.DataArguments.forEach((arg) => {
            this.selections[arg] = this.Parsed[arg][0];
        });
        this.Data = '';
    }

    // Call this after user picks options, pass in their selections
    fillData() {
        this.selections = [];
        document.querySelectorAll(".selectBox").forEach((Sb) => {
            let string = `${Sb.name}:${Sb.value}`
            this.selections.push(string);
            console.log(string);
        });

    }
    FormatData() {
        ;
        window.localStorage.setItem('Data', this.selections.join(';'));
    }
    Debug() {
        console.log("DataArguments:", this.DataArguments);
        console.log("DataValues:", this.DataValues);
        console.log("Parsed:", this.Parsed);
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

NewProductData.DataArguments.forEach((da) => {
    const options = NewProductData.Parsed[da].map(v => `<option value="${v}">${v}</option>`).join('');
    selectionslotEl.innerHTML += `<label>${da}:</label> <select class="selectBox" name="${da}" id="${da}El">${options}</select>`;

});
// Set initial _data value based on defaults
requestData["_data"] = NewProductData.fillData(NewProductData.selections);


// ── 2. Build form dynamically from headers ─────────────
function buildForm(headers) {

    formFields.innerHTML = "";
    cardHeaderEl.style.display = "block";
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

    payBlockArea.style.display = 'none'
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
    if (paymentClaim == false) {
        showStatus("text-warning", `Please fill in: You Haven't Given Your Transaction ID`);
        submitBtn.classList.remove('btn-outline-success');
        submitBtn.classList.add('btn-warning');
        submitBtn.innerHTML = `<ion-icon class="spinner" name="reload-outline"></ion-icon>Retry`;
        return false;
    }

    return true;
}

// ── 4. Send data to spreadsheet ────────────────────────
async function requestDataToTb() {
    NewProductData.fillData();
    NewProductData.FormatData();
    headers.filter(key => key.startsWith("_")).forEach(key => {
        const localKey = key.replace("_", "");
        requestData[key] = window.localStorage.getItem(localKey) || "";
    });

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