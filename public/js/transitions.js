const styles = getComputedStyle(document.documentElement);
const motionScale = parseFloat(styles.getPropertyValue("--motion-scale")) || 1;

export function wait(milliseconds) {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds * motionScale),
  );
}
