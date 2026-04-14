// ==UserScript==
// @name         DmailTemplates
// @namespace    https://github.com/nonamethanks/danbooru-userscripts
// @version      0.3.1
// @description  Provide pre-written DMail templates.
// @source       https://github.com/nonamethanks/danbooru-userscripts
// @author       nonamethanks
// @match        *://*.donmai.us/dmails/new*
// @exclude      /^https?://\w+\.donmai\.us/.*\.(xml|json|atom)(\?|$)/
// @run-at       document-idle
// @downloadURL  https://raw.githubusercontent.com/nonamethanks/danbooru-userscripts/master/dmail_templates.user.js
// @updateURL    https://raw.githubusercontent.com/nonamethanks/danbooru-userscripts/master/dmail_templates.user.js
// ==/UserScript==

const DMAIL_TEMPLATES_POSTS = [
    {
        name: "Incorrect ratings",
        title: "About your ratings",
        message: `
        Several of your posts have incorrect ratings.

        Please familiarize yourself with [[howto:rate]]. If you are not sure how to rate a post, you can ask in topic #8495 or in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "Not enough tags",
        title: "About your tagging",
        message: `
        Many of your uploads do not have a sufficient amount of tags. %USER_POST_SEARCH%gentags:<15%

        Tagging your uploads is mandatory on Danbooru, and every post you upload should ideally have at least 20 tags (though exceptions may apply, such as [[scenery]] or [[no humans]] posts).
        Please familiarize yourself with [[howto:tag]] and [[howto:tag_checklist]]. If you are not sure how to tag a post, you can ask in topic #12251 or in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "Blatant mistagging",
        title: "About your tagging",
        message: `
        Several of your posts have completely wrong tags.

        Please tag what you actually see in the image, don't tag canonically or spam related tags on uploads.
        This kind of behavior will result in a ban if you continue.
        `
    },
    {
        name: "No sources on uploads",
        title: "About your sources",
        message:
        `
        Several of your posts are missing valid sources. %USER_POST_SEARCH%-source:http*%

        Please familiarize yourself with [[help:image source]], and fix your old uploads with the correct sources where possible.
        If you accidentally uploaded samples, then consider posting in topic #16765 so that they can be replaced with the full size.

        Sourcing is mandatory on Danbooru, and it's a fundamental part of our archival process. Ideally, every post should have a source.

        If you are not sure how to source a post or set of posts, you can ask in the forums or in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "AI uploads",
        title: "About your uploads",
        message: `
        Several of your uploads appear to be blatantly [[ai-generated]]. %USER_POST_SEARCH%ai-generated%

        Please keep in mind that [[ai-generated]] content withot any human input is forbidden on Danbooru, and those posts will be deleted (if they haven't been already).
        [[ai-assisted]] content is allowed in certain cases, but it will be subjected to much higher scrutiny.

        If you are not sure whether an artist account is using AI, you can ask for opinions in topic #22285 or in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "Duplicate uploads",
        title: "About your uploads",
        message: `
        Several of your uploads appear to be [[duplicate]]s of existing posts. %USER_POST_SEARCH%duplicate%

        Please be more mindful in the future, and familiarize yourself with the information in the [[duplicate]] wiki page.
         The upload page will tell you if there's other posts with high similarity to your pending upload that have already been submitted to the site, so you should be more careful to verify whether your uploads are [[revision]]s or higher quality versions, or just redundant [[duplicate]]s.
        If you are not sure, you can ask in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "Off-topic uploads",
        title: "About your uploads",
        message: `
        Several of your uploads are [[off-topic]] to Danbooru. %USER_POST_SEARCH%off-topic%

        Danbooru is a site dedicated primarly to anime-style or anime-related artwork. While this is a broad category, your uploads are in no way related to it.
        Please familiarize yourself with the [[help:upload rules|Upload Rules]] before you continue, otherwise your behavior may result in a ban.
        `
    },
    {
        name: "Low quality uploads",
        title: "About your uploads",
        message: `
        Several of your uploads have been (or will shortly be) deleted for poor quality.

        Please familiarize yourself with the [[help:upload rules|Upload Rules]] before you continue. Danbooru is an art gallery for [b]high-quality[/b] content.
        While what exactly constitutes "high quality" is debatable, your posts are well below the threshold. Please look at {{status:active approver:any}} if you are not sure what that means, and compare it to your uploads.
        `
    },
]
const DMAIL_TEMPLATES_COMMENTS = [
    {
        name: "Low quality comments",
        title: "About your comments",
        message: `
        Many of your comments are low quality or irrelevant to the posts you're leaving them on.

        Spamming comments, deleting them to avoid downvotes, or posting low quality content like erotic roleplay should be avoided.
        Please read [[help:community_rules]] before you leave further comments.
        `
    },
    {
        name: "Spamming the same comment",
        title: "About your comments",
        message: `
        Please stop posting the same comment over and over again.

        Spamming comments, deleting them to avoid downvotes, or posting low quality content like erotic roleplay should be avoided.
        Please read [[help:community_rules]] before you leave further comments.
        `
    },
    {
        name: "Comments not in english",
        title: "About your comments",
        message: `
        Please write comments in English. Other languages may be used if it's relevant to the post at hand, but in general, Danbooru is an English speaking website.
        Please read [[help:community_rules]] before you leave further comments.
        `
    },
]


const DMAIL_TEMPLATES_NOTES = [
    {
        name: "Bad translations",
        title: "About your translations",
        message: `
        Several of your translations appear not to meet our quality standards.

        Please familiarize yourself with [[howto:translate]]. You should not translate posts unless you are reasonably familiar with both the original language and English.
        `
    },
    {
        name: "AI/ML translations",
        title: "About your translations",
        message: `
        Several of your translations appear to have been generated via AI tools or machine translation without checking for accuracy.

        Please familiarize yourself with [[howto:translate]]. You should not translate posts unless you are reasonably familiar with both the original language and English.
        `
    },
]

const DMAIL_TEMPLATES_MISC = [
    {
        name: "Flagging for missing tags",
        title: "About your flags",
        message: `
        You have recently flagged posts for not being tagged correctly.

        Please familiarize yourself with [[howto:flag]] before you flag again. You should only flag posts that break our [[help:upload rules]] or don't meet our quality standards.
        A post not being tagged properly is not a valid reason for a flag. Instead, properly tag the post yourself, and if you don't like the tag, blacklist it after.
        `
    },
    {
        name: "Flagging for offensive content",
        title: "About your flags",
        message: `
        You have recently flagged posts for being offensive or containing objectionable content.

        Please familiarize yourself with [[howto:flag]] before you flag again. You should only flag posts that break our [[help:upload rules]] or don't meet our quality standards.
        Not personally liking the subject matter of a post is not a valid reason to flag it. Instead, blacklist the tag that you don't like, so that you won't see it again.
        `
    },
    {
        name: "Bad flags",
        title: "About your flags",
        message: `
        Several of your flags have been rejected for being invalid.

        Please familiarize yourself with [[howto:flag]] before you flag again. You should only flag posts that break our [[help:upload rules]] or don't meet our quality standards.
        A post having objectionable content or not being tagged properly is not a valid reason for a flag. Instead, blacklist the tag you don't like, or properly tag the post yourself.
        `
    },
]


function parse_example_entry(raw) {
    raw = raw.trim();
    if (!raw) return null;

    let url;
    try {
        if (/^https?:\/\//i.test(raw)) {
            url = new URL(raw);
        }
    } catch {
        return raw
    }

    if (!url) { return raw }

    const path = url.pathname;

    const post = path.match(/^\/posts\/(\d+)/);
    if (post) return `post #${post[1]}`;

    const comment = path.match(/^\/comments\/(\d+)/);
    if (comment) return `comment #${comment[1]}`;

    const wiki = path.match(/^\/wiki_pages\/(.+)/);
    if (wiki) return `[[${decodeURIComponent(wiki[1])}]]`;

    const artist = path.match(/^\/artists\/(.+)/);
    if (artist) return `[[${decodeURIComponent(artist[1])}]]`;

    // Anything else (version pages, etc.) — keep the original URL
    return raw;
}

function build_example_list(input_value) {
    const entries = input_value.split("\n").map(e => e.trim()).filter(Boolean);
    return entries.map(parse_example_entry).filter(Boolean).map(e => `* ${e} `);
}

function draw_button() {
    const subnavMenu = document.querySelector("#subnav-menu");

    subnavMenu.innerHTML += '<span class="text-muted select-none">|</span>';
    subnavMenu.innerHTML += '<a id="dmail-templates" class="py-1.5 px-3">Dmail Templates</a>';

    document.querySelector("#dmail-templates").addEventListener("click", draw_modal);
}

const tabs = [
    { id: "posts-tab",    label: "Posts",    templates: DMAIL_TEMPLATES_POSTS },
    { id: "comments-tab", label: "Comments", templates: DMAIL_TEMPLATES_COMMENTS },
    { id: "notes-tab",    label: "Notes",    templates: DMAIL_TEMPLATES_NOTES },
    { id: "misc-tab",     label: "Misc",     templates: DMAIL_TEMPLATES_MISC },
];

function build_tab_html(tabs) {
    const tabLinks = tabs.map((tab, i) => `
        <a class="tab"
           x-on:click.prevent="active = ${i}"
           x-bind:class="{ 'active-tab': active === ${i} }"
           href="#">${tab.label}</a>
    `).join("");

    const tabPanels = tabs.map((tab, i) => `
        <div id="${tab.id}"
             x-show="active === ${i}">
        </div>
    `).join("");

    return `
        <div class="tab-panel-component horizontal-tab-panel fixed-width-container" x-data="{ active: 0 }">
            <h2>Dmail Templates</h2>
            <div class="tab-list thin-x-scrollbar">${tabLinks}</div>
            <div class="tab-panels">${tabPanels}</div>
        </div>
    `;
}

function draw_modal() {
    const existing = document.querySelector("#dmail-modal");
    if (existing) {
        existing.style.display = existing.style.display === "none" ? "flex" : "none";
        return;
    }

    const modal = document.createElement("div");
    modal.id = "dmail-modal";

    Object.assign(modal.style, {
        position: "fixed",
        top: "150px",
        right: "50px",
        backgroundColor: "var(--subnav-menu-background-color)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: "1000",
        padding: "20px",
    });

    modal.innerHTML = build_tab_html(tabs);

    const examplesLabel = document.createElement("label");
    examplesLabel.textContent = "Examples (URLs or dtext, one per line):";
    examplesLabel.style.cssText = "display: block; margin-bottom: 4px;";

    const examplesInput = document.createElement("textarea");
    examplesInput.id = "dmail-template-examples";
    examplesInput.placeholder = "https://danbooru.donmai.us/posts/123\npost #456\n[[wiki_page]]";
    examplesInput.rows = 4;
    examplesInput.style.cssText = "width: 100%; box-sizing: border-box; margin-bottom: 12px; font-family: monospace; font-size: 12px;";

    const tabComponent = modal.querySelector(".tab-panel-component");
    tabComponent.insertBefore(examplesLabel, tabComponent.querySelector(".tab-list"));
    tabComponent.insertBefore(examplesInput, tabComponent.querySelector(".tab-list"));

    tabs.forEach(({ id, templates }) => {
        const panel = modal.querySelector(`#${id}`);
        templates.forEach((option) => {
            const button = document.createElement("button");
            button.textContent = option.name;
            button.style.cssText = "display: block; margin: 10px 0;";
            button.addEventListener("click", () => fill_dmail(option.title, option.message));
            panel.appendChild(button);
        });
    });

    document.body.appendChild(modal);
}

function fill_dmail(title, message) {
    $('.dtext-editor-body').css({ height: "300px" });
    $("#dmail_title").val(title)

    message = message.replace(/\n +/g, "\n").replace(/^\s+/, "").replace(/\s+$/, "");

    const dmail_recipient = $("#dmail_to_name").val()
    if (dmail_recipient.trim().length > 0) {
        message = message.replace(/%USER_POST_SEARCH%(.*?)%/, `See: {{user:${dmail_recipient} $1}}.`)
    } else {
        message = message.replace(/%USER_POST_SEARCH%(.*?)%/,  "")
    }

    const exampleList = build_example_list($("#dmail-template-examples").val());
    if (exampleList.length > 1) {
        message += `\n\nHere are a few examples: \n${exampleList.join("\n")}`;
    } else if (exampleList.length === 1) {
        message += `\n\nHere's an example: \n${exampleList[0]}`;
    }

    console.log("Updating dmail body.")
    $("#dmail_body").closest(".dtext-editor").get(0).editor.dtext = message + "\n\n"
    $("#dmail_body").focus()
}

(function () {
    "use strict"

    draw_button()
})()
