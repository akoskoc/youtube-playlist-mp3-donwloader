import { ask } from "./utils";
import { Playlist } from "./types";

export default function promptUserForPlaylistName(
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
