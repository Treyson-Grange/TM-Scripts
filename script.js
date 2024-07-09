// ==UserScript==
// @name         Mark's Steam Script
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Adds info from and links to SteamDB and ProtonDB (Proton Linux compatibility)
// @author       Mark Snyder
// @updateURL     https://raw.githubusercontent.com/mkwsnyder/marks-user-scripts/main/scripts/marks-steam-script/script.js
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// made this in like 30 minutes so don't judge quality lol


(() => {
    'use strict';

    const $ = jQuery;
    const itemID = window.location.pathname.split('/')[2];
    const steamDBurl = `https://steamdb.info/app/${itemID}/`;
    const protonDBurlApi = `https://www.protondb.com/api/v1/reports/summaries/${itemID}.json`;
    const steamDeckVerifiedApiURL = `https://www.protondb.com/proxy/steam/deck-verified?nAppID=${itemID}`;
    const protonDBurl = `https://www.protondb.com/app/${itemID}`;

    const createSteamDBButton = (url, text) => {
        const btn = document.createElement('a');
        btn.className = 'btnv6_blue_hoverfade btn_large';
        btn.style.cssText = `display: inline-block;`
        btn.href = url;
        btn.target = '_blank';
        btn.innerHTML = `<span>${text}</span>`;
        btn.style.marginTop = '1rem';
        btn.style.marginBottom = '1rem';
        btn.style.height = '40px';
        document.querySelector("#appHubAppName").appendChild(btn);
    };

    const addBadge = (text, backgroundColor, textColor = 'black') => {
        const badge = document.createElement('div');
        badge.style.cssText = `
            font-family: "Abel", sans-serif;
            text-transform: uppercase;
            text-align: center;
            min-width: 220px;
            font-size: 22px;
            background: ${backgroundColor};
            color: ${textColor};
            padding: 3px 3px;
            margin-top: 1rem;
            margin-bottom: 1rem;
            margin-left: 1rem;
            display: inline-block;
            height: 35px;
            line-height: 35px;
            align-items: center;
        `;
        badge.innerHTML = `<span style="transform: scale(0.8, 1);">${text}</span>`;
        document.querySelector('#appHubAppName').appendChild(badge);
        badge.outerHTML = `<a href="${protonDBurl}" target="_blank">${badge.outerHTML}</a>`;
    };

    const getProtonDBInfo = () => {
        let lineBreak = document.createElement('br');
        document.querySelector('#appHubAppName').appendChild(lineBreak);
        GM_xmlhttpRequest({
            method: "GET",
            url: protonDBurlApi,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    const tier = document.querySelector('[data-os="linux"]') ? 'native' : data.tier || 'no info';
                    const colors = {
                        native: ['green', 'white'],
                        platinum: ['rgb(180, 199, 220)'],
                        gold: ['rgb(207, 181, 59)'],
                        silver: ['rgb(192, 192, 192)'],
                        bronze: ['rgb(205, 127, 50)'],
                        borked: ['red'],
                        'no info': ['gray']
                    };
                    addBadge(tier, ...colors[tier]);
                } catch {
                    addBadge('no info', 'gray');
                }
            }
        });
    };

    const getSteamDeckInfo = () => {
        GM_xmlhttpRequest({
            method: "GET",
            url: steamDeckVerifiedApiURL,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    const categories = {
                        1: ['Deck Unplayable', 'red', 'black'],
                        2: ['Deck Playable', 'rgb(238, 210, 2)', 'black'],
                        3: ['Deck Verified', 'green', 'white'],
                        0: ['No Deck Info', 'gray', 'black']
                    };
                    const category = categories[data.results.resolved_category] || categories[0];
                    addBadge(...category);
                } catch {
                    addBadge('No Deck Info', 'gray');
                }
            }
        });
    };

    getProtonDBInfo();
    getSteamDeckInfo();
    createSteamDBButton(steamDBurl, 'View on SteamDB');
})();
