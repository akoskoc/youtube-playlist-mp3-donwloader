import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { Playlist } from "./types";

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
