# Livkors Projesini GitHub'a Ekleme Rehberi

## 1. GitHub Hesabı ve Repository Oluşturma

### Adım 1: GitHub'da Repository Oluştur
1. [GitHub.com](https://github.com)'a git
2. Sağ üstteki "+" butonuna tıkla
3. "New repository" seç
4. Repository bilgileri:
   - **Repository name**: `livkors-ecommerce`
   - **Description**: "Livkors çanta mağazası - Next.js ile e-ticaret sitesi"
   - **Public** olarak işaretle (isterseniz Private de olabilir)
   - README, .gitignore ve license **ekleme** (zaten var)

### Adım 2: Repository'yi Bağla
Terminalda (my-app klasöründe):

```bash
git remote add origin https://github.com/KULLANICI_ADINIZ/livkors-ecommerce.git
git branch -M main
git push -u origin main
```

**Not**: `KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı yazın.

## 2. Personal Access Token (PAT) Gerekebilir

Eğer şifre sorulursa:
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" tıkla
3. Token için:
   - **Note**: "Livkors Repository Access"
   - **Expiration**: 90 days (ya da istediğiniz süre)
   - **Scopes**: `repo` işaretle
4. Token'ı kopyala ve şifre yerine kullan

## 3. .env Dosyası Güvenliği

GitHub'a yüklemeden önce `.env` dosyanızın güvenli olduğundan emin olun:

```bash
# .env dosyası .gitignore'da olmalı
echo ".env" >> .gitignore
```

Örnek `.env.example` dosyası:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key-here"
NEXTAUTH_SECRET="your-nextauth-secret-here"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 4. Repository'ye Eklenecek Dosyalar

✅ **Eklenecekler**:
- Kaynak kod (src/, prisma/, public/)
- package.json, package-lock.json
- README.md, deployment-guide.md
- next.config.mjs, jsconfig.json
- .gitignore

❌ **Eklenmeyecekler**:
- .env (hassas bilgiler)
- node_modules/ (npm install ile kurulur)
- .next/ (build dosyaları)
- prisma/dev.db (veritabanı dosyası)
- public/uploads/ (yüklenen dosyalar)

## 5. Branch Stratejisi

### Ana Branschlar:
- `main`: Canlı/üretim kodu
- `development`: Geliştirme kodu
- `feature/xyz`: Yeni özellikler

### Workflow:
```bash
# Yeni özellik için
git checkout -b feature/yeni-ozellik
# ... kodlama ...
git add .
git commit -m "feat: yeni özellik eklendi"
git push origin feature/yeni-ozellik
# GitHub'da Pull Request oluştur
```

## 6. Commit Mesaj Formatı

```
feat: yeni özellik eklendi
fix: hata düzeltildi
docs: dokümantasyon güncellendi
style: kod formatı düzenlendi
refactor: kod refactor edildi
test: test eklendi
chore: bakım işleri
```

## 7. GitHub Actions (İsteğe Bağlı)

Otomatik deployment için `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 8. README Güncelle

README.md dosyanızı projeyi açıklayacak şekilde güncelleyin:
- Proje açıklaması
- Kurulum talimatları
- Kullanım örnekleri
- Katkıda bulunma rehberi

## 9. Issues ve Projects

GitHub'da proje yönetimi için:
- **Issues**: Bug raporları, özellik istekleri
- **Projects**: Kanban board ile task yönetimi
- **Wiki**: Detaylı dokümantasyon

## 10. Collaborators Ekleme

Takım üyeleri eklemek için:
1. Repository Settings → Manage access
2. "Invite a collaborator" tıkla
3. GitHub kullanıcı adı veya email gir

---

🎉 **Tebrikler!** Livkors projesi artık GitHub'da güvenle saklanıyor ve takım çalışmasına hazır! 