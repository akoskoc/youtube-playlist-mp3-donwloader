import youtubeApi from "./ytApi";
import askForPlaylistName from "./utils";
import downloadSongs from "./downloadSongs";

(async function () {
    await youtubeApi.init();

    const playlists = await youtubeApi.getYtPlaylistNames();

    const selectedPlaylist = await askForPlaylistName(playlists);

    const playlistItems = await youtubeApi.getYtPlaylistItems(
        selectedPlaylist.id
    );

    await downloadSongs(selectedPlaylist, playlistItems);
})();
