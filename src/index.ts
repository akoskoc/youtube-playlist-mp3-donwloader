import youtubeApi from "./ytApi";
import askForPlaylistName from "./utils";
import settings from "./settings";
import fs from "fs-extra";

(async function () {
    const saveDir = await settings.getSaveDir();
    await youtubeApi.init();

    const playlists = await youtubeApi.getYtPlaylistNames();

    const selectedPlaylist = await askForPlaylistName(playlists);

    const playlistItems = await youtubeApi.getYtPlaylistItems(
        selectedPlaylist.id
    );

    fs.ensureDir(saveDir);

    fs.writeFileSync(
        `${saveDir}/${selectedPlaylist.title}.json`,
        JSON.stringify(playlistItems)
    );
})();
