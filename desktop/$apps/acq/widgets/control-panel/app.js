/*
 * 2024 Tarpeeksi Hyvae Soft
 *
 * Software: w95
 * 
 */

import chatWindow from "../chat-window/app.js";
import textures from "./textures.js";
import {appicon16} from "../textures.js";
import {contactListItem} from  "./widgets/contact-list-item.js";
import {contactCreator} from  "./widgets/contact-creator.js";

export default function({
    models = [],
} = {}) {
    return {
        Meta: {
            name: "ACQ",
            version: "1.0",
            author: "ArtisaaniSoft",
        },
        App() {
            // The dimensions of the app's window.
            const minWidth = 170;
            const minHeight = 343;
            const width = w95.state(minWidth);
            const height = w95.state(minHeight);

            // The position of the app's window.
            const x = w95.state(~~(0.9 * (w95.shell.display.width - width.now)), w95.reRenderOnly);
            const y = w95.state(~~(0.5 * (w95.shell.display.visibleHeight - height.now)), w95.reRenderOnly);
            
            const selectedContact = w95.state(-1);
            const isContactCreatorDialogOpen = w95.state(false);
            const isAboutDialogOpen = w95.state(false);

            const nick = w95.state("Tom");
            const contacts = w95.state([]);

            function add_contact(contact) {
                contacts.set([...contacts.now, contact]);
            }

            return {
                get x() { return x.now },
                get y() { return y.now },
                get width() { return width.now },
                get height() { return height.now },
                get contactsList() { return this.$("contacts-list") },
                Form() {
                    return w95.widget.window({
                        parent: this,
                        title: this.$app.Meta.name,
                        icon: appicon16,
                        resize(deltaWidth, deltaHeight) {
                            width.set(Math.max(minWidth, (width.now + deltaWidth)));
                            height.set(Math.max(minHeight, (height.now + deltaHeight)));
                        },
                        move(deltaX, deltaY) {
                            x.set(x.now + deltaX);
                            y.set(y.now + deltaY);
                        },
                        close() {
                            w95.windowManager.release_window(this)
                        },
                        children: [
                            w95.widget.menuBar({
                                width: "pw",
                                children: [
                                    w95.widget.menuAction({
                                        label: "File",
                                        isTopLevel: true,
                                        submenu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuAction({
                                                    label: "Exit",
                                                    onClick(widget) {
                                                        w95.windowManager.release_window(widget.$app.window);
                                                    },
                                                }),
                                            ],
                                        }),
                                    }),
                                    w95.widget.menuAction({
                                        label: "Help",
                                        isTopLevel: true,
                                        submenu: w95.widget.menu({
                                            children: [
                                                w95.widget.menuAction({
                                                    label: "About...",
                                                    onClick() {
                                                        isAboutDialogOpen.set(true);
                                                    },
                                                }),
                                            ],
                                        }),
                                    }),
                                ],
                            }),
                            w95.widget.verticalLayout({
                                y: 18,
                                width: "pw",
                                height: "ph",
                                padding: 0,
                                children: [
                                    w95.widget.scrollArea({
                                        width: "pw",
                                        height: (height.now - 99),
                                        backgroundColor: Rngon.color(235, 235, 235),
                                        frameShape: w95.frameShape.plain,
                                        onClick() {
                                            selectedContact.set(-1);
                                        },
                                        styleHints: [
                                            w95.styleHint.hideHorizontalScrollBar,
                                        ],
                                        children: [
                                            w95.widget.dynamicContent({
                                                $name: "contacts-list",
                                                children: contacts.now.map((contact, idx)=>(
                                                    contactListItem({
                                                        y: idx*20,
                                                        width: (width.now - 10),
                                                        contact,
                                                        isSelected: (idx === selectedContact.now),
                                                        onClick() {
                                                            selectedContact.set(idx);
                                                            return true;
                                                        },
                                                        onDoubleClick() {
                                                            w95.shell.run(chatWindow(contact));
                                                        },
                                                    })
                                                )),
                                            })
                                        ],
                                    }),
                                    w95.widget.layoutSpacer({
                                        height: 3,
                                    }),
                                    w95.widget.horizontalLayout({
                                        width: "pw",
                                        padding: 1,
                                        height: 20,
                                        styleHints: [
                                            w95.styleHint.alignVCenter,
                                        ],
                                        children: [
                                            w95.widget.layoutSpacer({
                                                width: 3,
                                            }),
                                            w95.widget.bitmap({
                                                image: textures.person,
                                            }),
                                            w95.widget.layoutSpacer({
                                                width: 3,
                                            }),
                                            w95.widget.lineEdit({
                                                state: nick,
                                                width: "pw - 26"
                                            }),
                                        ],
                                    }),
                                    w95.widget.layoutSpacer({
                                        height: 3,
                                    }),
                                    w95.widget.horizontalRule({
                                        width: "pw",
                                    }),
                                    w95.widget.layoutSpacer({
                                        height: 3,
                                    }),
                                    w95.widget.button({
                                        text: "Add a contact...",
                                        width: "pw",
                                        async onClick() {
                                            isContactCreatorDialogOpen.set(true);
                                        },
                                    }),
                                ],
                            }),
                            contactCreator({
                                x: ((width.now / 2) - 200),
                                width: 310,
                                height: 234,
                                models,
                                onAccept(contact) {
                                    isContactCreatorDialogOpen.set(false);
                                    add_contact({...contact, friend: ()=>nick.now});
                                },
                                onReject() {
                                    isContactCreatorDialogOpen.set(false);
                                },
                            }, {hideIf: !isContactCreatorDialogOpen.now}),
                            w95.shell.popup.about({
                                parent: this,
                                text: `A front-end for Ollama to chat with local LLMs.\n\nSet \"OLLAMA_ORIGINS=${window.location.origin}\"\nand go to town.`,
                                onClose() {
                                    isAboutDialogOpen.set(false);
                                },  
                            }, {hideIf: !isAboutDialogOpen.now}),
                        ],
                    });
                },
            };
        },
    };
};
