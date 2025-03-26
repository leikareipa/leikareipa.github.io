/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: RallySportED / Corruptor
 * 
 */

import mutations from "./corruptions.js";

// The symbol that separates two mutation ids in a concatenated string of mutation ids;
// e.g. "abcd!efgh!ijkl" if the separator is '!'. Will be used e.g. when concatenating
// mutation ids for a URL parameter. NOTE: Changing this value will invalidate existing
// URL links to the app containing mutation ids as a URL parameter, as well as the
// user's persistent localStorage of the ids of active mutations.
const mutationIdSeparator = "$";

// Inspect the provided mutations' ids to make sure they're within valid bounds.
{
    const muts = Object.values(mutations);
    console.assert(muts.every(m=>(typeof m.id === "string")), "All mutation ids must be string.");
    muts.forEach(m=>console.assert(muts.filter(m2=>m2 !== m).every(m2=>m2.id !== m.id), `Non-unique mutation id: ${m.id}.`));
    console.assert(!muts.some(m=>m.id.includes(mutationIdSeparator)), `A mutation id contains the illegal substring/character "${mutationIdSeparator}".`);
}

console.assert = function(condition, errorMessage = "") {
    if (!condition) {
        throw new Error(errorMessage);
    }
}

const controlPanelEl = document.querySelector("#control-panel");
const controlPanelCloserEl = document.querySelector("#control-panel-closer");
const mutationContainerEl = controlPanelEl.querySelector("#mutation-container");
const selectionCountEl = controlPanelEl.querySelector("#mutation-selection-count-indicator");
const searchEl = controlPanelEl.querySelector("#search");
const frameEl = document.querySelector("#rs-iframe");
console.assert(
    controlPanelEl &&
    controlPanelCloserEl &&
    mutationContainerEl &&
    selectionCountEl &&
    searchEl &&
    frameEl
);

start_app();

function start_app() {
    populate_ui();
}

function populate_ui() {
    mutationContainerEl.innerHTML = "";

    // Build the UI's list of available mutations.
    for (const [title, mutation] of Object.entries(mutations).sort()) {
        console.assert(
            (typeof mutation === "object") &&
            (typeof mutation.id === "string") &&
            Array.isArray(mutation.payload)
        );

        const checkboxEl = document.createElement("input");
        checkboxEl.setAttribute("type", "checkbox");
        checkboxEl.setAttribute("value", mutation.payload.map(element=>`'${element}'`).join(","));
        checkboxEl.onchange = on_mutation_selection_changed;
        checkboxEl.dataset.mutationId = mutation.id;

        const labelEl = document.createElement("label");
        labelEl.setAttribute("class", "mutation");
        labelEl.setAttribute("title", mutation.tooltip || "");
        labelEl.append(checkboxEl, document.createTextNode(title));

        mutationContainerEl.append(labelEl);
    }

    // Initialize the UI state.
    {
        searchEl.oninput = (event)=>update_mutation_search(event.target.value);
        controlPanelCloserEl.onclick = toggle_control_panel_expansion;

        update_mutation_selection_count_label(0);

        // Effect the user's desired selection of mutations, either via a URL parameter or from
        // persistent local storage, if provided.
        {
            const selectedMutations = (()=>{
                const allMutationEls = Array.from(mutationContainerEl.querySelectorAll("input[type='checkbox']"));
                const urlParamData = (new URLSearchParams(window.location.search).get("mutations") || "").trim();
                const persistentData = (localStorage.getItem("rs:mutation-selection") || "").trim();

                if (urlParamData.length) {
                    const mutationIds = urlParamData.split(mutationIdSeparator);
                    return allMutationEls.filter(el=>mutationIds.includes(el.dataset.mutationId));
                }
                else if (persistentData.length) {
                    const persistedIds = persistentData.split(mutationIdSeparator)
                    return allMutationEls.filter(el=>persistedIds.includes(el.dataset.mutationId));
                }
                else {
                    return [];
                }
            })();

            if (selectedMutations?.length) {
                // Apply each mutation. This'll automatically load Rally-Sport in its <iframe>
                // with the given mutations in effect.
                selectedMutations.forEach(el=>{el.checked = true; el.onchange()});
            }
            else {
                // Load the default, unmodified game.
                frameEl.src = get_rs_dosbox_url();
            }
        }
    }
}

// Gets called when a mutation's checkbox in the UI is toggled.
function on_mutation_selection_changed() {
    const selectedMutations = Array.from(mutationContainerEl.querySelectorAll("input[type='checkbox']:checked"));
    const selectedIdsList = selectedMutations.map(el=>el.dataset.mutationId);
    const selectedIdsString = selectedIdsList.join(mutationIdSeparator);
    const mutationRunCommands = selectedMutations.map(m=>m.value).join(",");

    debounced_update_rs_iframe_src(get_rs_dosbox_url(mutationRunCommands));
    update_mutation_selection_count_label(selectedMutations.length);
    
    localStorage[selectedIdsString.length? "setItem" : "removeItem"]("rs:mutation-selection", selectedIdsString);
    window.history.replaceState(null, null, (selectedIdsList.length? `?mutations=${selectedIdsList.join(mutationIdSeparator)}` : `${window.location.origin}${window.location.pathname}`));
}

// Returns a URL to a ths-web-dosbox (cf. github.com/leikareipa/ths-web-dosbox)
// client that provides our in-browser Rally-Sport experience, inserting into it the
// given mutation payload commands from rs.
function get_rs_dosbox_url(mutationPayloads = "") {
    console.assert(typeof mutationPayloads === "string");

    const thsDosboxBaseUrl = (window.location.hostname === "localhost")
        ? "http://localhost:8000/dosbox"
        : "https://leikareipa.github.io/dosbox";

    return `${thsDosboxBaseUrl}/?run=['copy rallye.org rallye.exe',${mutationPayloads},'rally']#/rallysported/corruptor/`;
}

// Updates the 'src' attribute of the iframe in which we run Rally-Sport, debouncing
// it so that multiple calls to this function within a brief delay period results in
// the attribute being changed only once.
function debounced_update_rs_iframe_src(newUrl = "") {
    console.assert(typeof newUrl === "string");

    if (debounced_update_rs_iframe_src.debounce !== undefined) {
        clearTimeout(debounced_update_rs_iframe_src.debounce);
    }

    debounced_update_rs_iframe_src.debounce = setTimeout(()=>{
        // To prevent the changing of the iframe's src from affecting the page's history,
        // we'll take the iframe out of the DOM and re-insert it with the new src.
        {
            const parentEl = frameEl.parentElement;
            frameEl.remove();
            frameEl.src = newUrl;
            parentEl.append(frameEl);
            frameEl.focus();
        }
        debounced_update_rs_iframe_src.debounce = undefined;
    }, 500);
}

function update_mutation_search(query = "") {
    console.assert(typeof query === "string");

    query = query.trim().toLowerCase();
    
    const allMutationEls = Array.from(mutationContainerEl.querySelectorAll("input[type='checkbox']")).map(el=>el.parentElement);
    const matchingMutationEls = allMutationEls.filter(el=>el.textContent.toLowerCase().includes(query));

    allMutationEls.forEach(el=>el.style.display = "none");
    matchingMutationEls.forEach(el=>el.style.display = "block");
    mutationContainerEl.classList[matchingMutationEls.length? "remove" : "add"]("empty");
}

function update_mutation_selection_count_label(numMutationsSelected = 0) {
    console.assert(typeof numMutationsSelected === "number");
    selectionCountEl.textContent = `${numMutationsSelected}/${Object.keys(mutations).length} corruptions selected`;
}

function toggle_control_panel_expansion() {
    controlPanelEl.classList.toggle("expanded");
    controlPanelCloserEl.classList.toggle("active");
    frameEl.focus();
}
