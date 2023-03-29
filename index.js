import chalk from "chalk";
import * as fs from "fs";
import { findPassword } from "keytar";
import { join } from "path";
import { fetch } from "node-fetch";
import { promisify } from "util";
import * as endpoints from "./endpoints"

const readFile = promisify(fs.readFile);
const settings = JSON.parse(await readFile("settings.json"));

async function getCookie() {
    if (!["win32"].includes(process.platform)) return;

    const cookie = await findPassword("https://www.roblox.com:RobloxStudioAuth.ROBLOSECURITY");
    if (!cookie) return;
}

async function getCookieState(cookie) {
    const cookie = `.ROBLOSECURITY=${cookie}`;
    
    const ifAuth = await fetch(endpoints.AUTHENTICATED, {
        headers: {
            Cookie: cookie,
        }
    });

    if (ifAuth.status !== 200) throw new Error("Unable to log in with provided cookie...");

    const userId = (await ifAuth.json()).id 
    const csrfRequest = await fetch(endpoints.LOGOUT, {
        method: "POST",
        headers: {
            Cookie: cookie,
        }
    })

    const csrfToken = csrfRequest.headers.get("x-csrf-token");
    if (!csrfToken) throw new Error("Unable to determine CSRF token...");

    return {
        headers: {
            Cookie: cookie,
            "X-CSRF-TOKEN": csrfToken
        },
        userId,
        failedUploads: new Set()
    }
}

async function transfer() {

}

async function main() {
    let cookie = await getCookie();

    const cookieState = await getCookieState(cookie);

    const inputStream = fs.createReadStream("input.txt");
    const outputStream = fs.createWriteStream("output.txt");

    try {
        transfer(inputStream, outputStream, state, 1)
    }
}

main().catch((e) => console.error(chalk.bold.red(e.message + e.stack)));