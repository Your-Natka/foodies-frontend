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
    canInstall: !installed,
    needsManualSteps: !canPrompt,
    isIOS: ios,
    install: promptInstall,
  };
}
