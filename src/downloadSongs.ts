import YoutubeMp3Downloader from "youtube-mp3-downloader";
import { Playlist, PlaylistItem } from "./types";
import settings from "./settings";
import fs from "fs-extra";

const videoIdRegexp = new RegExp(/((?<=id=).*)$/);

export default function downloadSongs(
    playlist: Playlist,
    playlistItems: PlaylistItem[]
): Promise<true> {
    return new Promise(async (resolve, reject) => {
        try {
            const saveDir = `${await settings.getSaveDir()}/${playlist.title}`;

            fs.ensureDirSync(saveDir);

            const existingVideoIds = getVideoIds();

            function getVideoIds() {
                let ids: { [key: string]: true } = {};
                const fileNames = fs.readdirSync(saveDir);

                for (const name of fileNames) {
                    const result = videoIdRegexp.exec(name);
                    if (result) {
                        const id = result[0].replace(/\.[^/.]+$/, "");
                        ids[id] = true;
                    }
                }

                return ids;
            }

            const YD = new YoutubeMp3Downloader({
                ffmpegPath: await settings.getFfmpegLocation(),
                outputPath: saveDir,
                youtubeVideoQuality: "highestaudio",
                queueParallelism: 1,
                progressTimeout: 500,
                allowWebm: true,
            });

            for (let playlistItem of playlistItems) {
                if (!existingVideoIds[playlistItem.id]) {
                    YD.download(
                        playlistItem.id,
                        playlistItem.title + " id=" + playlistItem.id + ".mp3"
                    );
                }
            }

            YD.on("finished", function (err, data) {
                resolve(true);
            });

            YD.on("error", (err) => {
                console.log(err);
            });

            YD.on("progress", function (data) {
                const progressMessage = `${data.videoId} ${formatBytes(
                    data.progress.transferred
                )}/${formatBytes(data.progress.length)} `;
                process.stdout.write(progressMessage + "\r");
            });
        } catch (e) {
            reject(e);
        }
    });
}

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
