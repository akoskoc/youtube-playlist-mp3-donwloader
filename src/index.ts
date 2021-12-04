import getOAuth2Client from "./getOAuth2Client";
import { getYtPlaylistNames, getYtPlaylistItems } from "./ytApi";
import getSelectedPlaylistName from "./getSelectedPlaylistName";
import settings from "./settings";
import fs from "fs-extra";

(async function () {
    const saveDir = await settings.getSaveDir();

    const oauth2Client = await getOAuth2Client();
    const playlists = await getYtPlaylistNames(oauth2Client);

    const selectedPlaylist = await getSelectedPlaylistName(playlists);

    const playlistItems = await getYtPlaylistItems(
        oauth2Client,
        selectedPlaylist.id
    );
    fs.ensureDir(saveDir);

    fs.writeFileSync(
        `${saveDir}/${selectedPlaylist.title}.json`,
        JSON.stringify(playlistItems)
    );
})();
