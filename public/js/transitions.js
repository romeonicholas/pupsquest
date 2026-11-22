const styles = getComputedStyle(document.documentElement);
const animationLength =
  parseFloat(styles.getPropertyValue("--animation-length")) || 1;

export function wait(milliseconds) {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds * animationLength),
  );
}
