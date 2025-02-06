// ==UserScript==
// @name         GH-PFP-Remover
// @namespace    http://tampermonkey.net/
// @version      2025-02-06
// @description  Remove pfps of specified GitHub users.
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    console.log("GH-PFP-Remover running...");

    const accounts = ["Treyson-Grange"];

    const classesToRemove = [
        "avatar avatar-user width-full border color-bg-default",
        // "avatar mr-2 d-none d-md-block avatar-user",
        // "Box-sc-g0xbh4-0 cvdqJW prc-Avatar-Avatar-ZRS-m",
    ];

    function removePfps() {
        console.log("Removing pfps...");
        accounts.forEach((account) => {
            classesToRemove.forEach((className) => {
                document
                    .querySelectorAll(`.${className}`)
                    .forEach((element) => {
                        if (element.alt.includes(account)) {
                            element.remove();
                        }
                    });
            });
        });
    }

    removePfps();

    const observer = new MutationObserver(() => {
        removePfps();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
