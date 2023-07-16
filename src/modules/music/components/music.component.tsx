import React, { useCallback, useEffect, useState } from 'react';
import { API, Auth, Storage } from 'aws-amplify';


import ReactPlayer from 'react-player';

interface Song {
    title: string;
    author: string;
    filePath: string;
}

export const MusicComponent = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [songPlaying, setSongPlaying] = useState<number | null>(null);
    const [audioURL, setAudioURL] = useState<string>('');

    const toggleSong = useCallback(async (idx: number) => {
        if (songPlaying === idx) {
            // stop song
            setSongPlaying(null);
            return;
        }

        if (idx === null || !songs[idx]) return;

        const songFilePath = songs[idx].filePath;
        try {
            const fileAccessURL = await Storage.get(songFilePath, { expires: 60 });
            setSongPlaying(idx);
            setAudioURL(fileAccessURL);
        } catch(error) {
            console.error(error);

            setSongPlaying(null);
            setAudioURL('');
        }

    }, [songs, songPlaying])

    const fetchSongs = useCallback(async () => {
        const user = await Auth.currentAuthenticatedUser()
        const token = user.signInUserSession.idToken.jwtToken
        const requestData = {
            headers: {
                Authorization: token,
                "Content-Type": 'application/json'
            }
        }

        try {
            const songData = await API.get('awsradubagrincom', '/songs', requestData);
            setSongs(songData);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs])

    return <div>
        <p>Songs list:</p>
        <ul>
            {songs.map((song, idx) => (
                <li>
                    <div style={{display: 'flex'}}>
                        <p>{song.title}</p>
                        <button onClick={() => toggleSong(idx)}>{idx === songPlaying ? 'pause' : 'play'}</button>
                    </div>
                    {songPlaying === idx ? (
                        <div className="ourAudioPlayer">
                            <ReactPlayer
                                url={audioURL}
                                controls
                                playing
                                height="50px"
                                onPause={() => toggleSong(idx)}
                            />
                        </div>
                        ) : null}
                </li>)
            )}     
        </ul>
    </div>
}