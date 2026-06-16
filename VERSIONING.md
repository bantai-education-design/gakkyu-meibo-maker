# バージョン管理ルール

このアプリは、変更ごとに必ずバージョン番号を更新してGitHubで管理します。

## 番号の運用方針

- **v0.x.x は開発・試験段階**のバージョンです。
- **v1.0.0 は最初の正式製品版**とします。
- 正式公開、Vector登録、公式ホームページ掲載、一般配布では必ず **v1.0.0 以上**を使用します。

## 番号の付け方（v1.0.0以降）

- 軽微な不具合修正はパッチ番号を上げる（例：v1.0.0 → v1.0.1）
- 機能追加はマイナー番号を上げる（例：v1.0.1 → v1.1.0）
- 大幅な仕様変更はメジャー番号を上げる（例：v1.1.0 → v2.0.0）

## 更新する場所

- `package.json` の `version`
- `src/version.ts` の `APP_VERSION`
- `CHANGELOG.md` の変更内容
- Gitタグ `class-roster-maker-vX.Y.Z`

## GitHubへ送る流れ

```bash
npm run build
git add .
git commit -m "Release class roster maker vX.Y.Z"
git tag class-roster-maker-vX.Y.Z
git push origin master
git push origin class-roster-maker-vX.Y.Z
```
