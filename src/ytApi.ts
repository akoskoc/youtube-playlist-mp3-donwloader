import getOAuth2Client from "./getOAuth2Client";
import { OAuth2Client } from "google-auth-library";
import { google, youtube_v3 } from "googleapis";
import { Playlist, PlaylistItem } from "./types";

const ERR_NOT_AUTHENTICATED = new Error("Authentication error.");

class YoutubeApi {
    private oauth2Client: OAuth2Client | undefined;
    private yt: youtube_v3.Youtube;

    constructor() {
        this.yt = google.youtube("v3");
    }

    init(): Promise<true> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.oauth2Client) {
                    this.oauth2Client = await getOAuth2Client();
                }
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    }

    public getYtPlaylistNames(): Promise<Playlist[]> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.oauth2Client) throw ERR_NOT_AUTHENTICATED;
                let playlists: Playlist[] = [];
                let nextPageToken = "";

                while (true) {
                    let response = await this.yt.playlists.list({
                        auth: this.oauth2Client,
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

    public getYtPlaylistItems(playlistId: string): Promise<PlaylistItem[]> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.oauth2Client) throw ERR_NOT_AUTHENTICATED;

                let playlistItems: PlaylistItem[] = [];
                let nextPageToken = "";

                while (true) {
                    let response = await this.yt.playlistItems.list({
                        auth: this.oauth2Client,
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
}

const youtubeApi = new YoutubeApi();

export default youtubeApi;
