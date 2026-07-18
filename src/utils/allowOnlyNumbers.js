export const allowOnlyNumbers = (e) => {
  const allowedKeys = [
    "Backspace",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Delete",
    "Home",
    "End",
    ".",
  ];

  if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }

  if (e.key === "." && e.currentTarget.value.includes(".")) {
    e.preventDefault();
  }
};
