import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StandardFormControl } from ".";

test("renders a control with a label", () => {
  const name = "inputName";
  const label = "Input Label";
  render(
    <StandardFormControl
      name={name}
      label={label}
      renderControlElement={(props) => <input {...props} />}
    />
  );
  expect(screen.getByLabelText(label)).toBeInTheDocument();
});

test("renders an error message if provided", () => {
  const name = "inputName";
  const label = "Input Label";
  const { rerender } = render(
    <StandardFormControl
      name={name}
      label={label}
      renderControlElement={(props) => <input {...props} />}
    />
  );

  const input = screen.getByLabelText(label);
  expect(input).toBeValid();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();

  const errorMessage = "test Error";
  rerender(
    <StandardFormControl
      name={name}
      label={label}
      renderControlElement={(props) => <input {...props} />}
      error={{ type: "required", message: errorMessage }}
    />
  );

  expect(input).toBeInvalid();
  expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
});
