/*
 * Most recent known filename: js/page.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Provides logic for dealing with the host HTML page.
 *
 */

"use strict"

// If the user clicks somewhere other than inside an open dropdown menu, close its
// dropdown box. Adapted from https://www.w3schools.com/howto/howto_js_dropdown.asp.
window.onclick = function(event)
{
    if (!event.target.matches(".side_button")) 
    {
        const dropdowns = document.getElementsByClassName("dropdown_list");
        for (let i = 0; i < dropdowns.length; i++)
        {
            if (dropdowns[i].classList.contains("show"))
            {
                dropdowns[i].classList.toggle("show");
            }
        }
    }
}

const page_n = {}
{
    // Add the names of known renderers to the dropdown list of renderers, and have clicks on
    // its items assign the relevant renderer as the active one.
    page_n.populate_renderer_menu = function()
    {
        const rendererDropdown = document.getElementById("button_renderer_dropdown");
        k_assert((rendererDropdown != null), "Received a null render dropdown element.");

        k_assert((cube_renderer_n.RENDERER_NAMES.length > 0), "There are no renderers to populate the renderer menu with.");
        
        for (let i = 0; i < cube_renderer_n.RENDERER_NAMES.length; i++)
        {
            let newEntry = document.createElement("a");
    
            newEntry.appendChild(document.createTextNode(cube_renderer_n.RENDERER_NAMES[i]));
            newEntry.setAttribute("href", "#");
            newEntry.setAttribute("onclick", "page_n.set_active_renderer(" + i + ")");
    
            rendererDropdown.appendChild(newEntry);
        }
    }();

    // Assigns the idx'th renderer as the currently active one.
    page_n.set_active_renderer = function(idx = 0)
    {
        const activeRendererIdx = cube_renderer_n.set_active_renderer(idx);
        k_assert((activeRendererIdx < cube_renderer_n.RENDERER_NAMES.length), "Active renderer index is out of bounds.");

        // Update the renderer menu's name to reflect this new selection.
        const rendererMenu = document.getElementById("button_renderer");
        k_assert((rendererMenu != null), "Couldn't find the render menu element.");
        rendererMenu.textContent = "Renderer: " + cube_renderer_n.RENDERER_NAMES[activeRendererIdx];
    }

    // Shows/hides the given menu's associated dropdown box when called this the menu's
    // id. Assumes that the dropdown will be named the same as the menu, but with a post-
    // fixed "_dropdown"; such that e.g. the dropdown for a menu called "menu_renderer"
    // would be called "menu_renderer_dropdown").
    page_n.toggle_dropdown_menu = function(menuId = "")
    {
        k_assert((menuId.length > 0), "Received an empty menu name.");

        const dropdownElement = document.getElementById(menuId + "_dropdown");
        k_assert((dropdownElement != null), "Received a null dropdown element.");

        dropdownElement.classList.toggle("show");
    }
}
