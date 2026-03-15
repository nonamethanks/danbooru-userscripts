// ==UserScript==
// @name         Random BUR button
// @namespace    https://github.com/nonamethanks/danbooru-userscripts
// @version      1.0.1
// @description  Provide an admin panel to get random pending BURs to approve or reject
// @source       https://github.com/nonamethanks/danbooru-userscripts
// @author       nonamethanks
// @match        *://*.donmai.us/*
// @exclude      /^https?://\w+\.donmai\.us/.*\.(xml|json|atom)(\?|$)/
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/nonamethanks/danbooru-userscripts/master/random_bur_button.user.js
// @updateURL    https://raw.githubusercontent.com/nonamethanks/danbooru-userscripts/master/random_bur_button.user.js
// ==/UserScript==


function draw_button() {
    const subnavMenu = document.querySelector("#subnav-menu");

    subnavMenu.innerHTML += '<span class="text-muted select-none">|</span>';
    subnavMenu.innerHTML += '<a id="random-bur" class="py-1.5 px-3" href="#">Random BUR</a>';

}


function draw_progress_bar() {
    const subnavMenu = document.querySelector("#subnav-menu");

    subnavMenu.innerHTML += '<a id="approved-counter" class="chip-blue" style="color: black; padding-left: 10px; padding-right: 10px; position: relative; background: white; display: inline-block;">' +
        '<span id="progress-fill" style="position: absolute; top: 0; left: 0; height: 100%; background: var(--button-primary-background-color); width: 0%; z-index: 0;"></span>' +
        '<span id="progress-text" style="position: relative; z-index: 1;"></span>' +
        '</a>';

    set_progress_bar();
}


function set_progress_bar() {
    let today_done = parseInt(localStorage.getItem("burstats.todayDone"));
    let total = parseInt(localStorage.getItem("burstats.active"));
    let target = Math.ceil(total / 10);
    let percent_done = Math.min(Math.round((today_done / target) * 100), 100);

    $("#progress-fill").css("width", `${percent_done}%`);
    $("#progress-text").text(`BURs approved today: ${today_done}/${target}`);
}


function get_or_refresh_data () {
    let lastChecked = parseInt(localStorage.getItem("burstats.lastChecked") || 0)
    let oneHourAgo = Date.now() - (60 * 60 * 1000)

    if (!lastChecked || lastChecked < oneHourAgo) {
        update_today_done()
        update_bur_data()
        localStorage.setItem("burstats.lastChecked", Date.now().toString())
    }
    return parseInt(localStorage.getItem("burstats.todayDone"))
}


function refresh () {
    console.log("Refreshing approved BUR count.")
    localStorage.setItem("burstats.lastChecked", 0)
    get_or_refresh_data()
    set_progress_bar()
}


function open_random_bur () {
    let url = "https://danbooru.donmai.us/bulk_update_requests.json"
    let now = new Date()
    let threedaysago = new Date(now.getTime() - (24 * 60 * 60 * 1000 * 3))
    let params = {
        "search[order]": "status_desc",
        "search[status]": "pending",
        "only": "id,forum_post_id",
        "search[created_at]": `<${threedaysago.toISOString()}`,
        "limit": 1000
    }

    let max_to_remember = 100

    fetch_danbooru_data(url, params)
        .then(data => {
            let last_opened = get_last_opened()

            console.log("Fetched active BUR data. Picking random url...")
            let randomBur = data[Math.floor(Math.random() * data.length)]
            while (true) {
                randomBur = randomBur.forum_post_id
                if (last_opened.includes(randomBur)) {
                    console.log(`${randomBur} was opened recently. Picking another one...`)
                    randomBur = data[Math.floor(Math.random() * data.length)]
                } else {
                    console.log(`Opening ${randomBur}.`)
                    last_opened = last_opened.slice(0, max_to_remember)
                    last_opened.unshift(randomBur)
                    localStorage.setItem("burStats.lastopened", JSON.stringify(last_opened))
                    break
                }
            }
            window.open(`https://danbooru.donmai.us/forum_posts/${randomBur}`)
        })
}


function update_bur_data () {
    const url = "https://danbooru.donmai.us/bulk_update_requests.json"
    const params = {
        "search[order]": "status_desc",
        "search[status]": "pending",
        "only": "id,forum_post_id",
        "limit": 1000
    }

    fetch_danbooru_data(url, params)
        .then(data => {
            console.log("Fetched active BUR stats data.")
            localStorage.setItem("burstats.active", data.length)
        })
}


function update_today_done () {
    let url = "https://danbooru.donmai.us/bulk_update_requests.json"

    let now = new Date()
    let yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000))
    yesterday.toISOString()

    let params = {
        "search[approver_name]": $("body").data("current-user-name"),
        "search[order]": "status_desc",
        "search[status]": "approved",
        "search[updated_at]": `>${yesterday.toISOString()}`,
        "only": "id,updated_at",
        "limit": 1000
    }

    fetch_danbooru_data(url, params)
        .then(data => {
            console.log("Fetched new BUR stats data.")
            localStorage.setItem("burstats.todayDone", data.length)
        })
}


async function fetch_danbooru_data (url, params) {
    let apiUrl = new URL(url)
    Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]))

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText)
            }
            return response.json()
        })
        .catch(error => {
            console.error("There has been a problem with your fetch operation:", error)
        })
}


function get_last_opened() {
    let raw_data = localStorage.getItem("burStats.lastopened")
    if (raw_data) {
        return JSON.parse(raw_data)
    } else {
        return []
    }
}


function main() {
    get_or_refresh_data()
    draw_button()
    draw_progress_bar()

    document.querySelector("#random-bur").addEventListener("click", e => { open_random_bur(e) });
    document.querySelector("#approved-counter").addEventListener("click", e => { refresh(e) });
}


(function () {
    "use strict"

    main()
})()
