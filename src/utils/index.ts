import readline from "readline";
import { Playlist } from "../types";
import path from "path";

export function ask(question: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

export default function askForPlaylistName(
    playlists: Playlist[]
): Promise<Playlist> {
    return new Promise(async (resolve, reject) => {
        try {
            let selectedPlaylist;

            do {
                console.log("Choose a playlist for download: ");
                playlists.map((playlist) => console.log(playlist.title));
                const playlistName = await ask("Enter playlist name: ");

                for (const playlist of playlists) {
                    if (
                        playlist.title.toLowerCase() ===
                        playlistName.toLowerCase()
                    ) {
                        selectedPlaylist = playlist;
                        break;
                    }
                }

                if (!selectedPlaylist) {
                    console.log(
                        `Playlist "${playlistName}" have not been found.`
                    );
                }
            } while (!selectedPlaylist);

            resolve(selectedPlaylist);
        } catch (e) {
            reject(e);
        }
    });
}

export function askForPath(
    question: string,
    accept?: string[]
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        let newPath;

        do {
            newPath = await ask(question);

            if (accept && accept.includes(newPath)) {
                break;
            }
        } while (!path.isAbsolute(newPath));

        resolve(newPath);
    });
}
