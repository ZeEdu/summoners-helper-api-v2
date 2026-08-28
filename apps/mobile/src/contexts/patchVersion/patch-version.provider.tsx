import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { PatchVersionContext, PatchVersionType } from './patch-version.context';

export default function PatchVersionProvider({ children }: PropsWithChildren) {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    async function getCurrenVersion() {
      const response = await fetch(
        'https://ddragon.leagueoflegends.com/api/versions.json',
      );
      const json = await response.json();
      return json[0];
    }

    async function loadDataDragon() {
      const version = await getCurrenVersion();
      setVersion(version);
    }

    loadDataDragon();
  }, []);

  const value: PatchVersionType = useMemo(() => ({ version }), [version]);

  return (
    <PatchVersionContext.Provider value={value}>
      {children}
    </PatchVersionContext.Provider>
  );
}