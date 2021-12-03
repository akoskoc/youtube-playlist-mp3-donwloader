import getOAuth2Client from "./getOAuth2Client";
import { getYtPlaylistNames } from "./ytApi";
(async function () {
    const oauth2Client = await getOAuth2Client();
    const playlists = await getYtPlaylistNames(oauth2Client);
    playlists.map((playlist) => console.log(playlist.id, playlist.title));
})();
