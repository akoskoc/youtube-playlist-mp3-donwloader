import fs from "fs-extra";
import path from "path";
import { askForPath } from "./utils";
import { SettingsFile } from "./types";

const APPLICATION_DIR = __dirname;
const SETTINGS_FILENAME = "settings.json";
const FFMPEG_FILENAME = "ffmpeg.exe";
const PATH_TO_SETTINGS_FILE = `${APPLICATION_DIR}/${SETTINGS_FILENAME}`;

class Settings {
    private APPLICATION_DIR: string;
    private SAVE_DIR: string | undefined;
    private FFMPEG_LOCATION: string | undefined;

    constructor() {
        this.APPLICATION_DIR = APPLICATION_DIR;
    }

    public getApplicationDir(): string {
        return this.APPLICATION_DIR;
    }

    private updateSettings(newSettings: Object) {
        fs.ensureFileSync(PATH_TO_SETTINGS_FILE);

        const unparsedSettings = fs.readFileSync(
            PATH_TO_SETTINGS_FILE,
            "utf-8"
        );

        if (!unparsedSettings) {
            fs.writeFileSync(
                PATH_TO_SETTINGS_FILE,
                JSON.stringify(newSettings)
            );
        } else {
            fs.writeFileSync(
                PATH_TO_SETTINGS_FILE,
                JSON.stringify({
                    ...JSON.parse(unparsedSettings),
                    ...newSettings,
                })
            );
        }
    }

    public getSaveDir(): Promise<string> {
        const askForSaveDir = async (): Promise<string> => {
            let saveDir = await askForPath(
                `Select a save directory for your playlists (default: ${this.APPLICATION_DIR}): `,
                [""]
            );

            if (saveDir === "") {
                saveDir = this.APPLICATION_DIR;
            }

            return saveDir;
        };

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
                        this.SAVE_DIR = await askForSaveDir();
                        this.updateSettings({ saveDir: this.SAVE_DIR });
                    } else {
                        this.SAVE_DIR = settings.saveDir;
                    }

                    resolve(this.SAVE_DIR);
                }
            } catch (e) {
                this.SAVE_DIR = await askForSaveDir();
                this.updateSettings({ saveDir: this.SAVE_DIR });

                resolve(this.SAVE_DIR);
            }
        });
    }

    public getFfmpegLocation(): Promise<string> {
        const askForFfmpegLocation = async (): Promise<string> => {
            let location;

            do {
                location = await askForPath(`Path to ffmpeg.exe: `);

                if (
                    path.basename(location) === FFMPEG_FILENAME &&
                    fs.existsSync(location)
                ) {
                    break;
                }
            } while (true);

            return location;
        };

        return new Promise(async (resolve, reject) => {
            try {
                if (this.FFMPEG_LOCATION) {
                    resolve(this.FFMPEG_LOCATION);
                } else {
                    const settings = JSON.parse(
                        fs.readFileSync(PATH_TO_SETTINGS_FILE, "utf-8")
                    ) as SettingsFile;

                    if (
                        !settings.ffmpegLocation ||
                        !path.isAbsolute(settings.ffmpegLocation)
                    ) {
                        this.FFMPEG_LOCATION = await askForFfmpegLocation();
                        this.updateSettings({
                            ffmpegLocation: this.FFMPEG_LOCATION,
                        });
                    } else {
                        this.FFMPEG_LOCATION = settings.ffmpegLocation;
                    }

                    resolve(this.FFMPEG_LOCATION);
                }
            } catch (e) {
                this.FFMPEG_LOCATION = await askForFfmpegLocation();
                this.updateSettings({ ffmpegLocation: this.FFMPEG_LOCATION });

                resolve(this.FFMPEG_LOCATION);
            }
        });
    }
}

const settings = new Settings();

export default settings;
