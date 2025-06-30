import { render, screen } from "@testing-library/react";
import App from "./App";

<<<<<<< HEAD
test('renders the 表示 button', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: '表示' });
  expect(button).toBeInTheDocument();
=======
test("shows deck list heading", () => {
  render(<App />);
  const heading = screen.getByText(/デッキ一覧/i);
  expect(heading).toBeInTheDocument();
>>>>>>> codex/動画プレイヤーにタイムスタンプ表示と作成ボタン追加
});
