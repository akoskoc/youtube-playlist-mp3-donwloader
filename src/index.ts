import getOAuth2Client from "./getOAuth2Client";
import { getYtPlaylistNames } from "./ytApi";
import getSelectedPlaylistName from "./getSelectedPlaylistName";
(async function () {
    const oauth2Client = await getOAuth2Client();
    const playlists = await getYtPlaylistNames(oauth2Client);

    const selectedPlaylist = await getSelectedPlaylistName(playlists);

    console.log(
        "Currently selected playlist for download: ",
        selectedPlaylist.title,
        selectedPlaylist.id
    );
})();
