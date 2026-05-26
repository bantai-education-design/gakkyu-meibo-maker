import { useState } from "react";
import type { Student } from "../types";
import {
  mergeStudentsFromPaste,
  parsePastedStudentTable,
  replaceStudentsFromPaste
} from "../utils/pasteTableParser";

interface PasteImportPanelProps {
  students: Student[];
  onReplaceStudents: (students: Student[], message: string) => void;
}

export function PasteImportPanel({ students, onReplaceStudents }: PasteImportPanelProps) {
  const [text, setText] = useState("");
  const [importMode, setImportMode] = useState<"append" | "replace">("append");
  const [message, setMessage] = useState("");

  const importPaste = () => {
    const result = parsePastedStudentTable(text);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    if (importMode === "replace" && !window.confirm("現在の名簿データを置き換えます。よろしいですか？")) {
      return;
    }

    const nextStudents = importMode === "append"
      ? mergeStudentsFromPaste(students, result.students)
      : replaceStudentsFromPaste(result.students);
    const actionLabel = importMode === "append" ? "追加" : "置き換え";
    onReplaceStudents(nextStudents, `${result.students.length}人の貼り付けデータを${actionLabel}しました。`);
    setMessage(`${result.students.length}人の貼り付けデータを${actionLabel}しました。`);
  };

  return (
    <section className="data-card paste-panel">
      <div className="data-card-title">
        <h2>貼り付け入力</h2>
        <p>Excelなどからコピーした表を貼り付けて取り込めます。</p>
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={"番号\t姓\t名\t姓ふりがな\t名ふりがな\t性別\t班\t備考\n1\t青木\t陽菜\tあおき\tひな\t女\t1班\t"}
      />
      <div className="paste-mode">
        <label className="check-row">
          <input
            type="radio"
            name="paste-import-mode"
            checked={importMode === "append"}
            onChange={() => setImportMode("append")}
          />
          <span>現在の名簿に追加する</span>
        </label>
        <label className="check-row">
          <input
            type="radio"
            name="paste-import-mode"
            checked={importMode === "replace"}
            onChange={() => setImportMode("replace")}
          />
          <span>現在の名簿を置き換える</span>
        </label>
      </div>
      <div className="paste-actions">
        <button className="primary-action" type="button" onClick={importPaste}>
          表として取り込む
        </button>
        <button className="secondary-button compact-action" type="button" onClick={() => setText("")}>
          入力欄を空にする
        </button>
      </div>
      {message ? <div className="storage-message">{message}</div> : null}
    </section>
  );
}
