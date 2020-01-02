function load() {
    view("home");
}

function register(name, callback = null) {
    api("scripts/backend/leaderboard/leaderboard.php", "register", {name: name}, (success, result) => {
        if (success) {
            cookie_set("secret", result);
        } else {
            popup(result, 6000, "#AA8888");
        }
        if (callback !== null)
            callback();
    });
}

function check(challenge) {
    let parameters = {
        challenge: challenge,
        flag: CryptoJS.SHA256(get(challenge + "-flag").value).toString(CryptoJS.enc.Hex)
    };
    if (cookie_has("secret")) {
        if (cookie_get("secret") !== "") {
            parameters["secret"] = cookie_get("secret");
        }
    }
    api("scripts/backend/check/check.php", "check", "check", parameters, (success, result) => {
        popup(result, 6000, success ? "#88AA88" : "#AA8888");
    });
}

function link(link) {
    window.open(link, '_blank');
}

function cookie_get(name) {
    name += "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return decodeURIComponent(cookie.substring(name.length, cookie.length));
        }
    }
    return undefined;
}

function cookie_set(name, value) {
    const date = new Date();
    date.setTime(value !== undefined ? date.getTime() + (365 * 24 * 60 * 60 * 1000) : 0);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + date.toUTCString() + ";domain=" + window.location.hostname + ";";
}

function cookie_has(name) {
    return cookie_get(name) !== undefined;
}