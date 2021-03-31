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
}

export function StandardFormControl({
  name,
  label,
  renderControlElement,
  error,
}: StandardFormControlProps) {
  const id = faker.random.uuid();
  return (
    <div css={stackSmall}>
      <label htmlFor={id}>{label}</label>
      {renderControlElement({ id, name })}
      {error ? <span role="alert">{error.message}</span> : null}
    </div>
  );
}
