import { Alert } from "react-bootstrap";

export default function Message({ variant, children }) {
  const isObject = (value) => {
    return typeof value === "object" && value !== null;
  };

  return (
    <Alert variant={variant}>
      {isObject(children) && !Array.isArray(children)
        ? JSON.stringify(children, null, 2)
        : children}
    </Alert>
  );
}

Message.defaultProps = {
  variant: "info",
};
