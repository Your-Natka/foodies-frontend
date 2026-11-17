import { useSyncExternalStore } from "react";

import {
  getInstallSnapshot,
  isIOS,
  promptInstall,
  subscribeInstall,
} from "../pwa/installPrompt";

export function useInstallApp() {
  const { canPrompt, installed } = useSyncExternalStore(
    subscribeInstall,
    getInstallSnapshot,
  );

  const ios = isIOS();

  return {
    // Show the button only when installing is actually possible.
    canInstall: !installed && (canPrompt || ios),
    needsManualSteps: !installed && !canPrompt && ios,
    install: promptInstall,
  };
}
