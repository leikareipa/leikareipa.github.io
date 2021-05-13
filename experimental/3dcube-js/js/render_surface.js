/*
 * Most recent known filename: js/render_surface.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * Provides an abstracted surface for rendering graphics onto the webpage. The surface
 * might be, for instance, an <svg> element.
 *
 */

"use strict"

const render_surface_n = {};
{
    // The render surface is a HTML element of some kind - <svg> or <canvas>, for instance - embedded
    // in a container like <div>.
    render_surface_n.render_surface_o = function(surfaceElementId = "",
                                                 surfaceElementName = "",
                                                 containerId = "",
                                                 poly_fill_function = Function)
    {
        k_assert((surfaceElementId.length > 0), "Expected a non-null string.");
        k_assert((surfaceElementName.length > 0), "Expected a non-null string.");
        k_assert((containerId.length > 0), "Expected a non-null string.");
        k_assert((poly_fill_function != null), "Expected a non-null polyfill function.");

        this.elementId = surfaceElementId;
        this.elementName = surfaceElementName;

        this.containerId = containerId;

        this.width = 0;
        this.height = 0;
        
        this.containerElement = document.getElementById(this.containerId);
        k_assert((this.containerElement != null), "Couldn't find a render surface element with the given id.");

        this.element = document.getElementById(this.elementId);

        // If the element doesn't already exist, create it. NOTE: This will wipe the
        // container's contents.
        if (this.element == null)
        {
            this.containerElement.innerHTML = "";

            switch(this.elementName)
            {
                case "svg":
                {
                    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    this.element.style.backgroundColor = "transparent";
                    this.element.style.pointerEvents = "none"; // Prevent polygons in the SVG from intercepting the mouse.
                    
                    break;
                }
                case "canvas":
                {
                    this.element = document.createElement("canvas");             
                    break;
                }
                default:
                {
                    k_assert(0, "Unknown render surface element id.");           
                    break;
                }
            }

            this.element.setAttribute("id", this.elementId);
            this.containerElement.appendChild(this.element);
        }
        k_assert((this.element.parentNode === this.containerElement), "The render surface element doesn't appear to be embedded in the given container element.");
        k_assert((this.element != null), "Couldn't find a render surface element with the given id.");
        k_assert((this.element.tagName.toLowerCase() === this.elementName), "The element by the given id is not compatible with the given element name.");

        // A function that can be called by the render surface to draw polygons onto
        // itself.
        this.poly_filler = poly_fill_function.bind(this);

        this.depthBuffer = [];

        // Draw the given polygons onto this render surface.
        this.render_polygons = function(polygons = [])
        {
            this.poly_filler(polygons);
        }

        // Update the size of the render surface to match the size of its container element.
        this.update_size = function()
        {
            this.width = this.containerElement.clientWidth;
            this.height = this.containerElement.clientHeight;
            
            k_assert(!isNaN(this.width) && !isNaN(this.height), "Failed to extract the canvas size.");

            this.element.setAttribute("width", this.width);
            this.element.setAttribute("height", this.height);

            if (this.elementName === "canvas")
            {
                this.depthBuffer = new Array(this.width * this.height);// this.exposed().createImageData(this.width, this.height);
            }
        }

        // Exposes the relevant portion of the surface for rendering.
        this.exposed = function()
        {
            switch (this.elementName)
            {
                case "svg":
                {
                    this.element.setAttribute("width", this.width);
                    this.element.setAttribute("height", this.height);

                    return this.element;
                }
                case "canvas":
                {
                    return this.element.getContext("2d");
                }
                default:
                {
                    k_assert(0, "Unknown render surface element id.");
                }
            }
        }

        // Cleans-up the render surface, to a state where it will display nothing but
        // a blank slate onto the screen.
        this.wipe_clean = function()
        {
            const surface = this.exposed();

            switch (this.elementName)
            {
                case "svg":
                {
                    while (this.element.firstChild !== null)
                    {
                        this.element.removeChild(this.element.firstChild);
                    }

                    break;
                }
                case "canvas":
                {
                    surface.fillStyle = "transparent";
                    surface.fillRect(0, 0, this.width, this.height);

                    this.depthBuffer.fill(Number.MAX_VALUE);

                    break;
                }
                default:
                {
                    k_assert(0, "Unknown render surface element id.");
                }
            }
        }
    }
}
