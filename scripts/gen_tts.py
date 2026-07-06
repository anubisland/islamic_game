#!/usr/bin/env python3
"""Generate narration MP3s for Islamic Game Hub intro card.

Output: public/audio/<slot>/gamehub_intro_<collapsed|full>_<ar|en>.mp3

Requires: pip install edge-tts
"""

import argparse
import asyncio
import json
import os
import sys

import edge_tts

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "public", "audio")

SLOTS = {
    "classic": {
        "ar": "ar-SA-HamedNeural",
        "en": "en-US-GuyNeural",
        "labelAr": "حامد",
        "labelEn": "Hamed",
        "descAr": "صوت فصيح",
        "descEn": "Classic male",
    },
    "gentle": {
        "ar": "ar-SA-ZariyahNeural",
        "en": "en-US-AriaNeural",
        "labelAr": "زارية",
        "labelEn": "Zariyah",
        "descAr": "صوت هادئ",
        "descEn": "Gentle female",
    },
    "story": {
        "ar": "ar-EG-SalmaNeural",
        "en": "en-US-JennyNeural",
        "labelAr": "سلمى",
        "labelEn": "Salma",
        "descAr": "حكواتية",
        "descEn": "Storyteller female",
    },
    "warm": {
        "ar": "ar-OM-AbdullahNeural",
        "en": "en-GB-RyanNeural",
        "labelAr": "عبدالله",
        "labelEn": "Abdullah",
        "descAr": "صوت ودود",
        "descEn": "Warm male",
    },
    "shakir": {
        "ar": "ar-EG-ShakirNeural",
        "en": "en-US-BrianNeural",
        "labelAr": "شاكر",
        "labelEn": "Shakir",
        "descAr": "صوت مصري",
        "descEn": "Egyptian male",
    },
}

TEXTS = {
    "ar": {
        "title": "مَرْحَباً بِكَ فِي أَلْعَابِ الذَّكَاءِ الْإِسْلَامِيَّةِ",
        "desc": "هَذَا الْمَشْرُوعُ يَدْمِجُ بَيْنَ الْعَابِ الذَّكَاءِ وَالتَّوَجُّهِ الْإِسْلَامِيِّ لِتَقْدِيمِ مُحْتَوًى هَادِفٍ وَمُمْتِعٍ يُنَاسِبُ مُخْتَلِفَ الْأَعْمَارِ. نَسْعَى لِتَعْلِيمِ الْقِيَمِ الْإِسْلَامِيَّةِ وَالْمَعْرِفَةِ الدِّينِيَّةِ بِأُسْلُوبٍ تَفَاعُلِيٍّ شَيِّقٍ، بِاللُّغَتَيْنِ الْعَرَبِيَّةِ وَالْإِنْجْلِيزِيَّةِ وَلِلْمُهَاجِرِينَ وَالْمُقِيمِينَ فِي الْبِلَادِ الْغَرْبِيَّةِ وَلِغَيْرِ النَّاطِقِينَ بِاللُّغَةِ الْعَرَبِيَّةِ، فِي إِطَارٍ مِنَ الدَّعْوَةِ إِلَى اللَّهِ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ.",
        "features": [
            "مُنَاسِبٌ لِجَمِيعِ الْأَعْمَارِ",
            "مُحْتَوًى مِنْ مَصَادِرَ مَوْثُوقَةٍ",
            "بِالْعَرَبِيَّةِ وَالْإِنْجْلِيزِيَّةِ",
            "بِدُونِ مُوسِيقَى أَوْ صُوَرِ ذَوَاتِ أَرْوَاحٍ",
            "أُسْلُوبٌ تَفَاعُلِيٌّ مُمْتِعٌ",
        ],
    },
    "en": {
        "title": "Welcome to Islamic IQ Games",
        "desc": "This project combines IQ games with Islamic orientation to provide meaningful and enjoyable content suitable for all ages. We aim to teach Islamic values and religious knowledge in an engaging interactive style, in both Arabic and English for non-Arabic speakers, as part of calling to Allah with wisdom and good counsel.",
        "features": [
            "Suitable for all ages",
            "Content from reliable sources",
            "In Arabic and English",
            "No music or animated images",
            "Fun interactive style",
        ],
    },
}

RATE = "-10%"
VOLUME = "+0%"
CONCURRENCY = 6


def build_texts():
    """Return dict mapping (variant, lang) -> full spoken text."""
    result = {}
    for lang in ("ar", "en"):
        data = TEXTS[lang]
        collapsed = f"{data['title']}. {data['desc']}"
        full = f"{collapsed}. {' '.join(data['features'])}"
        result[("collapsed", lang)] = collapsed
        result[("full", lang)] = full
    return result


async def synth_one(sem, voice, text, out_path, force):
    if not text.strip():
        return ("skip-empty", out_path)
    if os.path.exists(out_path) and not force:
        return ("exists", out_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    async with sem:
        try:
            await edge_tts.Communicate(text, voice, rate=RATE, volume=VOLUME).save(out_path)
            return ("ok", out_path)
        except Exception as exc:
            return (f"error: {exc}", out_path)


def write_manifest(slots):
    manifest = {
        "rate": RATE,
        "slots": {sid: SLOTS[sid] for sid in slots},
        "files": ["gamehub_intro_collapsed_ar", "gamehub_intro_collapsed_en", "gamehub_intro_full_ar", "gamehub_intro_full_en"],
    }
    os.makedirs(AUDIO_DIR, exist_ok=True)
    with open(os.path.join(AUDIO_DIR, "manifest.json"), "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, ensure_ascii=False, indent=2)


async def main_async(args):
    all_texts = build_texts()
    slots = args.slots or list(SLOTS)
    langs = args.langs or ["ar", "en"]
    variants = args.variants or ["collapsed", "full"]
    sem = asyncio.Semaphore(CONCURRENCY)
    tasks = []

    for slot in slots:
        for lang in langs:
            for variant in variants:
                voice = SLOTS[slot][lang]
                text = all_texts[(variant, lang)]
                out_path = os.path.join(AUDIO_DIR, slot, f"gamehub_intro_{variant}_{lang}.mp3")
                tasks.append(synth_one(sem, voice, text, out_path, args.force))

    print(f"Generating {len(tasks)} clips: slots={slots}, langs={langs}, variants={variants}")
    results = await asyncio.gather(*tasks)
    stats = {"ok": 0, "exists": 0, "skip-empty": 0, "error": 0}
    for status, path in results:
        if status in stats:
            stats[status] += 1
        else:
            stats["error"] += 1
            print(f"{status}: {os.path.relpath(path, ROOT)}", file=sys.stderr)
    write_manifest(slots)
    print(f"Done: {stats}")


def parse_args():
    parser = argparse.ArgumentParser(description="Generate narration MP3 files for Islamic Game Hub.")
    parser.add_argument("--slots", nargs="*", choices=list(SLOTS), help="voice slots to generate")
    parser.add_argument("--langs", nargs="*", choices=["ar", "en"], help="languages to generate")
    parser.add_argument("--variants", nargs="*", choices=["collapsed", "full"], help="variants to generate")
    parser.add_argument("--force", action="store_true", help="regenerate existing MP3s")
    return parser.parse_args()


if __name__ == "__main__":
    asyncio.run(main_async(parse_args()))
