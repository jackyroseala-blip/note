-
// ==========================
// CLOCKS
// ==========================

document.addEventListener("DOMContentLoaded", function () {

    function updateClocks() {
        const now = new Date();

        // Philippines Time
        document.getElementById("phTime").textContent =
            now.toLocaleTimeString("en-US", {
                timeZone: "Asia/Manila",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });

        // Central Time
        document.getElementById("ctTime").textContent =
            now.toLocaleTimeString("en-US", {
                timeZone: "America/Chicago",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });
    }

    updateClocks();
    setInterval(updateClocks, 1000);

});
// ==========================
// ELEMENTS
// ==========================

const noteBtn = document.getElementById("noteTabBtn");
const historyBtn = document.getElementById("historyTabBtn");

const noteTab = document.getElementById("noteTab");
const historyTab = document.getElementById("historyTab");

const copyBtn = document.getElementById("copyNoteBtn");

// ==========================
// TAB SWITCHING
// ==========================

noteBtn.addEventListener("click", () => {

    noteTab.classList.remove("hidden");
    historyTab.classList.add("hidden");

    noteBtn.classList.add("active");
    historyBtn.classList.remove("active");

});

historyBtn.addEventListener("click", () => {

    historyTab.classList.remove("hidden");
    noteTab.classList.add("hidden");

    historyBtn.classList.add("active");
    noteBtn.classList.remove("active");

    loadHistory();

});

// ==========================
// OTHER RELATIONSHIP
// ==========================

document.getElementById("spokeWith")
.addEventListener("change", function () {

    document.getElementById(
        "otherRelationshipContainer"
    ).style.display =
        this.value === "Other"
            ? "block"
            : "none";

});

// ==========================
// OTHER SHIPPING METHOD
// ==========================

document.getElementById("shippingMethod")
.addEventListener("change", function () {

    document.getElementById(
        "otherShippingContainer"
    ).style.display =
        this.value === "Other"
            ? "block"
            : "none";

});

// ==========================
// CURRENCY FORMAT
// ==========================

document.getElementById("copay")
.addEventListener("blur", function () {

    let num = this.value.replace(/[^\d.]/g, "");

    if (!num) return;

    this.value = Number(num).toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    );

});

// ==========================
// ATTESTATION
// ==========================

document.getElementById("attestation")
.addEventListener("change", function () {

    copyBtn.disabled = !this.checked;

});

// ==========================
// COPY NOTE
// ==========================

copyNoteBtn.addEventListener("click", async () => {

    const spokeWith = document.getElementById("spokeWith");
    const otherRelationship = document.getElementById("otherRelationship");
    const callerName = document.getElementById("callerName");
    const mdOfficeHours = document.getElementById("mdOfficeHours");
    const punr = document.getElementById("punr");
    const orderNumber = document.getElementById("orderNumber");
    const medicationName = document.getElementById("medicationName");
    const medicationCost = document.getElementById("medicationCost");
    const deliveryDate = document.getElementById("deliveryDate");
    const copay = document.getElementById("copay");
    const obeNeeded = document.getElementById("obeNeeded");
    const activeObe = document.getElementById("activeObe");
    const medicaid = document.getElementById("medicaid");
    const sameAddress = document.getElementById("sameAddress");
    const sameMd = document.getElementById("sameMd");
    const shippingAddress = document.getElementById("shippingAddress");
    const growthHormone = document.getElementById("growthHormone");
    const restrictedState = document.getElementById("restrictedState");
    const shippingMethod = document.getElementById("shippingMethod");
    const otherShippingMethod = document.getElementById("otherShippingMethod");

    // Required Validation

    if (!spokeWith.value) {
        alert("Spoke With is required.");
        return;
    }

    if (!callerName.value.trim()) {
        alert("Caller's Name is required.");
        return;
    }

    if (!punr.value) {
        alert("PUNR is required.");
        return;
    }

    if (!deliveryDate.value) {
        alert("Delivery Date is required.");
        return;
    }

    if (!copay.value.trim()) {
        alert("Copay / AR Balance is required.");
        return;
    }

    if (!medicaid.value) {
        alert("Insurance Under Medicaid is required.");
        return;
    }

    if (!sameAddress.value) {
        alert("Address confirmation is required.");
        return;
    }

    if (!shippingAddress.value.trim()) {
        alert("Shipping Address is required.");
        return;
    }

    if (!growthHormone.value) {
        alert("Growth Hormone field is required.");
        return;
    }

    if (!shippingMethod.value) {
        alert("Shipping Method is required.");
        return;
    }

    if (
        shippingMethod.value === "Other" &&
        !otherShippingMethod.value.trim()
    ) {
        alert("Specify Shipping Method.");
        return;
    }

    let note = "";

note += `Spoke with: ${spokeWith.value}\n`;
note += `Office Hours (If Office-Base): ${mdOfficeHours.value || "N"}\n`;
note += `PUNR: ${punr.value}\n`;
note += `Delivery Date: ${deliveryDate.value}\n`;
note += `Medication: ${medicationName.value}\n`;
note += `Copay/ AR Bal: ${copay.value}\n`;
note += `OBE Needed?: ${obeNeeded.value}\n`;
note += `Is there an active OBE?: ${activeObe.value}\n`;
note += `Is the current address the same w/ previous order: ${sameAddress.value}\n`;

if (sameAddress.value === "No") {
    note += `Reason for address change: ${reasonAddress.value || ""}\n`;
} else {
    note += `Reason for address change: NA\n`;
}

note += `If ship to MDO, is it the same MD on the Rx: ${sameMd.value || "NA"}\n`;
note += `Is the insurance under Medicaid: ${medicaid.value}\n`;
note += `Shipping Method: ${
    shippingMethod.value === "Other"
        ? otherShippingMethod.value
        : shippingMethod.value
}\n`;
note += `Shipping Address: ${shippingAddress.value}\n`;
note += `Is the medication a Growth Hormone: ${growthHormone.value}\n`;
note += `Are the state under CO, ID, MN, NV, RI and WV?: ${restrictedState.value}\n`;

if (restrictedState.value === "Yes") {
    note += `If Yes, must be SIG Req: Yes\n`;
} else {
    note += `If Yes, must be SIG Req: N\n`;
}

note += `MEDICATION COST : ${medicationCost.value}\n`;

note += `\n`;
note += `I attest that I have verified with the patient that there are no changes to the insurance on file.`;
   
    try {

        await navigator.clipboard.writeText(note);

    } catch {

        alert("Unable to copy note.");
        return;

    }

    let history =
        JSON.parse(
            localStorage.getItem("caseNotes") || "[]"
        );

    history.unshift({
    type: "DEL SET",
    date: new Date().toLocaleString(),
    note: note
});

    localStorage.setItem(
        "caseNotes",
        JSON.stringify(history)
    );

    alert("Case note copied and saved successfully.");

});

// ==========================
// HISTORY
// ==========================

function loadHistory() {

    const container =
        document.getElementById("historyContainer");

    const history =
        JSON.parse(
            localStorage.getItem("caseNotes") || "[]"
        );

    if (history.length === 0) {

        container.innerHTML = `
            <div class="empty-history">
                No saved case notes yet.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    history.forEach(item => {

        container.innerHTML += `
<div class="history-card">

    <div class="history-date">
        ${item.date}
    </div>

    <div class="history-type ${
        item.type === "STANDARD"
            ? "standard-badge"
            : "delset-badge"
    }">
        ${item.type || "DEL SET"}
    </div>

    <div class="history-note">
        ${item.note.replace(/\n/g, "<br>")}
    </div>

</div>
`;

    });

}

// ==========================
// CLEAR DEL SET
// ==========================

document.getElementById("clearBtn")
.addEventListener("click", () => {

    if (!confirm("Clear DEL SET fields?")) {
        return;
    }

    document.getElementById("spokeWith").selectedIndex = 0;
    document.getElementById("callerName").value = "";
    document.getElementById("otherRelationship").value = "";
    document.getElementById("mdOfficeHours").value = "";
    document.getElementById("punr").selectedIndex = 0;
    document.getElementById("orderNumber").value = "";
    document.getElementById("deliveryDate").value = "";
    document.getElementById("copay").value = "";
    document.getElementById("obeNeeded").selectedIndex = 0;
    document.getElementById("activeObe").selectedIndex = 0;
    document.getElementById("medicaid").selectedIndex = 0;
    document.getElementById("sameAddress").selectedIndex = 0;
    document.getElementById("sameMd").selectedIndex = 0;
    document.getElementById("growthHormone").selectedIndex = 0;
    document.getElementById("restrictedState").selectedIndex = 0;
    document.getElementById("shippingMethod").selectedIndex = 0;
    document.getElementById("shippingAddress").value = "";
    document.getElementById("otherShippingMethod").value = "";

    document.getElementById("attestation").checked = false;

    document.getElementById(
        "otherRelationshipContainer"
    ).style.display = "none";

    document.getElementById(
        "otherShippingContainer"
    ).style.display = "none";

    copyBtn.disabled = true;

});
// ==========================
// STANDARD NOTE
// ==========================

const copyStandardBtn =
    document.getElementById("copyStandardBtn");

if (copyStandardBtn) {

    copyStandardBtn.addEventListener("click", async () => {

        const caller =
            document.getElementById("stdCaller");

        const relationship =
            document.getElementById("stdRelationship");

        const medication =
            document.getElementById("stdMedication");

        const issue =
            document.getElementById("stdIssue");

        const resolution =
            document.getElementById("stdResolution");

        if (!caller.value.trim()) {
            alert("Caller's Name is required.");
            return;
        }

        if (!relationship.value.trim()) {
            alert("Relationship / Title is required.");
            return;
        }

        if (!medication.value.trim()) {
            alert("Medication is required.");
            return;
        }

        if (!issue.value.trim()) {
            alert("Issue / Reason for Call is required.");
            return;
        }

        if (!resolution.value.trim()) {
            alert("Resolution / Outcome is required.");
            return;
        }

        const note = `STANDARD CASE NOTE

CALLER'S NAME:
${caller.value}

RELATIONSHIP TO PATIENT / TITLE:
${relationship.value}

MEDICATION:
${medication.value}

ISSUE / REASON FOR CALL:
${issue.value}

RESOLUTION / OUTCOME:
${resolution.value}`;

        try {

            await navigator.clipboard.writeText(note);

        } catch {

            alert("Unable to copy note.");
            return;

        }

        let history =
            JSON.parse(
                localStorage.getItem("caseNotes") || "[]"
            );

        history.unshift({
            type: "STANDARD",
            date: new Date().toLocaleString(),
            note: note
        });

        localStorage.setItem(
            "caseNotes",
            JSON.stringify(history)
        );

        alert("Standard note copied and saved.");
    });

}

// ==========================
// CLEAR STANDARD
// ==========================

document
.getElementById("clearStandardBtn")
?.addEventListener("click", () => {

    if (!confirm("Clear Standard Note?"))
        return;

    document.getElementById("stdCaller").value = "";
    document.getElementById("stdRelationship").value = "";
    document.getElementById("stdMedication").value = "";
    document.getElementById("stdIssue").value = "";
    document.getElementById("stdResolution").value = "";

});

// ==========================
// STANDARD NOTE
// ==========================

const copyStandardBtn =
    document.getElementById("copyStandardBtn");

if (copyStandardBtn) {

    copyStandardBtn.addEventListener("click", async () => {

        const caller =
            document.getElementById("stdCaller");

        const relationship =
            document.getElementById("stdRelationship");

        const medication =
            document.getElementById("stdMedication");

        const issue =
            document.getElementById("stdIssue");

        const resolution =
            document.getElementById("stdResolution");

        if (!caller.value.trim()) {
            alert("Caller's Name is required.");
            return;
        }

        if (!relationship.value.trim()) {
            alert("Relationship / Title is required.");
            return;
        }

        if (!medication.value.trim()) {
            alert("Medication is required.");
            return;
        }

        if (!issue.value.trim()) {
            alert("Issue / Reason for Call is required.");
            return;
        }

        if (!resolution.value.trim()) {
            alert("Resolution / Outcome is required.");
            return;
        }

        const note = `STANDARD CASE NOTE

CALLER'S NAME:
${caller.value}

RELATIONSHIP TO PATIENT / TITLE:
${relationship.value}

MEDICATION:
${medication.value}

ISSUE / REASON FOR CALL:
${issue.value}

RESOLUTION / OUTCOME:
${resolution.value}`;

        await navigator.clipboard.writeText(note);

        let history =
            JSON.parse(
                localStorage.getItem("caseNotes") || "[]"
            );

        history.unshift({
            type: "STANDARD",
            date: new Date().toLocaleString(),
            note: note
        });

        localStorage.setItem(
            "caseNotes",
            JSON.stringify(history)
        );

        alert("Standard note copied and saved.");
    });

}

// ==========================
// CLEAR STANDARD
// ==========================

document
.getElementById("clearStandardBtn")
?.addEventListener("click", () => {

    if (!confirm("Clear Standard Note?"))
        return;

    document.getElementById("stdCaller").value = "";
    document.getElementById("stdRelationship").value = "";
    document.getElementById("stdMedication").value = "";
    document.getElementById("stdIssue").value = "";
    document.getElementById("stdResolution").value = "";

});

// ==========================
// CLEAR FORM
// ==========================

document.getElementById("clearBtn")
.addEventListener("click", () => {


    const copyStandardBtn =
    document.getElementById("copyStandardBtn");


    
