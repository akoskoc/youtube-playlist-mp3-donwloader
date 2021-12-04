import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { Playlist, PlaylistItem } from "./types";

export function getYtPlaylistNames(
    oauth2Client: OAuth2Client
): Promise<Playlist[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const yt = google.youtube("v3");
            let playlists: Playlist[] = [];
            let nextPageToken = "";

            while (true) {
                let response = await yt.playlists.list({
                    auth: oauth2Client,
                    mine: true,
                    part: ["id", "snippet"],
                    maxResults: 50,
                    pageToken: nextPageToken,
                });

                if (response.data.items) {
                    for (const playlist of response.data.items) {
                        if (
                            playlist.id &&
                            playlist.snippet &&
                            playlist.snippet.title
                        ) {
                            playlists.push({
                                id: playlist.id,
                                title: playlist.snippet.title,
                            });
                        }
                    }
                }

                if (!response.data.nextPageToken) {
                    break;
                }

                nextPageToken = response.data.nextPageToken;
            }

            resolve(playlists);
        } catch (e) {
            reject(e);
        }
    });
}

export function getYtPlaylistItems(
    oauth2Client: OAuth2Client,
    playlistId: string
): Promise<PlaylistItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const yt = google.youtube("v3");
            let playlistItems: PlaylistItem[] = [];
            let nextPageToken = "";

            while (true) {
                let response = await yt.playlistItems.list({
                    auth: oauth2Client,
                    playlistId: playlistId,
                    part: ["snippet"],
                    maxResults: 50,
                    pageToken: nextPageToken,
                });

                if (response.data.items) {
                    for (const playlistItem of response.data.items) {
                        if (
                            playlistItem.snippet &&
                            playlistItem.snippet.title &&
                            playlistItem.snippet.resourceId &&
                            playlistItem.snippet.resourceId.videoId
                        ) {
                            playlistItems.push({
                                id: playlistItem.snippet.resourceId.videoId,
                                title: playlistItem.snippet.title,
                            });
                        }
                    }
                }

                if (!response.data.nextPageToken) {
                    break;
                }

                nextPageToken = response.data.nextPageToken;
            }

            resolve(playlistItems);
        } catch (e) {
            reject(e);
        }
    });
}
