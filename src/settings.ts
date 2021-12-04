import fs from "fs-extra";
import path from "path";
import { ask } from "./utils";
import { SettingsFile } from "./types";

const APPLICATION_DIR = __dirname;
const SETTINGS_FILENAME = "settings.json";
const PATH_TO_SETTINGS_FILE = `${APPLICATION_DIR}/${SETTINGS_FILENAME}`;

const ERR_APP_SETTINGS_NOT_INIT = new Error(
    "Application settings are not initalized."
);

class Settings {
    private APPLICATION_DIR: string;
    private SAVE_DIR: string | undefined;

    constructor() {
        this.APPLICATION_DIR = APPLICATION_DIR;
    }

    public getApplicationDir(): string {
        return this.APPLICATION_DIR;
    }

    public getSaveDir(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.SAVE_DIR) {
                    resolve(this.SAVE_DIR);
                } else {
                    const settings = JSON.parse(
                        fs.readFileSync(PATH_TO_SETTINGS_FILE, "utf-8")
                    ) as SettingsFile;

                    if (
                        !settings.saveDir ||
                        !path.isAbsolute(settings.saveDir)
                    ) {
                        throw ERR_APP_SETTINGS_NOT_INIT;
                    }

                    this.SAVE_DIR = settings.saveDir;

                    resolve(this.SAVE_DIR);
                }
            } catch (e) {
                let saveDir;

                do {
                    saveDir = await ask(
                        `Select a save directory for your playlists (default: ${this.APPLICATION_DIR}): `
                    );
                } while (!path.isAbsolute(saveDir) && saveDir !== "");

                if (saveDir === "") {
                    saveDir = this.APPLICATION_DIR;
                }

                fs.writeFileSync(
                    PATH_TO_SETTINGS_FILE,
                    JSON.stringify({ saveDir: saveDir })
                );

                resolve(saveDir);
            }
        });
    }
}

const settings = new Settings();

export default settings;
