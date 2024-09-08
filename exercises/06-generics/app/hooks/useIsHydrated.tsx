// https://remix.run/docs/en/main/guides/migrating-react-router-app#client-only-components

import { useEffect, useState } from "react";

let isHydrating = true;
export default function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
