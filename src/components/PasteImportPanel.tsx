import { useState } from "react";
import type { Student } from "../types";
import { mergeStudentsFromPaste, parsePastedStudentTable } from "../utils/pasteTableParser";

interface PasteImportPanelProps {
  students: Student[];
  onReplaceStudents: (students: Student[], message: string) => void;
}

export function PasteImportPanel({ students, onReplaceStudents }: PasteImportPanelProps) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const importPaste = () => {
    const result = parsePastedStudentTable(text);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    const nextStudents = mergeStudentsFromPaste(students, result.students);
    onReplaceStudents(nextStudents, `${nextStudents.length}人の貼り付けデータを取り込みました。`);
    setMessage(`${nextStudents.length}人の貼り付けデータを取り込みました。`);
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
