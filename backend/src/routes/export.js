// src/routes/export.js
import express from "express";
import { APKG } from "anki-apkg";
import crypto from "crypto";
import fs from "fs/promises";
import os from "os";
import path from "path";

import Card from "../models/cardModel.js";
import Deck from "../models/deckModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 1. Gather deck and cards
    const deckId = req.query.deckId ? parseInt(req.query.deckId, 10) : null;
    const where = deckId ? { deckId } : {};
    const cards = await Card.findAll({ where, order: [["startSec", "ASC"]] });

    // 2. Determine deck name
    let deckName = "Video Flashcards Deck";
    if (deckId) {
      const deck = await Deck.findByPk(deckId);
      if (!deck) return res.status(404).json({ error: "Deck not found" });
      deckName = deck.name;
    }

    // 3. Create APKG exporter with custom model
    const apkg = new APKG({
      name: deckName,
      card: {
        fields: [
          "hash", "Front", "End",
          "Lang_you", "Lang_target",
          "Start_sec", "End_sec"
        ],
        template: {
          question: `<!-- Front -->
<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"></head>
<body>
  <div id=\"player\"></div>
  <script>
    var player, startTime={{Start_sec}}, endTime={{End_sec}};
    function loadYouTubeAPI(){
      if(!document.getElementById('youtube-iframe-api')){
        var s=document.createElement('script');
        s.id='youtube-iframe-api';
        s.src='https://www.youtube.com/iframe_api';
        document.body.appendChild(s);
      } else { onYouTubeIframeAPIReady(); }
    }
    function onYouTubeIframeAPIReady(){
      if(player) player.destroy();
      player=new YT.Player('player',{height:'240',width:'426',videoId:'{{Lang_you}}',playerVars:{autoplay:1,cc_lang_pref:'{{Lang_you}}',cc_load_policy:1,controls:0,iv_load_policy:3,modestbranding:1},events:{onReady:onPlayerReady,onStateChange:onPlayerStateChange}});
    }
    function onPlayerReady(e){player.seekTo(startTime);player.playVideo();}
    function onPlayerStateChange(e){if(e.data===YT.PlayerState.PLAYING){setInterval(()=>{if(player.getCurrentTime()>=endTime)player.seekTo(startTime);},500);}}
    document.addEventListener('anki:review-end',()=>{if(player){player.destroy();player=null;}});
    loadYouTubeAPI();
  </script>
  <script src=\"https://www.youtube.com/iframe_api\"></script>
  <br><br>
  <div class=\"translation\">{{Front}}<br><br>{{End}}</div>
</body>`,
          answer: `<!-- Back -->
<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"></head>
<body>
  <div id=\"player\"></div>
  <script>
    var player, startTime={{Start_sec}}, endTime={{End_sec}};
    function loadYouTubeAPI(){
      if(!document.getElementById('youtube-iframe-api')){
        var s=document.createElement('script');
        s.id='youtube-iframe-api';
        s.src='https://www.youtube.com/iframe_api';
        document.body.appendChild(s);
      } else { onYouTubeIframeAPIReady(); }
    }
    function onYouTubeIframeAPIReady(){
      if(player) player.destroy();
      player=new YT.Player('player',{height:'240',width:'426',videoId:'{{Lang_target}}',playerVars:{autoplay:1,cc_lang_pref:'{{Lang_target}}',cc_load_policy:1,controls:0,iv_load_policy:3,modestbranding:1},events:{onReady:onPlayerReady,onStateChange:onPlayerStateChange}});
    }
    function onPlayerReady(e){player.seekTo(startTime);player.playVideo();}
    function onPlayerStateChange(e){if(e.data===YT.PlayerState.PLAYING){setInterval(()=>{if(player.getCurrentTime()>=endTime)player.seekTo(startTime);},500);}}
    document.addEventListener('anki:review-end',()=>{if(player){player.destroy();player=null;}});
    loadYouTubeAPI();
  </script>
  <script src=\"https://www.youtube.com/iframe_api\"></script>
  <br><br>
  <div>{{Front}}<br><br>{{End}}</div>
</body>`
        },
        styleText: `.translation{font-size:16px;margin-top:10px;}`
      }
    });

    // 4. Add notes
    cards.forEach(c => {
      const hash = crypto.createHash('sha1')
        .update(`${c.videoId}-${c.startSec}-${c.endSec}-${c.frontText}-${c.backText}`)
        .digest('hex');
      apkg.addCard({ timestamp: Date.now(), content: [
        hash, c.frontText, c.backText, c.langYou, c.langTarget,
        c.startSec?.toString() || '', c.endSec?.toString() || ''
      ]});
    });

    // 5. Save and respond
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'apkg-'));
    await apkg.save(tmpDir);
    const filePath = path.join(tmpDir, `${deckName}.apkg`);
    const buffer = await fs.readFile(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(deckName)}.apkg"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  } catch(err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Failed to export deck' });
  }
});

export default router;
