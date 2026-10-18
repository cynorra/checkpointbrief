# Checkpoint Brief

GTA 6 merkezli, kaynaklı ve tarihli oyun sitesi: GTA 6 hub'ı, geri sayım, çıkış takvimi, Epic bedava oyun takipçisi ve rehberler.

**Stack:** Astro 7 (statik) · React 19 adacıkları · shadcn/ui · Tailwind 4 · Motion · Archivo + Geist.

## Çalıştırma

```bash
npm install
npm run dev                         # http://localhost:4321
npm test                            # veri testleri
npm run build                       # dist/
PREVIEW_FUTURE=1 npm run build      # ileri tarihli rehberleri de görmek için (deploy'da ASLA)
node scripts/check-links.mjs        # iç linkler + rehber sırası kontrolü
```

Node 22+.

## Yapı

| Dosya | Ne işe yarar |
| --- | --- |
| `src/site.config.js` | Marka, domain, e-posta, yazar, menü, AdSense ID |
| `src/lib/data/gta6.js` | GTA 6 gerçekleri, sürümler, bonuslar, harita, zaman çizelgesi, söylentiler. Her satırın `source` anahtarı var. Yeni bilgi gelince burayı ve `UPDATED` tarihini değiştir. |
| `src/lib/data/sources.js` | Tüm dış kaynaklar ve kontrol tarihleri (How we verify sayfası buradan listeler) |
| `src/lib/data/releases.js` | Çıkış takvimi. Sadece kesin günü olan oyunlar. Kontrol edince `CHECKED` tarihini güncelle. Geçmiş tarihler kendiliğinden düşer. |
| `src/lib/data/epic.js` | Epic bedava oyun verisi, her build'de okunur. Okunamazsa sayfa Epic'e yönlendirir, eski liste göstermez. |
| `src/lib/topics.js` | Bölümler (gta6, releases, deals, general) = rehberlerdeki `tool` alanı |
| `src/content/guides/*.md` | Rehberler. `published` tarihi gelmeden yayına girmez. Rehber sadece kendinden ÖNCE yayınlanan rehberlere link verebilir. |
| `src/page-dates.js` | Rehber dışı sayfaların tarihleri |

## Deploy (GitHub Actions → Cloudflare Pages)

- Her gün 13:05 UTC (zamanlanmış rehberler yayına girer) ve perşembe 16:10 UTC (Epic rotasyonundan sonra) build alır.
- Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Variable: `CLOUDFLARE_PAGES_PROJECT`.
- **`SUPABASE_SERVICE_ROLE_KEY` sadece kendi bilgisayarında `push-guides.mjs` için. GitHub, Cloudflare veya istemci koduna ASLA koyma. `.env` commit edilmez.**

## Yeni kurulum adımları

1. Yeni Supabase projesi aç → SQL editöründe `supabase/migrations/20261018000000_articles.sql` çalıştır.
2. Yerelde `.env` (bkz. `.env.example`) → `node scripts/push-guides.mjs` ile rehberleri yükle.
3. GitHub'da repo aç, secrets/variable'ı ekle, push et.
4. Cloudflare Pages projesi (`checkpointbrief`), custom domain `checkpointbrief.com`.
5. Cloudflare Email Routing: `hello@checkpointbrief.com` → kişisel Gmail.
6. Google Search Console + Bing Webmaster: doğrulama kodlarını `site.config.js` → `verification` içine yaz, sitemap gönder (`/sitemap-index.xml`).
7. AdSense: Material Guides hesabı onaylandıktan sonra bu siteyi aynı hesaba ekle, publisher ID'yi `adsensePublisherId`'ye yaz.

## İçerik kuralları (AdSense için)

- Görsel: sadece resmi basın görselleri veya kendi SVG'lerimiz. Şiddet, kan, çıplaklık görseli yok.
- Kumar / loot box içeriği yok. Sızıntı görüntü/harita yok.
- Söylentiler ayrı tabloda, "unconfirmed" etiketiyle.
- Videodan yazılan rehberlerde video kaynağı belirtilir, metin kendi cümlelerimizle yazılır.
- Kaynak linki olmayan sayı (dosya boyutu, fps, harita boyutu) kesin bilgi gibi yazılmaz.
