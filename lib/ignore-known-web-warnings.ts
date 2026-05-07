const ignoredWarnings = [
  "props.pointerEvents is deprecated. Use style.pointerEvents",
];

const consoleWithNsnFilter = console as Console & {
  __nsnKnownWarningFilterInstalled?: boolean;
};

if (process.env.NODE_ENV !== "production" && !consoleWithNsnFilter.__nsnKnownWarningFilterInstalled) {
  const originalWarn = console.warn.bind(console);

  console.warn = (...args: unknown[]) => {
    const message = typeof args[0] === "string" ? args[0] : "";

    if (ignoredWarnings.some((warning) => message.includes(warning))) {
      return;
    }

    originalWarn(...args);
  };

  consoleWithNsnFilter.__nsnKnownWarningFilterInstalled = true;
}
