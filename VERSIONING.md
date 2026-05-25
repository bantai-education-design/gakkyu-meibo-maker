# バージョン管理ルール

このアプリは、変更ごとに必ずバージョン番号を更新してGitHubで管理します。

## 更新する場所

- `package.json` の `version`
- `src/version.ts` の `APP_VERSION`
- `CHANGELOG.md` の変更内容
- Gitタグ `class-roster-maker-vX.Y.Z`

## 番号の付け方

- `0.1.1` のようなパッチ更新: 表示調整、小さな不具合修正
- `0.2.0` のようなマイナー更新: CSV読み込みなど機能追加
- `1.0.0` のようなメジャー更新: 保存形式や印刷仕様など互換性に大きく影響する変更

## GitHubへ送る流れ

```bash
npm run build
git add 学級名簿メーカー
git commit -m "Release class roster maker vX.Y.Z"
git tag class-roster-maker-vX.Y.Z
git push origin master
git push origin class-roster-maker-vX.Y.Z
```
