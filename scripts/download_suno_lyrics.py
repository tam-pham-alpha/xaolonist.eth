#!/usr/bin/env python3
import os
import sys
import re
import json
import urllib.request

# Look for .env in the project root (parent of scripts directory)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(project_root, ".env")

def get_session_token():
    if not os.path.exists(env_path):
        print(f"Error: .env configuration file not found at: {env_path}", file=sys.stderr)
        return None
    with open(env_path, "r", encoding="utf-8") as f:
        content = f.read()
    cookie_str = None
    for line in content.splitlines():
        if "SUNO_COOKIE" in line:
            parts = line.split("=", 1)
            if len(parts) == 2:
                cookie_str = parts[1].strip().strip('"').strip("'")
                break
    if not cookie_str:
        print("Error: SUNO_COOKIE not found in .env", file=sys.stderr)
        return None
    match = re.search(r'__session=([^;]+)', cookie_str)
    if not match:
        print("Error: __session token not found in SUNO_COOKIE", file=sys.stderr)
        return None
    return match.group(1).strip()

def format_time(seconds):
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    ms = int((seconds % 1) * 100)
    return f"[{minutes:02d}:{secs:02d}.{ms:02d}]"

import subprocess

def download_file(url, dest_path):
    # Use system curl to download the file to bypass urllib connection blocks
    subprocess.run(["curl", "-sL", url, "-o", dest_path], check=True)

def extract_uuid_and_html_from_url(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching URL {url}: {e}", file=sys.stderr)
        return None, None
        
    # Try finding the song URL pattern in rel="canonical" or JSON scripts: e.g. suno.com/song/<uuid>
    match = re.search(r'suno\.com/song/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', html)
    if match:
        return match.group(1), html
        
    # Fallback to general UUID regex match in the HTML
    uuid_pattern = re.compile(r'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}')
    matches = uuid_pattern.findall(html)
    if matches:
        # Avoid UUIDs starting with '019' if possible
        for m in matches:
            if not m.startswith('019'):
                return m, html
        return matches[0], html
    return None, None

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/download_suno_lyrics.py <song_id_or_url> <output_dir> [vn_or_en]")
        sys.exit(1)
        
    url_or_uuid = sys.argv[1]
    output_dir = sys.argv[2]
    lang = sys.argv[3].lower() if len(sys.argv) > 3 else "vn"
    
    song_id = None
    html = None
    if url_or_uuid.startswith("http://") or url_or_uuid.startswith("https://"):
        print(f"Resolving Suno share URL: {url_or_uuid}...")
        song_id, html = extract_uuid_and_html_from_url(url_or_uuid)
        if not song_id:
            print("Error: Could not resolve song UUID from share URL.", file=sys.stderr)
            sys.exit(1)
        print(f"Resolved Song UUID: {song_id}")
    else:
        uuid_pattern = re.compile(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
        if not uuid_pattern.match(url_or_uuid):
            print("Error: Invalid Suno UUID format.", file=sys.stderr)
            sys.exit(1)
        song_id = url_or_uuid
    
    os.makedirs(output_dir, exist_ok=True)
    
    token = get_session_token()
    if not token:
        sys.exit(1)
        
    # File naming based on language
    audio_filename = "audio.mp3" if lang == "vn" else "audio.en.mp3"
    lyrics_prefix = "lyrics" if lang == "vn" else "lyrics.en"
    
    # Resolve the audio download URL
    audio_url = None
    if html:
        # Search for direct CDN URL
        pattern = rf'https://cdn[0-9]\.suno\.ai/{song_id}\.mp3'
        match = re.search(pattern, html)
        if match:
            audio_url = match.group(0)
        else:
            escaped_pattern = rf'https:\\/\\/cdn[0-9]\.suno\.ai\\/{song_id}\.mp3'
            match = re.search(escaped_pattern, html)
            if match:
                audio_url = match.group(0).replace(r'\/', '/')
    
    if not audio_url:
        audio_url = f"https://audiopipe.suno.ai/?item_id={song_id}"
        
    audio_dest = os.path.join(output_dir, audio_filename)
    print(f"Downloading MP3 from {audio_url} to: {audio_dest} ...")
    try:
        download_file(audio_url, audio_dest)
        print("MP3 Downloaded successfully.")
    except Exception as e:
        print(f"Error downloading MP3: {e}", file=sys.stderr)
        sys.exit(1)
        
    # 2. Download aligned lyrics JSON
    url = f"https://studio-api.prod.suno.com/api/gen/{song_id}/aligned_lyrics/v2/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Authorization': f'Bearer {token}',
        'Accept': 'application/json, text/plain, */*',
    }
    
    print(f"Requesting aligned lyrics for song {song_id}...")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8')
            data = json.loads(content)
    except Exception as e:
        print(f"Error calling Suno API: {e}", file=sys.stderr)
        if hasattr(e, 'read'):
            print(e.read().decode('utf-8', errors='ignore'), file=sys.stderr)
        sys.exit(1)
        
    # Save the raw JSON data
    json_out = os.path.join(output_dir, f"{lyrics_prefix}.json")
    with open(json_out, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved raw timestamped lyrics to: {json_out}")
    
    # Generate LRC file from aligned_lyrics
    lrc_lines = []
    aligned_lyrics = data.get("aligned_lyrics", [])
    for line in aligned_lyrics:
        text = line.get("text", "").strip()
        start_s = line.get("start_s", 0)
        timestamp = format_time(start_s)
        lrc_lines.append(f"{timestamp}{text}")
        
    lrc_out = os.path.join(output_dir, f"{lyrics_prefix}.lrc")
    with open(lrc_out, "w", encoding="utf-8") as f:
        f.write("\n".join(lrc_lines))
    print(f"Saved LRC file to: {lrc_out}")

if __name__ == "__main__":
    main()
