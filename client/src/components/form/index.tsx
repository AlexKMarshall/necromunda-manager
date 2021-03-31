/** @jsxImportSource @emotion/react */
import { FieldError } from "react-hook-form";
import { stackSmall } from "../../styles";
import faker from "faker";

interface StandardFormControlProps {
  name: string;
  label: string;
  renderControlElement: (props: RenderControlElementProps) => React.ReactNode;
  error?: FieldError;
}
interface RenderControlElementProps {
  id: string;
  name: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function StandardFormControl({
  name,
  label,
  renderControlElement,
  error,
}: StandardFormControlProps) {
  const id = faker.random.uuid();
  const errorId = faker.random.uuid();
  const invalid = Boolean(error);
  const describedBy = invalid ? errorId : undefined;
  return (
    <div css={stackSmall}>
      <label htmlFor={id}>{label}</label>
      {renderControlElement({
        id,
        name,
        "aria-invalid": invalid,
        "aria-describedby": describedBy,
      })}
      {invalid ? (
        <span role="alert" id={errorId}>
          {error?.message}
        </span>
      ) : null}
    </div>
  );
}
