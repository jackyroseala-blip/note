
document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);
    const val = id => $(id).value.trim();

    const copyBtn = $("copyNoteBtn");

    // ==========================
    // CLOCKS
    // ==========================

    function updateClocks() {
        const now = new Date();

        $("phTime").textContent = now.toLocaleTimeString("en-US", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        $("ctTime").textContent = now.toLocaleTimeString("en-US", {
            timeZone: "America/Chicago",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
    }

    updateClocks();
    setInterval(updateClocks, 1000);


    // ==========================
    // TABS
    // ==========================

    $("noteTabBtn").addEventListener("click", () => {
        $("noteTab").classList.remove("hidden");
        $("historyTab").classList.add("hidden");

        $("noteTabBtn").classList.add("active");
        $("historyTabBtn").classList.remove("active");
    });

    $("historyTabBtn").addEventListener("click", () => {
        $("historyTab").classList.remove("hidden");
        $("noteTab").classList.add("hidden");

        $("historyTabBtn").classList.add("active");
        $("noteTabBtn").classList.remove("active");

        loadHistory();
    });


    // ==========================
    // CONDITIONAL FIELDS
    // ==========================

    $("spokeWith").addEventListener("change", () => {
        $("otherRelationshipContainer").style.display =
            val("spokeWith") === "Other" ? "block" : "none";
    });

    $("sameAddress").addEventListener("change", () => {
        $("addressReasonContainer").style.display =
            val("sameAddress") === "No" ? "block" : "none";
    });

    $("shippingMethod").addEventListener("change", () => {
        $("otherShippingContainer").style.display =
            val("shippingMethod") === "Other" ? "block" : "none";
    });


    // ==========================
    // CURRENCY FORMAT
    // ==========================

    $("copay").addEventListener("blur", function () {
        const num = this.value.replace(/[^\d.]/g, "");

        if (num && !isNaN(Number(num))) {
            this.value = Number(num).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            });
        }
    });


    // ==========================
    // ATTESTATION
    // ==========================

    $("attestation").addEventListener("change", function () {
        copyBtn.disabled = !this.checked;
    });


    // ==========================
    // VALIDATION
    // ==========================

    function validateField(id, label) {
        if (!val(id)) {
            alert(label + " is required.");
            $(id).focus();
            return false;
        }

        return true;
    }


    // ==========================
    // HISTORY SAVE
    // ==========================

    function saveHistory(type, note) {
        const history = JSON.parse(
            localStorage.getItem("caseNotes") || "[]"
        );

        history.unshift({
            type: type,
            date: new Date().toLocaleString(),
            note: note
        });

        localStorage.setItem(
            "caseNotes",
            JSON.stringify(history)
        );
    }


    // ==========================
    // COPY DEL SET NOTE
    // ==========================

    copyBtn.addEventListener("click", async () => {

        const requiredFields = [
            ["spokeWith", "Spoke With"],
            ["callerName", "Caller's Name"],
            ["punr", "PUNR"],
            ["deliveryDate", "Delivery Date"],
            ["medicationName", "Medication"],
            ["copay", "Copay / AR Bal"],
            ["obeNeeded", "OBE Needed"],
            ["activeObe", "Active OBE"],
            ["sameAddress", "Address Confirmation"],
            ["shipToMdo", "Shipping to MDO"],
            ["medicaid", "Medicaid Insurance"],
            ["shippingMethod", "Shipping Method"],
            ["shippingAddress", "Shipping Address"],
            ["growthHormone", "Growth Hormone"],
            ["restrictedState", "Shipping State"],
            ["medicationCost", "Medication Cost"]
        ];

        for (const [id, label] of requiredFields) {
            if (!validateField(id, label)) return;
        }

        // Conditional validation

        if (
            val("spokeWith") === "Other" &&
            !validateField("otherRelationship", "Other Relationship")
        ) return;

        if (
            val("sameAddress") === "No" &&
            !validateField("addressChangeReason", "Reason for Address Change")
        ) return;

        if (
            val("shipToMdo") === "Yes" &&
            !validateField("sameMd", "Same MD on Rx")
        ) return;

        if (
            val("shippingMethod") === "Other" &&
            !validateField("otherShippingMethod", "Other Shipping Method")
        ) return;


        // SIG REQUIREMENT

        if (
            val("restrictedState") === "Yes" &&
            val("shippingMethod") !== "Signature Required"
        ) {
            alert(
                "SIG Required is mandatory for CO, ID, MN, NV, RI, and WV."
            );

            $("shippingMethod").focus();
            return;
        }


        // ATTESTATION CHECK

        if (!$("attestation").checked) {
            alert("Please verify and check the insurance attestation.");
            return;
        }


        // ==========================
        // FORMAT VALUES
        // ==========================

        const spokeWith =
            val("spokeWith") === "Other"
                ? val("otherRelationship") + " - " + val("callerName")
                : val("spokeWith") + " - " + val("callerName");

        const officeHours =
            val("mdOfficeHours") || "N/A";

        const addressReason =
            val("sameAddress") === "No"
                ? val("addressChangeReason")
                : "N/A";

        const sameMD =
            val("shipToMdo") === "Yes"
                ? val("sameMd")
                : "N/A";

        const shippingMethod =
            val("shippingMethod") === "Other"
                ? val("otherShippingMethod")
                : val("shippingMethod");

        const sigRequirement =
            val("restrictedState") === "Yes"
                ? "Yes - SIG Req Required"
                : "No";


        // ==========================
        // FINAL CASE NOTE
        // ==========================

        const note = [
            `Spoke with: ${spokeWith}`,
            `Office Hours (If Office-Base): ${officeHours}`,
            `PUNR: ${val("punr")}`,
            `Delivery Date: ${val("deliveryDate")}`,
            `Medication: ${val("medicationName")}`,
            `Copay/ AR Bal: ${val("copay")}`,
            `OBE Needed?: ${val("obeNeeded")}`,
            `Is there an active OBE?: ${val("activeObe")}`,
            `Is the current address the same w/ previous order: ${val("sameAddress")}`,
            `Reason for address change: ${addressReason}`,
            `If ship to MDO, is it the same MD on the Rx: ${sameMD}`,
            `Is the insurance under Medicaid: ${val("medicaid")}`,
            `Shipping Method: ${shippingMethod}`,
            `Shipping Address: ${val("shippingAddress")}`,
            `Is the medication a Growth Hormone: ${val("growthHormone")}`,
            `Are the state under CO, ID, MN, NV, RI and WV?: ${val("restrictedState")}`,
            `If Yes, must be SIG Req: ${sigRequirement}`,
            `MEDICATION COST : ${val("medicationCost")}`,
            val("remarks") ? `Remarks: ${val("remarks")}` : null,
            "",
            "I attest that I have verified with the patient that there are no changes to the insurance on file."
        ].filter(line => line !== null).join("\n");


        // ==========================
        // COPY TO CLIPBOARD
        // ==========================

        try {
            await navigator.clipboard.writeText(note);

            saveHistory("DEL SET", note);

            alert("Case note copied and saved successfully!");

        } catch (error) {
            alert("Unable to copy. Please use HTTPS or localhost.");
        }

    });


    // ==========================
    // LOAD HISTORY
    // ==========================

    function loadHistory() {

        const container = $("historyContainer");

        const history = JSON.parse(
            localStorage.getItem("caseNotes") || "[]"
        );

        container.innerHTML = "";

        if (history.length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    No saved case notes yet.
                </div>
            `;
            return;
        }

        history.forEach(item => {

            const card = document.createElement("div");
            card.className = "history-card";

            const date = document.createElement("div");
            date.className = "history-date";
            date.textContent = item.date;

            const type = document.createElement("div");
            type.className = "history-type " +
                (item.type === "STANDARD"
                    ? "standard-badge"
                    : "delset-badge");

            type.textContent = item.type || "DEL SET";

            const note = document.createElement("div");
            note.className = "history-note";
            note.textContent = item.note;

            card.append(date, type, note);
            container.appendChild(card);

        });

    }


    // ==========================
    // CLEAR DEL SET
    // ==========================

    $("clearBtn").addEventListener("click", () => {

        if (!confirm("Clear DEL SET fields?")) return;

        [
            "spokeWith",
            "punr",
            "obeNeeded",
            "activeObe",
            "sameAddress",
            "shipToMdo",
            "sameMd",
            "medicaid",
            "shippingMethod",
            "growthHormone",
            "restrictedState"
        ].forEach(id => $(id).selectedIndex = 0);

        [
            "callerName",
            "otherRelationship",
            "mdOfficeHours",
            "deliveryDate",
            "medicationName",
            "copay",
            "addressChangeReason",
            "otherShippingMethod",
            "shippingAddress",
            "medicationCost",
            "remarks"
        ].forEach(id => $(id).value = "");

        $("attestation").checked = false;
        copyBtn.disabled = true;

        $("otherRelationshipContainer").style.display = "none";
        $("addressReasonContainer").style.display = "none";
        $("otherShippingContainer").style.display = "none";

    });


    // ==========================
    // STANDARD CASE NOTE
    // ==========================

    $("copyStandardBtn").addEventListener("click", async () => {

        const fields = [
            ["stdCaller", "Caller's Name"],
            ["stdRelationship", "Relationship / Title"],
            ["stdMedication", "Medication"],
            ["stdIssue", "Issue / Reason for Call"],
            ["stdResolution", "Resolution / Outcome"]
        ];

        for (const [id, label] of fields) {
            if (!validateField(id, label)) return;
        }

        const note = `STANDARD CASE NOTE

CALLER'S NAME:
${val("stdCaller")}

RELATIONSHIP TO PATIENT / TITLE:
${val("stdRelationship")}

MEDICATION:
${val("stdMedication")}

ISSUE / REASON FOR CALL:
${val("stdIssue")}

RESOLUTION / OUTCOME:
${val("stdResolution")}`;

        try {
            await navigator.clipboard.writeText(note);

            saveHistory("STANDARD", note);

            alert("Standard note copied and saved!");

        } catch (error) {
            alert("Unable to copy note.");
        }

    });


    // ==========================
    // CLEAR STANDARD NOTE
    // ==========================

    $("clearStandardBtn").addEventListener("click", () => {

        if (!confirm("Clear Standard Note?")) return;

        [
            "stdCaller",
            "stdRelationship",
            "stdMedication",
            "stdIssue",
            "stdResolution"
        ].forEach(id => $(id).value = "");

    });

});
