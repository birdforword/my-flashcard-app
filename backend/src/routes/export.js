// backend/src/routes/export.js
import express from "express";
import pkg from "anki-apkg-export";
const ApkgExporter = pkg.default;
import crypto from "crypto";

import Card from "../models/cardModel.js";
import Deck from "../models/deckModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // deckIdの取得とカード検索条件の設定
    const deckId = req.query.deckId ? parseInt(req.query.deckId, 10) : null;
    const where = deckId ? { deckId } : {};
    const cards = await Card.findAll({ where, order: [["startSec", "ASC"]] });

    // デッキ名の決定
    let deckName = "Video Flashcards Deck";
    if (deckId) {
      const deck = await Deck.findByPk(deckId);
      if (!deck) return res.status(404).json({ error: "Deck not found" });
      deckName = deck.name;
    }

    // ApkgExporterインスタンス生成
    const exporter = new ApkgExporter(deckName, Date.now());

    // モデル定義
    exporter.createModel({
      modelName: "YouTube Loop",
      inOrderFields: [
        "hash",
        "Front",
        "End",
        "Lang_you",
        "Lang_target",
        "Start_sec",
        "End_sec",
      ],
      css: `
        .translation { font-size:16px; margin-top:10px; }
      `,
      cardTemplates: [
        {
          name: "Card 1",
          front: `<!-- Front -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Loop</title>
</head>
<body>
  <div id="player"></div>

  <script>
    var player;
    var startTime = {{Start_sec}};
    var endTime = {{End_sec}};

    function loadYouTubeAPI() {
      if (!document.getElementById('youtube-iframe-api')) {
        var tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      } else {
        onYouTubeIframeAPIReady();
      }
    }

    function onYouTubeIframeAPIReady() {
      if (player) { player.destroy(); }
      player = new YT.Player('player', {
        height: '240',
        width: '426',
        videoId: '{{Lang_you}}',
        playerVars: {
          autoplay: 1,
          cc_lang_pref: '{{Lang_you}}',
          cc_load_policy: 1,
          controls: 0,
          iv_load_policy: 3,
          modestbranding: 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    function onPlayerReady(event) {
      player.seekTo(startTime);
      player.playVideo();
    }

    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.PLAYING) {
        setInterval(() => {
          if (player.getCurrentTime() >= endTime) {
            player.seekTo(startTime);
          }
        }, 500);
      }
    }

    document.addEventListener('anki:review-end', function() {
      if (player) {
        player.destroy();
        player = null;
      }
    });

    loadYouTubeAPI();
  </script>
  <script src="https://www.youtube.com/iframe_api"></script>

  <br><br>
  <div class="translation">{{Front}}<br><br>{{End}}</div>
</body>`,
          back: `<!-- Back -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Loop</title>
</head>
<body>
  <div id="player"></div>

  <script>
    var player;
    var startTime = {{Start_sec}};
    var endTime = {{End_sec}};

    function loadYouTubeAPI() {
      if (!document.getElementById('youtube-iframe-api')) {
        var tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      } else {
        onYouTubeIframeAPIReady();
      }
    }

    function onYouTubeIframeAPIReady() {
      if (player) { player.destroy(); }
      player = new YT.Player('player', {
        height: '240',
        width: '426',
        videoId: '{{Lang_target}}',
        playerVars: {
          autoplay: 1,
          cc_lang_pref: '{{Lang_target}}',
          cc_load_policy: 1,
          controls: 0,
          iv_load_policy: 3,
          modestbranding: 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    function onPlayerReady(event) {
      player.seekTo(startTime);
      player.playVideo();
    }

    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.PLAYING) {
        setInterval(() => {
          if (player.getCurrentTime() >= endTime) {
            player.seekTo(startTime);
          }
        }, 500);
      }
    }

    document.addEventListener('anki:review-end', function() {
      if (player) {
        player.destroy();
        player = null;
      }
    });

    loadYouTubeAPI();
  </script>
  <script src="https://www.youtube.com/iframe_api"></script>

  <br><br>
  <div>{{Front}}<br><br>{{End}}</div>
</body>`
        }
      ]
    });

    // ノート追加
    cards.forEach((c) => {
      const hash = crypto
        .createHash("sha1")
        .update(
          `${c.videoId}-${c.startSec}-${c.endSec}-${c.frontText}-${c.backText}`
        )
        .digest("hex");

      exporter.addNote({
        modelName: "YouTube Loop",
        fields: {
          hash: hash,
          Front: c.frontText || "",
          End: c.backText || "",
          Lang_you: c.langYou || "",
          Lang_target: c.langTarget || "",
          Start_sec: c.startSec != null ? c.startSec.toString() : "",
          End_sec: c.endSec != null ? c.endSec.toString() : "",
        }
      });
    });

    // .apkg生成
    const buffer = await exporter.save();
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(deckName)}.apkg"`
    );
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(buffer);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Failed to export deck" });
  }
});

export default router;
