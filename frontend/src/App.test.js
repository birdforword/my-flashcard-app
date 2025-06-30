import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows deck list heading", () => {
  render(<App />);
  const heading = screen.getByText(/デッキ一覧/i);
  expect(heading).toBeInTheDocument();
});
