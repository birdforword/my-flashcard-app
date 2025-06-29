import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows card section heading", () => {
  render(<App />);
  const heading = screen.getByText(/cards/i);
  expect(heading).toBeInTheDocument();
});
