import fs from "fs-extra";
import { Credentials, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { ClientSecret } from "./types";
import { ask } from "./utils";

const OAuth2 = google.auth.OAuth2;
const CREDENTIAL_DIR = process.cwd() + "/.credentials";
const TOKEN_PATH = CREDENTIAL_DIR + "/token.json";
const CLIENT_SECRET_PATH = CREDENTIAL_DIR + "/client_secret.json";

const SCOPES = "https://www.googleapis.com/auth/youtube.readonly";

export default function getOAuth2Client(): Promise<OAuth2Client> {
    return new Promise(async (resolve, reject) => {
        try {
            const clientSecret = await getClientSecretFromDisk();

            const clientSecretString = clientSecret.installed.client_secret;
            const clientId = clientSecret.installed.client_id;
            const redirectUrl = clientSecret.installed.redirect_uris[0];

            const oauth2Client = new OAuth2(
                clientId,
                clientSecretString,
                redirectUrl
            );

            oauth2Client.setCredentials(await getToken(oauth2Client));

            resolve(oauth2Client);
        } catch (e) {
            reject(e);
        }
    });
}

function getToken(oauth2Client: OAuth2Client): Promise<Credentials> {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await getTokenFromDisk());
        } catch (e) {
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: SCOPES,
            });

            console.log("Authorize this app by visiting this url: ", authUrl);
            console.log("\n");

            const code = await ask("Enter the code from that page here: ");

            oauth2Client.getToken(code, (err, token) => {
                if (err || !token) {
                    console.log(
                        "Error while trying to retrieve access token",
                        err
                    );
                    reject(err);
                } else {
                    saveTokenToDisk(token);
                    resolve(token);
                }
            });
        }
    });
}

function saveTokenToDisk(token: Credentials) {
    fs.ensureDirSync(CREDENTIAL_DIR);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
}

function getTokenFromDisk(): Promise<Credentials> {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8")));
        } catch (e) {
            reject(e);
        }
    });
}

function getClientSecretFromDisk(): Promise<ClientSecret> {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, "utf-8")));
        } catch (e) {
            reject(e);
        }
    });
}
