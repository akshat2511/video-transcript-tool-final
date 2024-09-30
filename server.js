import { AssemblyAI } from 'assemblyai'
import express from express;
const app = express();
const client = new AssemblyAI({
    apiKey: '3ec7b601debf42f584c558d73a58753b'
});
// let transcript = await client.transcripts.transcribe({
// audio: "./videoplayback1.mp4", language_code:"hi"
// });
// const params = {
//     audio: audioUrl,
//     language_code: 'hi'
//   }

import fs from 'fs';

const createSubtitle = (words) => {
    const formatTime = (timeInMs) => {
        const date = new Date(timeInMs);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(timeInMs % 1000).padStart(3, '0');
        return `${hours}:${minutes}:${seconds},${milliseconds}`;
    };

    let subtitles = '';

    words.forEach((word, index) => {
        const start = formatTime(word.start);
        const end = formatTime(word.end);
        subtitles += `${index + 1}\n${start} --> ${end}\n${word.text}\n\n`;
    });

    return subtitles;
};

const saveSubtitleToFile = (subtitles, filename) => {
    fs.writeFileSync(filename, subtitles);
    console.log(`Subtitle file saved as ${filename}`);
};


const words = transcript.words;
const subtitles = createSubtitle(words);
saveSubtitleToFile(subtitles, 'subtitles.srt');

console.log(transcript);
app.post('/:ak/:lang', async (req, res) => {
    const ak = req.params.ak;
    const lang = req.params.lang;
    let transcript = await client.transcripts.transcribe({
        audio: ak, language_code: lang
    });
    const subtitles = createSubtitle(transcript.words);
    saveSubtitleToFile(subtitles, 'subtitles.srt');
    const subtitleFile = fs.readFileSync(subtitles.srt)
    res.json(transcript);



})

