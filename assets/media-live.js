/* media-live.js - the verification desk simulator.
   Usage:
     <div class="mediabox" data-mode="score" data-levers=""></div>
     <div class="mediabox" data-mode="trace" data-item="flood" data-levers="reverse,metadata"></div>
   data-levers = which checks start ON (comma list of: reverse,metadata,cross,primary,expert,detector).
   NOTE: an empty data-levers attribute is falsy in JS, so it is parsed with === null,
   never with `attr || default` - an empty string legitimately means "every check off".

   The sixth toggle, "detector", is an ANTI-lever: an AI-detection tool that never raises the
   number of items handled correctly, and produces a false accusation against a real photograph.
   That is the lesson, not a bug.

   Honesty rail: the desk is a scripted teaching simulation built from documented verification
   failure modes. The checks are the real ones a newsroom runs. Detector unreliability is the
   documented behaviour cited on the course pages.
*/
(function () {
  "use strict";

  var LEVERS = [
    { key: "reverse",  label: "Reverse search",
      hint: "Reverse image and video-frame search. Catches the oldest failure in the book: a real picture of the wrong event." },
    { key: "metadata", label: "Metadata + C2PA",
      hint: "EXIF, file history, and Content Credentials provenance where it exists. Absence of provenance is not proof of anything." },
    { key: "cross",    label: "Two sources",
      hint: "Two genuinely independent sources. Two outlets quoting the same wire is one source wearing two hats." },
    { key: "primary",  label: "Primary document",
      hint: "The filing, the transcript, the dataset, the original recording. Not the summary of it." },
    { key: "expert",   label: "Expert call",
      hint: "Five minutes with someone who knows the domain. The cheapest check on this list and the first one cut." },
    { key: "detector", label: "AI detector",
      hint: "Run the image through an AI-detection tool and act on its verdict. Try it and watch the false-accusation counter." }
  ];

  /* The desk: 10 items arriving on one night.
     needs: the check that makes this item safe. null = safe with no checks.
     detectorTrap: the anti-lever flips this item to a false accusation. */

  var ITEMS = [
    { q: "Wire photo of last night's council vote, credited and timestamped",
      needs: null, detectorTrap: true,
      pass: "Published as is. It is a real photograph from a wire you have a contract with.",
      trap: "The detector scores it \"87% likely AI\". You spike a genuine wire photo and imply your own supplier faked it." },
    { q: "Dramatic flood video circulating on social, 40k reposts in two hours",
      needs: "reverse",
      pass: "Reverse search finds the same footage from a 2019 storm in another country. Not published.",
      fail: "Published as tonight's flooding. It is 2019 footage from another country, and the correction runs for a week." },
    { q: "Photo of a politician at a rally he says he never attended",
      needs: "metadata",
      pass: "File history and Content Credentials show the edit chain. You can say what was changed and when.",
      fail: "You have a picture and two people shouting. No provenance means no story, only a fight." },
    { q: "\"Three outlets are reporting the minister resigned\"",
      needs: "cross",
      pass: "All three trace to the same wire alert. One source, not three. You hold.",
      fail: "You match a story that has one origin and no confirmation. When it collapses, you collapse with it." },
    { q: "Press release claims the new port cuts emissions 40%",
      needs: "primary",
      pass: "The underlying filing says 40% per container, on a projection, by 2031. The real number is a different story.",
      fail: "You print the 40%. The number is real and the sentence around it is not." },
    { q: "Leaked spreadsheet showing hospital waiting times",
      needs: "primary",
      pass: "You get the source dataset and the field definitions. Two columns mean the opposite of what they look like.",
      fail: "You chart a column labelled \"wait\" that measures something else entirely." },
    { q: "Audio clip of a CEO appearing to admit to price fixing",
      needs: "expert",
      pass: "A forensic audio contact hears splice artefacts in ten seconds and tells you where to look.",
      fail: "You run it. It is two real sentences from two different calls, joined." },
    { q: "AI-generated image submitted by a reader as their own photo",
      needs: "metadata",
      pass: "No camera data, generator signature in the file. Declined, politely, with the reason.",
      fail: "Published with a reader credit. Your masthead now vouches for a synthetic image." },
    { q: "Local claim that the new bypass cut journey times by half",
      needs: "cross",
      pass: "The council says half, the transport authority's own counts say twelve percent. Both go in the story.",
      fail: "One source, one number, printed. The council's press office wrote your headline." },
    { q: "Satellite image said to show new construction at a disputed site",
      needs: "expert",
      pass: "An imagery analyst dates the shadows and the resolution. It is the right site, the wrong month.",
      fail: "You publish a date you cannot defend, in the most contested story of the year." }
  ];

  function itemResult(t, on) {
    if (t.detectorTrap && on.detector) return { ok: false, why: "detector backfired", text: t.trap, falseAcc: true };
    if (!t.needs) return { ok: true, text: t.pass };
    if (on[t.needs]) return { ok: true, text: t.pass };
    var lv = LEVERS.filter(function (l) { return l.key === t.needs; })[0];
    return { ok: false, why: lv ? lv.label : t.needs, text: t.fail };
  }

  /* ---------- trace: one item, step by step ---------- */

  function s(kind, label, body) { return { kind: kind, label: label, body: body }; }

  var TRACES = {
    flood: {
      title: "22:14 - a flood video with 40,000 reposts and a deadline in 20 minutes",
      build: function (on) {
        if (!on.reverse) {
          return { verdict: { ok: false, note: "Nothing in the newsroom was wrong except the missing 90-second check. Speed did not cause this. The absent check did." },
            steps: [
              s("user", "INBOUND", "A 14-second clip of water tearing through a street. No source, no location, a caption in the right language."),
              s("plan", "THE PRESSURE", "Two competitors have already posted it. The desk wants it in the 22:30 update."),
              s("call", "WHAT YOU DO", "You watch it twice. It looks real, because it IS real footage - of something else."),
              s("result", "PUBLISHED", "It runs as tonight's flooding."),
              s("answer", "OUTCOME ✗", "By morning a reader finds the original: a 2019 storm, another country. The correction outlives the story, and the next real video from that street gets doubted.")
            ] };
        }
        if (!on.metadata) {
          return { verdict: { ok: true, note: "Caught, and caught cheaply. Reverse search is the highest-yield 90 seconds in verification." },
            steps: [
              s("user", "INBOUND", "A 14-second clip of water tearing through a street. No source, no location."),
              s("call", "CHECK - reverse search", "Three keyframes into reverse video search. 90 seconds."),
              s("result", "HIT", "Same footage, published 2019, different country, different storm."),
              s("answer", "OUTCOME ✓", "Not published. You post a short note that the clip circulating tonight is old, which is itself a story your competitors do not have.")
            ] };
        }
        return { verdict: { ok: true, note: "Caught, dated, and turned into original reporting. Two checks, four minutes, one story your competitors do not have." },
          steps: [
            s("user", "INBOUND", "A 14-second clip of water tearing through a street. No source, no location."),
            s("call", "CHECK - reverse search", "Three keyframes into reverse video search. 90 seconds."),
            s("result", "HIT", "Same footage, published 2019, different country, different storm."),
            s("call", "CHECK - file history", "The uploaded file has been re-encoded twice and carries no capture data. The 2019 original does."),
            s("guard", "RAIL - what you can say", "You can state what is verifiable: this clip is not from tonight, here is the original, here is how we know."),
            s("answer", "OUTCOME ✓", "You publish the debunk at 22:29, with the method shown. It outperforms the clip.")
          ] };
      }
    },

    detector: {
      title: "23:40 - \"just run it through the AI detector\"",
      build: function (on) {
        if (on.detector) {
          return { verdict: { ok: false, note: "The tool did not find a fake. It manufactured an accusation against a real photograph, and the newsroom acted on it." },
            steps: [
              s("user", "SITUATION", "The desk buys an AI-image detector and runs the night's photo queue through it."),
              s("call", "SCAN", "31 images. Two flagged \"likely AI-generated\"."),
              s("result", "THE FLAGS", "One is the reader-submitted synthetic image, which file metadata had already caught. The other is the wire photo of the council vote."),
              s("guard", "WHAT THE TOOL ACTUALLY OUTPUTS", "A probability, from a model with no access to provenance, on an image that has been resized, recompressed and colour-corrected by three systems before it reached you. Every one of those steps looks like generation to a detector."),
              s("plan", "WHAT HAPPENS NEXT", "The wire photo is spiked. A supplier you have a contract with is quietly treated as a faker, on a number nobody in the room can explain."),
              s("answer", "OUTCOME ✗", "One true positive you already had, one false accusation you did not. Net contribution: negative.")
            ] };
        }
        if (!on.metadata) {
          return { verdict: { ok: false, note: "Refusing the detector was right. Having no provenance check either leaves the same question unanswered." },
            steps: [
              s("user", "SITUATION", "The desk debates buying an AI-image detector."),
              s("plan", "THE EDITOR", "She has read the evaluations. A probability score is not evidence and cannot be published as one. She says no."),
              s("result", "BUT", "The desk has no provenance workflow either - no file history, no Content Credentials check, no capture-data rule."),
              s("answer", "OUTCOME ✗", "No detector and no method. The reader-submitted synthetic image goes out under a reader credit.")
            ] };
        }
        return { verdict: { ok: true, note: "The provenance question is answerable. The detector question never was - it asks about the pixels, and you need to know about the chain." },
          steps: [
            s("user", "SITUATION", "The desk debates buying an AI-image detector."),
            s("plan", "THE EDITOR", "Wrong question. A detector guesses whether pixels were generated. We need to know where this file came from and what happened to it."),
            s("call", "WHAT YOU RUN INSTEAD", "Capture data present? Edit chain intact? Content Credentials attached? Does the submitter have the original at full resolution?"),
            s("result", "RESULT", "The reader image has no camera data and a generator signature. It is declined with a reason the reader can understand."),
            s("guard", "RAIL - the standing rule", "We publish what we can source, not what a score says. Absence of provenance means we do not run it - it never means we accuse anyone."),
            s("answer", "OUTCOME ✓", "Nothing to buy, and no honest contributor gets called a faker by a number.")
          ] };
      }
    }
  };

  /* ---------- rendering ---------- */

  function esc(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var KIND_META = {
    user: { cls: "ag-user", icon: "📥" },
    plan: { cls: "ag-plan", icon: "🧠" },
    call: { cls: "ag-call", icon: "🔍" },
    result: { cls: "ag-result", icon: "📦" },
    guard: { cls: "ag-guard", icon: "🛡" },
    answer: { cls: "ag-answer", icon: "🗞" }
  };

  function stepCard(step, idx) {
    var meta = KIND_META[step.kind] || KIND_META.plan;
    var card = document.createElement("div");
    card.className = "ag-step " + meta.cls;
    card.innerHTML =
      '<div class="ag-step-head"><span class="mcp-step-n">' + (idx + 1) + "</span>" +
      '<span class="ag-icon">' + meta.icon + "</span>" +
      '<span class="ag-label">' + esc(step.label) + "</span></div>" +
      '<pre class="ag-body">' + esc(step.body) + "</pre>";
    return card;
  }

  function leverBar(on, onChange) {
    var bar = document.createElement("div");
    bar.className = "ag-levers";
    LEVERS.forEach(function (lv) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "ag-lever" + (on[lv.key] ? " ag-on" : "");
      chip.title = lv.hint;
      chip.textContent = lv.key === "detector" ? "⚠ " + lv.label : lv.label;
      chip.addEventListener("click", function () {
        on[lv.key] = !on[lv.key];
        chip.classList.toggle("ag-on", on[lv.key]);
        onChange();
      });
      bar.appendChild(chip);
    });
    return bar;
  }

  function parseLevers(block) {
    var attr = block.getAttribute("data-levers");
    var start = attr === null ? "reverse,metadata,cross,primary,expert" : attr;
    var on = { reverse: false, metadata: false, cross: false, primary: false, expert: false, detector: false };
    start.split(",").forEach(function (k) { k = k.trim(); if (on.hasOwnProperty(k)) on[k] = true; });
    return on;
  }

  function honestyRail() {
    var p = document.createElement("p");
    p.className = "ag-rail";
    p.textContent = "The desk is a scripted teaching simulation replaying documented verification failure modes - the checks are the real ones a newsroom runs, and the detector behaves the way the published evaluations say detectors behave. Your night will contain items this desk does not.";
    return p;
  }

  function wireTrace(block) {
    var key = block.getAttribute("data-item");
    var sc = TRACES[key];
    if (!sc) { block.innerHTML = '<p class="sql-err">Unknown item: ' + esc(key) + "</p>"; return; }
    var on = parseLevers(block);
    block.classList.add("agentbox-ready");

    var bar = document.createElement("div");
    bar.className = "sql-bar";
    bar.innerHTML = '<span class="sql-dot"></span>';
    var title = document.createElement("span"); title.className = "sql-title";
    title.textContent = sc.title; bar.appendChild(title);
    var spacer = document.createElement("span"); spacer.className = "sql-spacer"; bar.appendChild(spacer);
    var counter = document.createElement("span"); counter.className = "mcp-counter"; bar.appendChild(counter);
    var backBtn = document.createElement("button");
    backBtn.type = "button"; backBtn.className = "sql-btn"; backBtn.textContent = "◀ Back"; bar.appendChild(backBtn);
    var nextBtn = document.createElement("button");
    nextBtn.type = "button"; nextBtn.className = "sql-btn sql-run"; nextBtn.textContent = "Next ▶"; bar.appendChild(nextBtn);
    var allBtn = document.createElement("button");
    allBtn.type = "button"; allBtn.className = "sql-btn"; allBtn.textContent = "Show all"; bar.appendChild(allBtn);
    block.appendChild(bar);

    var feed = document.createElement("div"); feed.className = "ag-feed";
    var verdict = document.createElement("div");
    var shown = 1, current = sc.build(on);

    block.appendChild(leverBar(on, function () {
      current = sc.build(on); shown = current.steps.length; render();
    }));
    block.appendChild(feed);
    block.appendChild(verdict);
    block.appendChild(honestyRail());

    function render() {
      feed.innerHTML = "";
      current.steps.slice(0, shown).forEach(function (st, i) { feed.appendChild(stepCard(st, i)); });
      counter.textContent = shown + " / " + current.steps.length;
      backBtn.disabled = shown <= 1;
      nextBtn.disabled = shown >= current.steps.length;
      if (shown >= current.steps.length) {
        verdict.className = "ag-verdict " + (current.verdict.ok ? "ag-pass" : "ag-fail");
        verdict.textContent = (current.verdict.ok ? "HELD UP - " : "FAILED - ") + current.verdict.note;
      } else { verdict.className = "ag-verdict ag-quiet"; verdict.textContent = ""; }
    }
    nextBtn.addEventListener("click", function () { if (shown < current.steps.length) { shown++; render(); } });
    backBtn.addEventListener("click", function () { if (shown > 1) { shown--; render(); } });
    allBtn.addEventListener("click", function () { shown = current.steps.length; render(); });
    render();
  }

  function wireScore(block) {
    var on = parseLevers(block);
    block.classList.add("agentbox-ready");

    var bar = document.createElement("div");
    bar.className = "sql-bar";
    bar.innerHTML = '<span class="sql-dot"></span><span class="sql-title">The verification desk - 10 items, one night</span>';
    block.appendChild(bar);

    var big = document.createElement("div");
    block.appendChild(leverBar(on, render));
    block.appendChild(big);
    var table = document.createElement("div"); table.className = "ag-score-table";
    block.appendChild(table);
    block.appendChild(honestyRail());

    function render() {
      var ok = 0, falseAcc = 0;
      table.innerHTML = "";
      ITEMS.forEach(function (t) {
        var r = itemResult(t, on);
        if (r.ok) ok++;
        if (r.falseAcc) falseAcc++;
        var row = document.createElement("div");
        row.className = "ag-score-row " + (r.ok ? "ag-row-pass" : "ag-row-fail");
        var tag = r.ok ? "" : '<span class="ag-why">missing: ' + esc(r.why) + "</span>";
        row.innerHTML =
          '<span class="ag-mark">' + (r.falseAcc ? "⚠" : r.ok ? "✓" : "✗") + "</span>" +
          '<span class="ag-q">' + esc(t.q) + tag + "</span>" +
          '<span class="ag-out">' + esc(r.text) + "</span>";
        table.appendChild(row);
      });
      big.className = "ag-score-big " + (ok === ITEMS.length ? "ag-pass" : ok >= 6 ? "ag-mid" : "ag-fail");
      big.textContent = ok + " / " + ITEMS.length + " items handled correctly" +
        (falseAcc ? "  ·  " + falseAcc + " false accusation" + (falseAcc > 1 ? "s" : "") : "  ·  0 false accusations");
    }
    render();
  }

  function boot() {
    var blocks = document.querySelectorAll(".mediabox");
    Array.prototype.forEach.call(blocks, function (block) {
      if (block.classList.contains("agentbox-ready")) return;
      var mode = block.getAttribute("data-mode") || "score";
      if (mode === "trace") wireTrace(block); else wireScore(block);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
