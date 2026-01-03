// ==UserScript==
// @name         DmailTemplates
// @namespace    https://github.com/nonamethanks/danbooru-userscripts
// @version      0.2.0
// @description  Provide pre-written DMail templates.
// @source       https://github.com/nonamethanks/danbooru-userscripts
// @author       nonamethanks
// @match        *://*.donmai.us/dmails/new
// @exclude      /^https?://\w+\.donmai\.us/.*\.(xml|json|atom)(\?|$)/
// @run-at       document-idle
// @downloadURL  https://raw.githubusercontent.com/nonamethanks/danbooru-userscripts/master/dmail_templates.user.js
// @updateURL    https://raw.githubusercontent.com/nonamethanks/danbooru-userscripts/master/dmail_templates.user.js
// ==/UserScript==

const DMAIL_TEMPLATES = [
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
        Many of your uploads do not have a sufficient amount of tags.

        Tagging your uploads is mandatory on Danbooru, and every post you upload should ideally have at least 20 tags (though exceptions may apply, such as [[scenery]] or [[no humans]] posts).
        Please familiarize yourself with [[howto:tag]] and [[howto:tag_checklist]]. If you are not sure how to tag a post, you can ask in topic #12251 or in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "Blatant mistagging",
        title: "About your tagging",
        message: `
        Several of your posts have completely wrong tags. Please tag what you actually see in the image, don't tag canonically or spam related tags on uploads.
        This kind of behavior will result in a ban if you continue.
        `
    },
    {
        name: "No sources on uploads",
        title: "About your sources",
        message:
        `
        Several of your posts are missing valid sources. Please familiarize yourself with [[help:image source]].

        Sourcing is mandatory on Danbooru, and it's a fundamental part of our archival process. Ideally, every post should have a source.

        If you are not sure how to source a post or set of posts, you can ask in the forums or in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "AI uploads",
        title: "About your uploads",
        message: `
        Several of your uploads appear to be blatantly [[ai-generated]]. Please keep in mind that [[ai-generated]] content withot any human input is forbidden on Danbooru, and those posts will be deleted (if they haven't been already).
        [[ai-assisted]] content is allowed in certain cases, but it will be subjected to much higher scrutiny.

        If you are not sure whether an artist account is using AI, you can ask for opinions in topic #22285 or in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "Duplicate uploads",
        title: "About your uploads",
        message: `
        Several of your uploads appear to be [[duplicate]]s of existing posts.

        Please be more mindful in the future, and familiarize yourself with the information in the [[duplicate]] wiki page. The upload page will tell you if there's other posts with high similarity to your pending upload that have already been submitted to the site, so you should be more careful to verify whether your uploads are [[revision]]s or higher quality versions, or just redundant [[duplicates]].
        If you are not sure, you can ask in the "official discord":https://discord.gg/danbooru.
        `
    },
    {
        name: "Off-topic uploads",
        title: "About your uploads",
        message: `
        Several of your uploads are [[off-topic]] to Danbooru.

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
        name: "Comments not in english",
        title: "About your comments",
        message: `
        Please write comments in English. Other languages may be used if it's relevant to the post at hand, but in general, Danbooru is an English speaking website.
        Please read [[help:community_rules]] before you leave further comments.
        `
    },
    {
        name: "Bad translations",
        title: "About your translations",
        message: `
        Several of you translations appear not to meet our quality standards.

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

function draw_button() {
    const subnavMenu = document.querySelector("#subnav-menu");

    subnavMenu.innerHTML += '<span class="text-muted select-none">|</span>';
    subnavMenu.innerHTML += '<a id="dmail-templates" class="py-1.5 px-3">Dmail Templates</a>';

    document.querySelector("#dmail-templates").addEventListener("click", draw_modal);
}



function draw_modal() {
    const modal = document.createElement("div");
    modal.id = "dmail-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.right = "50px";
    modal.style.transform = "translateY(-50%)"; // Center vertically
    modal.style.backgroundColor = "var(--subnav-menu-background-color)";
    modal.style.display = "flex";
    modal.style.justifyContent = "flex-end";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
    modal.style.padding = "20px";

    const modalContent = document.createElement("div");
    modalContent.innerHTML = "<h2>Dmail Templates</h2>";

    modalContent.innerHTML += "<h3>Example posts:</h3><input id='dmail-template-example-posts' placeholder='Post IDs, space-separated'></input>"

    DMAIL_TEMPLATES.forEach((option, _index) => {
        const button = document.createElement("button");
        button.textContent = option.name;
        button.style.display = "block";
        button.style.margin = "10px 0";
        button.addEventListener("click", () => fill_dmail(option.title, option.message));
        modalContent.appendChild(button);
    });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function fill_dmail(title, message) {
    $("#dmail_title").val(title)

    message = message.replace(/\n +/g, "\n").replace(/^\s+/, "").replace(/\s+$/, "");

    const examplePosts = $("#dmail-template-example-posts").val().trim();
    if (examplePosts) {
        const postList = examplePosts
            .split(/\s+/)
            .map(post => `* post #${post} `)
            .join("\n");

        message += `\n\nHere's an example: \n${postList}`; // Append the list to the message
    }

    console.log("Updating dmail body.")
    $("#dmail_body").closest(".dtext-editor").get(0).editor.dtext = message + "\n\n"
    $("#dmail_body").focus()
    }

(function () {
    "use strict"

    draw_button()
})()
